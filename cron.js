//Task scheduler

import cron from 'node-cron';
import runAgent from './src/agent.js';

// Runs two times per day
//API calls - 9am and 6pm
cron.schedule('0 9,18 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running agent...`);
  await runAgent();
});

console.log('Hackathon Monitor started');
