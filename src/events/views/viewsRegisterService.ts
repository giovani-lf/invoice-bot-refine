import { app } from '../../lib/slackClient';
import { supabase } from '../../lib/supabaseClient';

app.view('submit_service_data', async ({ ack, body, view, client }) => {
  const values = view.state.values;

  const fieldMap: Record<string, string> = {
    service_type: 'service_type',
    service_description: 'service_description',
  };

  const extract = (blockId: string) =>
    values[blockId]?.input?.value?.trim() || '';

  const payload: Record<string, string> = {};
  for (const [modalField, supabaseColumn] of Object.entries(fieldMap)) {
    payload[supabaseColumn] = extract(modalField);
  }

  

  await supabase.from('services').insert([payload]);
  await ack();

  const clientInfoBlocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🎉 New Service Registered',
        emoji: true
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Service Type:*\n${payload.service_type}`
        },
        {
          type: 'mrkdwn',
          text: `*Service Description:*\n${payload.service_description}`
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
