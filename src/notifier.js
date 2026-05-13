import axios from "axios";
import "dotenv/config";


const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Formats the classified email data into a readable Telegram message   
// and sends it to your chat via Telegram Bot API
async function sendNotification(classification, email) {
            const from = email.from.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const message = `
            🏆 <b>Hackathon Alert!</b>

            📌 <b>${classification.name || email.subject}</b>
            📋 Type: ${classification.type}
            📅 Deadline: ${classification.deadline || 'Not mentioned'}
            💰 Prize: ${classification.prize || 'Not mentioned'}
            🔗 Link: ${classification.link || 'Not mentioned'}
            📝 ${classification.summary}

            📧 From: ${from}
            `.trim();

  try {
    await axios.post(`${BASE_URL}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',  // parses html
    });

    console.log(`Notification sent for: ${classification.name || email.subject}`);
  } catch (err) {
    console.error('Full error:', JSON.stringify(err.response?.data, null, 2));
    console.error('Message:', err.message);
    console.error('Status:', err.response?.status);
  }
}

export default sendNotification;
