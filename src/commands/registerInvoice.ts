import { app } from '../lib/slackClient';

app.command('/register-invoice', async ({ ack, body, client }) => {
  await ack();

  await client.chat.postMessage({
    channel: body.channel_id,
    text: 'Let’s register a new invoice?',
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Let’s register a new invoice?' }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Register Invoice' },
            action_id: 'open_register_invoice'
          }
        ]
      }
    ]
  });
});
