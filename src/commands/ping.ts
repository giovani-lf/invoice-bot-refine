import { app } from '../lib/slackClient';

app.command('/ping', async ({ ack, respond }) => {
  await ack();
  await respond('🏓 Pong!');
});
