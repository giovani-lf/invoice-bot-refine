import { app } from '../../lib/slackClient';
import { supabase } from '../../lib/supabaseClient';

app.view('invoice_step_1', async ({ ack, view }) => {
  try {
    const values = view.state.values;

    const extractSelect = (blockId: string) =>
      values[blockId]?.input?.selected_option?.value || '';
    const extractMulti = (blockId: string) =>
      values[blockId]?.input?.selected_options?.map(opt => opt.value) || [];

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

    // Define updated view
    const updatedView = {
      type: 'modal' as const,
      callback_id: 'invoice_step_2',
      private_metadata: JSON.stringify({
        ...metadata,
        client_id: extractSelect('client_id'),
        service_id: selectedServices,
        invoice_sent_date: values['invoice_sent_date']?.input?.selected_date,
        type: extractSelect('type')
      }),
      title: { type: 'plain_text' as const, text: 'Invoice Setup - Step 2' },
      submit: { type: 'plain_text' as const, text: 'Submit' },
      close: { type: 'plain_text' as const, text: 'Cancel' },
      blocks: [
        ...serviceBlocks,
        {
          type: 'input' as const,
          block_id: 'token_multiplier',
          label: { type: 'plain_text' as const, text: 'Token Multiplier' },
          element: { type: 'plain_text_input' as const, action_id: 'input' }
        },
        {
          type: 'input' as const,
          block_id: 'amount_payable_tokens',
          label: { type: 'plain_text' as const, text: 'Amount Payable in Tokens (USD)' },
          element: { type: 'plain_text_input' as const, action_id: 'input' }
        }
      ]
    };

    await ack({
      response_action: 'update',
      view: updatedView
    });

  } catch (error) {
    console.error('Failed to transition modal step:', error);
    await ack(); // fallback ack to prevent UI timeout
  }
});

app.view('invoice_step_2', async ({ ack, view, client, body }) => {
  const values = view.state.values;
  const extract = (blockId: string) => values[blockId]?.input?.value?.trim() || '';
  const metadata = JSON.parse(view.private_metadata);

  const refNumber = metadata.refNumber;
  const clientId = parseInt(metadata.client_id);
  const invoiceDate = metadata.invoice_sent_date;
  const type = metadata.type;
  const serviceIds = metadata.service_id;

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
    invoice_sent_date: invoiceDate,
    type,
    ref_invoice_number: refNumber,
    token_multiplier: tokenMultiplier,
    total_amount: totalAmount,
    amount_payable_tokens: amountPayableTokens,
    amount_payable_stablecoin: totalAmount - amountPayableTokens,
    invoice_amount: invoiceAmount
  };

  const { data: clientData } = await supabase
  .from('clients')
  .select('entity_name')
  .eq('client_id', clientId)
  .single();

  const clientName = clientData?.entity_name || `Client ${clientId}`;

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

    await client.chat.postMessage({
      channel: metadata.channelId,
      text: `✅ Invoice ${refNumber} registered successfully for client *${clientName}* with ${serviceIds.length} service(s).`
    });

    await client.chat.postMessage({
      channel: body.user.id,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🔐 Invoice ${refNumber} - Financial Summary`,
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `📅 *Invoice Date:*\n${invoiceDate}`
            },
            {
              type: 'mrkdwn',
              text: `🧾 *Invoice Type:*\n${type.charAt(0).toUpperCase() + type.slice(1)}`
            },
            {
              type: 'mrkdwn',
              text: `💸 *Total Amount:*\n$${totalAmount.toFixed(2)}`
            },
            {
              type: 'mrkdwn',
              text: `🪙 *Token Payment:*\n$${amountPayableTokens.toFixed(2)}`
            },
            {
              type: 'mrkdwn',
              text: `🏦 *Stablecoin Portion:*\n$${(totalAmount - amountPayableTokens).toFixed(2)}`
            },
            {
              type: 'mrkdwn',
              text: `📈 *Token Multiplier:*\nx${tokenMultiplier}`
            },
            {
              type: 'mrkdwn',
              text: `⚖️ *Avg. per Item:*\n$${invoiceAmount.toFixed(2)}`
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '🔐 These values are confidential and visible only to you.'
            }
          ]
        }
      ],
      text: `🔐 Invoice ${refNumber} details.`
    });
    
  } catch (err) {
    console.error('Error creating invoice:', err);
  }
});
