import classifyEmail from '../src/classifier.js';

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

const normalEmail = {
  uid: 'test-002',
  from: 'Amazon <shipment-tracking@amazon.in>',
  subject: 'Your Amazon Order Has Shipped',
  body: `
    Your package will arrive tomorrow.
    Track your shipment here.
  `,
};

// Test both emails and log results
const results = await Promise.all([
  classifyEmail(hackathonEmail),
  classifyEmail(normalEmail),
]);

console.log('Hackathon email result:');
console.log(JSON.stringify(results[0], null, 2));

console.log('\nNormal email result:');
console.log(JSON.stringify(results[1], null, 2));