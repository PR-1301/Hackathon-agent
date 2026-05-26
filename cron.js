//Task scheduler

import cron from 'node-cron';
import runAgent from './src/agent.js';

// Runs two times per day
//API calls - 9am and 6pm IST 
cron.schedule('30 3,12 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running agent...`);
  await runAgent();
});

console.log('Hackathon Monitor started');
