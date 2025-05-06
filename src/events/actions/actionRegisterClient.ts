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
        {
          type: 'input',
          block_id: 'project_name',
          label: { type: 'plain_text', text: 'Project Name' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'E.g., Acme Corp' }
          }
        },
        {
          type: 'input',
          block_id: 'entity_full_name',
          label: { type: 'plain_text', text: 'Entity Full Name' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'E.g., Acme Corporation S.A.' }
          }
        },
        {
          type: 'input',
          block_id: 'url_logo_entity',
          label: { type: 'plain_text', text: 'URL Logo Entity' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'https://example.com/logo.png' }
          }
        },
        {
          type: 'input',
          block_id: 'address_line_1',
          label: { type: 'plain_text', text: 'Address (line 1)' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'E.g., 123 Main Street' }
          }
        },
        {
          type: 'input',
          block_id: 'complement',
          label: { type: 'plain_text', text: 'Address (line 2)' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'Apt, Suite, Building (optional)' }
          }
        },
        {
          type: 'input',
          block_id: 'address_location',
          label: { type: 'plain_text', text: 'Address Location (City, State, ZIP)' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'E.g., New York, NY, 10001' }
          }
        },
        {
          type: 'input',
          block_id: 'country',
          label: { type: 'plain_text', text: 'Country' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'E.g., United States' }
          }
        },
        {
          type: 'input',
          block_id: 'email',
          label: { type: 'plain_text', text: 'Email' },
          element: {
            type: 'plain_text_input',
            action_id: 'input',
            placeholder: { type: 'plain_text', text: 'example@domain.com' }
          }
        }
      ]
    }
  });
});
