//Task scheduler

import cron from 'node-cron';
import runAgent from './src/agent.js';

// Runs two times per day
// Cron syntax: '*/5 * * * *' = every 5 minutes
cron.schedule('0 9,18 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running agent...`);
  await runAgent();
});

console.log('Hackathon Monitor started');