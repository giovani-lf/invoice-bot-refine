import { App, ExpressReceiver } from '@slack/bolt';
import dotenv from 'dotenv';
dotenv.config();

// Cria o receiver do Express
export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
});

// Add health endpoint
receiver.router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Cria o app Bolt com o receiver customizado
export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});
