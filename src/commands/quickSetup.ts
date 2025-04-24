import { app } from '../lib/slackClient';


app.command('/quick-setup', async ({ ack, body, client }) => {
  await ack();

  await client.chat.postMessage({
    channel: body.channel_id,
    text: 'To get started, use the buttons below:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*To get started, use the buttons below:*\n• Create Service – Add a new offering.\n• Create Subscription Invoice – Enable monthly automatic billing.\n• Register Client – Add a client to your records.'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Create Service' },
            action_id: 'open_register_service'
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Create Subscription Invoice' },
            action_id: 'open_register_invoice'
          },
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
