import { app, receiver } from './lib/slackClient';

import './commands/ping';
import './commands/quickSetup';
import './commands/registerClient';
import './commands/registerInvoice';
import './commands/registerService';
import './events/actions/actionRegisterClient';
import './events/actions/actionsInvoice';
import './events/actions/actionRegisterService';
import './events/views/viewsInvoice';
import './events/views/viewsRegisterClient';
import './events/views/viewsRegisterService';


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Slack bot is running!');
})();