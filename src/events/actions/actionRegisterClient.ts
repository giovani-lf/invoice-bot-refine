import { app } from '../../lib/slackClient';

app.action('open_register_modal', async ({ ack, body, client }) => {
  await ack();
  const channelId = (body as any).channel.id;

  await client.views.open({
    trigger_id: (body as any).trigger_id,
    view: {
      type: 'modal',
      callback_id: 'submit_client_data',
      private_metadata: channelId,
      title: { type: 'plain_text', text: 'Register Client' },
      submit: { type: 'plain_text', text: 'Submit' },
      close: { type: 'plain_text', text: 'Cancel' },
      blocks: [
        ...[
          'Entity Name',
          'Entity Full Name',
          'Signor',
          'Signor Position',
          'URL Logo Entity',
          'Legal Address',
          'Complement',
          'City',
          'Country',
          'State',
          'Zip Code',
          'Email'
        ].map(field => ({
          type: 'input',
          block_id: field.toLowerCase().replace(/ /g, '_'),
          label: { type: 'plain_text', text: field },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            ...(field === 'Email' ? { placeholder: { type: 'plain_text', text: 'example@domain.com' } } : {})
          }
        }))
      ]
    }
  });
});
