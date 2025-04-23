import { app } from '../../lib/slackClient';
import { supabase } from '../../lib/supabaseClient';

app.view('submit_client_data', async ({ ack, body, view, client }) => {
  const values = view.state.values;

  const fieldMap: Record<string, string> = {
    entity_name: 'entity_name',
    entity_full_name: 'entity_full_name',
    signor: 'signor_full_name',
    signor_position: 'signor_full_position',
    url_logo_entity: 'logo_url',
    legal_address: 'legal_address',
    complement: 'complement_address',
    city: 'city',
    country: 'country',
    state: 'state',
    zip_code: 'zip_code',
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
        text: '🎉 New Client Registered',
        emoji: true
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Entity Name:*\n${payload.entity_name}`
        },
        {
          type: 'mrkdwn',
          text: `*Full Name:*\n${payload.entity_full_name}`
        },
        {
          type: 'mrkdwn',
          text: `*Signor:*\n${payload.signor_full_name}`
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
        text: 'Now that the client has been created, you can register an invoice for the services provided to them.\n\nWould you like to continue and create an invoice now?'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '➕ Register Invoice'
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
