import { app, receiver } from './lib/slackClient';

import './commands/ping';
import './commands/registerClient';
import './commands/registerInvoice';
import './events/actions/actionRegisterClient';
import './events/views/viewsRegisterClient';
import './events/actions/actionsInvoice';
import './events/views/viewsInvoice';


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Slack bot is running!');
})();