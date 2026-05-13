import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.join(__dirname, '../auth/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../auth/token.json');

// Reads credentials.json and token.json from disk, constructs and returns
// an authenticated OAuth2 client that all Gmail API calls will use
function getAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

// Fetches up to 10 unread emails from Gmail, extracts UID, sender,
// subject, and first 1000 chars of body, returns them as an array of objects
async function fetchUnreadEmails() {
  const auth = getAuthClient();
  const gmail = google.gmail({ version: 'v1', auth });

  // Queries Gmail for unread message IDs only — no content yet
  const listRes = await gmail.users.messages.list({
    userId: 'me',
    q: 'process.env.GMAIL_SEARCH_QUERY',
    maxResults: 10,
  });

  const messages = listRes.data.messages;
  if (!messages || messages.length === 0) {
    console.log('No unread emails found.');
    return [];
  }

  const emails = [];

  for (const msg of messages) {
    // Fetches full email content for each message ID returned above
    const msgRes = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full',
    });

    const payload = msgRes.data.payload;
    const headers = payload.headers;

    // Gmail stores metadata as an array of {name, value} header pairs
    // so we find the specific ones we need by name
    const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
    const from = headers.find(h => h.name === 'From')?.value || '(unknown)';

    let body = '';

    // Multipart emails (most modern emails) store body in payload.parts[]
    // Simple emails store it directly in payload.body
    // Gmail encodes body content in base64 — we decode it to readable UTF-8
    if (payload.parts) {
      const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
      if (textPart && textPart.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    } else if (payload.body?.data) {
      body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    // This extracts html content from the emails
    if (!body && payload.parts) {
    const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
    if (htmlPart && htmlPart.body.data) {
        const html = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
        // Strip HTML tags, collapse whitespace
        body = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    }

    emails.push({
      uid: msg.id,
      subject,
      from,
      // Truncate to 1000 chars — LLM doesn't need the full email,
      // and sending less tokens = faster + cheaper classification
      body: body.slice(0, 1000),
    });
  }

  return emails;
}

export { getAuthClient, fetchUnreadEmails };

// Test run — prints a summary of each fetched email to the terminal
// fetchUnreadEmails().then(emails => {
//   console.log(`Fetched ${emails.length} emails:\n`);
//   emails.forEach(e => {
//     console.log(`UID: ${e.uid}`);
//     console.log(`From: ${e.from}`);
//     console.log(`Subject: ${e.subject}`);
//     console.log(`Body preview: ${e.body.slice(0, 100)}...`);
//     console.log('---');
//   });
// });