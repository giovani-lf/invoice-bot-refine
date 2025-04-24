import { app } from '../../lib/slackClient';

app.action('open_register_service', async ({ ack, body, client }) => {
  await ack();
  const channelId = (body as any).channel.id;

  await client.views.open({
    trigger_id: (body as any).trigger_id,
    view: {
      type: 'modal',
      callback_id: 'submit_service_data',
      private_metadata: channelId,
      title: { type: 'plain_text', text: 'Register Service' },
      submit: { type: 'plain_text', text: 'Submit' },
      close: { type: 'plain_text', text: 'Cancel' },
      blocks: [
        {
          type: 'input',
          block_id: 'service_type',
          label: { type: 'plain_text', text: 'Service Name' },
          element: { type: 'plain_text_input', action_id: 'input' }
        },
        {
          type: 'input',
          block_id: 'service_description',
          label: { type: 'plain_text', text: 'Service Description' },
          element: { type: 'plain_text_input', action_id: 'input' }
        }
      ]
    }
  });
});
