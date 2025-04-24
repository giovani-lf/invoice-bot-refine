import { app } from '../../lib/slackClient';
import { supabase } from '../../lib/supabaseClient';

app.view('invoice_step_1', async ({ ack, view }) => {
  try {
    const values = view.state.values;

    const extractSelect = (blockId: string) =>
      values[blockId]?.input?.selected_option?.value || '';
    const extractMulti = (blockId: string) =>
      values[blockId]?.input?.selected_options?.map(opt => opt.value) || [];

    const invoiceDueDate = values['invoice_due_date']?.input?.selected_date;
    if (!invoiceDueDate) {
      await ack({
        response_action: 'errors',
        errors: {
          invoice_due_date: 'Please select a due date for the invoice.'
        }
      });
      return;
    }

    const dueDateString = new Date(invoiceDueDate).toISOString().split('T')[0];

    const metadata = JSON.parse(view.private_metadata);
    const selectedServices = extractMulti('service_id');
    const { data: allServices } = await supabase
      .from('services')
      .select('service_id, service_type');

    const serviceBlocks = selectedServices.map(serviceId => {
      const service = allServices?.find(s => s.service_id.toString() === serviceId);
      const labelText = service ? `Cost for ${service.service_type}` : `Cost for service ID ${serviceId}`;

      return {
        type: 'input' as const,
        block_id: `cost_${serviceId}`,
        label: { type: 'plain_text' as const, text: labelText },
        element: {
          type: 'plain_text_input' as const,
          action_id: 'input',
          placeholder: { type: 'plain_text' as const, text: 'USD' }
        }
      };
    });

    await ack({
      response_action: 'update',
      view: {
        type: 'modal',
        callback_id: 'invoice_step_2',
        private_metadata: JSON.stringify({
          ...metadata,
          client_id: extractSelect('client_id'),
          service_id: selectedServices,
          invoice_due_date: dueDateString
        }),
        title: { type: 'plain_text', text: 'Invoice Setup - Step 2' },
        submit: { type: 'plain_text', text: 'Submit' },
        close: { type: 'plain_text', text: 'Cancel' },
        blocks: [
          ...serviceBlocks,
          {
            type: 'input',
            block_id: 'token_multiplier',
            label: { type: 'plain_text', text: 'Token Multiplier' },
            element: { type: 'plain_text_input', action_id: 'input' }
          },
          {
            type: 'input',
            block_id: 'amount_payable_tokens',
            label: { type: 'plain_text', text: 'Amount Payable in Tokens (USD)' },
            element: { type: 'plain_text_input', action_id: 'input' }
          }
        ]
      }
    });

  } catch (error) {
    console.error('Failed to transition modal step:', error);
    await ack();
  }
});

app.view('invoice_step_2', async ({ ack, view, client, body }) => {
  const values = view.state.values;
  const extract = (blockId: string) => values[blockId]?.input?.value?.trim() || '';
  const metadata = JSON.parse(view.private_metadata);

  const refNumber = metadata.refNumber;
  const clientId = parseInt(metadata.client_id);
  const invoiceDate = metadata.invoice_due_date;
  const serviceIds = metadata.service_id;
  const dueDay = new Date(invoiceDate).getDate();
  const tokenMultiplier = parseFloat(extract('token_multiplier'));
  const amountPayableTokens = parseFloat(extract('amount_payable_tokens'));

  let totalAmount = 0;
  const serviceRows = serviceIds.map((id: string) => {
    const cost = parseFloat(extract(`cost_${id}`));
    totalAmount += cost;
    return {
      invoice_id: null,
      service_id: parseInt(id),
      amount_per_service: cost
    };
  });

  const invoiceAmount = totalAmount / serviceIds.length;

  const payload = {
    client_id: clientId,
    invoice_due_date: invoiceDate,
    ref_invoice_number: refNumber,
    token_multiplier: tokenMultiplier,
    total_amount: totalAmount,
    amount_payable_tokens: amountPayableTokens,
    amount_payable_stablecoin: totalAmount - amountPayableTokens,
    invoice_amount: invoiceAmount
  };

  const { data: clientData } = await supabase
    .from('clients')
    .select('project_name, stakeholder_emails')
    .eq('client_id', clientId)
    .single();

  const clientName = clientData?.project_name || `Client ${clientId}`;

  try {
    const { data: invoice, error } = await supabase
      .from('invoices_contracts')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    const filledServiceRows = serviceRows.map((s: { service_id: number; amount_per_service: number }) => ({
      ...s,
      invoice_id: invoice.invoice_id
    }));

    await supabase.from('invoice_services').insert(filledServiceRows);

    await ack();

    const { data: serviceDetails } = await supabase
      .from('services')
      .select('service_id, service_type')
      .in('service_id', serviceIds.map((id: string) => parseInt(id)));

// Geração da lista formatada com tipos explícitos:
    const formattedServiceList = serviceRows.map((s: { service_id: number; amount_per_service: number }) => {
      const service = serviceDetails?.find((sd: { service_id: number }) => sd.service_id === s.service_id);
      const name = service?.service_type || `Service ${s.service_id}`;
      return `> ${name} - $${s.amount_per_service.toLocaleString()}`;
    }).join('\n');
    
    await client.chat.postMessage({
      channel: metadata.channelId,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'New Invoice Registered 💰',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Entity Name:*\n${clientName}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n<mailto:${clientData?.stakeholder_emails}|${clientData?.stakeholder_emails}>`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Invoice Details:*'
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${formattedServiceList}\n> Tokens - $${amountPayableTokens.toLocaleString()} (${tokenMultiplier}x)`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `✅ Invoice registered successfully, due on the *${dueDay}th* of each month.`
            }
          ]
        }
      ],
      text: `Invoice ${refNumber} registered for ${clientName}.`
    });
    

  } catch (err) {
    console.error('Error creating invoice:', err);
  }
});
