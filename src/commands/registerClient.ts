import { app } from '../lib/slackClient';

app.command('/register-client', async ({ ack, body, client }) => {
  await ack();

  await client.chat.postMessage({
    channel: body.channel_id,
    text: 'Ready to register a new client?',
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Ready to register a new client?' }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Register Client' },
            action_id: 'open_register_modal'
          }
        ]
      }
    ]
  });
});
