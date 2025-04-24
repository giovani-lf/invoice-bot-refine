import { app } from '../lib/slackClient';

app.command('/register-service', async ({ ack, body, client }) => {
  await ack();

  await client.chat.postMessage({
    channel: body.channel_id,
    text: 'Let’s register a new service?',
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Let’s register a new service?' }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Create Service' },
            action_id: 'open_register_service'
          }
        ]
      }
    ]
  });
});
