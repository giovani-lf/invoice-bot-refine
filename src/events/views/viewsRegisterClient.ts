import { app } from '../../lib/slackClient';
import { supabase } from '../../lib/supabaseClient';

app.view('submit_client_data', async ({ ack, body, view, client }) => {
  const values = view.state.values;

  const fieldMap: Record<string, string> = {
    project_name: 'project_name',
    entity_full_name: 'entity_full_name',
    url_logo_entity: 'logo_url',
    address_line_1: 'address_line_1',
    complement: 'address_line_2',
    address_location: 'address_location',
    country: 'country',
    email: 'stakeholder_emails'
  };

  const extract = (blockId: string) =>
    values[blockId]?.input?.value?.trim() || '';

  const payload: Record<string, string> = {};
  for (const [modalField, supabaseColumn] of Object.entries(fieldMap)) {
    payload[supabaseColumn] = extract(modalField);
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(payload['stakeholder_emails'])) {
    await ack({
      response_action: 'errors',
      errors: {
        email: 'Invalid email format'
      }
    });
    return;
  }

  await supabase.from('clients').insert([payload]);
  await ack();

  const clientInfoBlocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'New Client Registered :file_cabinet:',
        emoji: true
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Project Name:*\n${payload.project_name}`
        },
        {
          type: 'mrkdwn',
          text: `*Entity Name:*\n${payload.entity_full_name}`
        },
        {
          type: 'mrkdwn',
          text: `*Email:*\n${payload.stakeholder_emails}`
        }
      ]
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'The client has been successfully added. You can now register an invoice for the services provided.\n\nWould you like to continue and create an invoice now?'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '➕ Create Subscription Invoice'
          },
          style: 'primary',
          action_id: 'open_register_invoice'
        }
      ]
    }
  ];

  const channelId = body.view.private_metadata;
  if (!channelId) {
    console.error('Channel ID not found in private_metadata');
    return;
  }

  await client.chat.postMessage({
    channel: channelId,
    blocks: clientInfoBlocks,
    text: 'New client successfully registered!'
  });
});
