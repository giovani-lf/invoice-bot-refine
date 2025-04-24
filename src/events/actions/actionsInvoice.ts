import { app } from '../../lib/slackClient';
import { supabase } from '../../lib/supabaseClient';

app.action('open_register_invoice', async ({ ack, body, client }) => {
  await ack();

  const { data: clients } = await supabase.from('clients').select('client_id, project_name');
  const { data: services } = await supabase.from('services').select('service_id, service_type');

  const clientOptions = clients?.map((c) => ({
    text: { type: 'plain_text', text: c.project_name } as const,
    value: c.client_id.toString()
  })) || [];
  
  const serviceOptions = services?.map((s) => ({
    text: { type: 'plain_text', text: s.service_type } as const,
    value: s.service_id.toString()
  })) || [];

  const refNumber = `#REF${Math.floor(1000 + Math.random() * 9000)}W3`;
  const channelId = body.channel!.id;

  await client.views.open({
    trigger_id: (body as any).trigger_id,
    view: {
      type: 'modal',
      callback_id: 'invoice_step_1',
      private_metadata: JSON.stringify({ refNumber, channelId }),
      title: { type: 'plain_text', text: 'Invoice Setup - Step 1' },
      submit: { type: 'plain_text', text: 'Next' },
      close: { type: 'plain_text', text: 'Cancel' },
      blocks: [
        {
          type: 'input',
          block_id: 'client_id',
          label: { type: 'plain_text', text: 'Client' },
          element: {
            type: 'static_select',
            action_id: 'input',
            options: clientOptions
          }
        },
        {
          type: 'input',
          block_id: 'service_id',
          label: { type: 'plain_text', text: 'Services' },
          element: {
            type: 'multi_static_select',
            action_id: 'input',
            options: serviceOptions
          }
        },
        {
          type: 'input',
          block_id: 'invoice_sent_date',
          label: { type: 'plain_text', text: 'Invoice Date' },
          element: {
            type: 'datepicker',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'Select a date' }
          }
        }
      ]
    }
  });
});
