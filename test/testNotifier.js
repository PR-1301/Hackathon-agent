import classifyEmail from '../src/classifier.js';
import sendNotification from '../src/notifier.js';

const hackathonEmail = {
  uid: 'test-001',
  from: 'Devpost <support@devpost.com>',
  subject: '🚀 HackAI 2026 Registration Open',
  body: `
    Join our 48-hour AI hackathon.
    Prize pool: ₹5,00,000
    Deadline: May 30
    Register now on Devpost.
  `,
};

const result = await classifyEmail(hackathonEmail);
console.log('Classification result:');
console.log(JSON.stringify(result, null, 2));

// Only send notification if relevant
if (result.is_relevant) {
  await sendNotification(result, hackathonEmail);
}