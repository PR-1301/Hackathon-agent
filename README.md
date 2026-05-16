# Hackathon Monitor Agent 🤖

An autonomous AI agent that monitors your Gmail for hackathon and competition emails and sends instant Telegram notifications. Runs 24/7 without any manual interaction.

## How it works

```
Gmail API → Groq LLM Classifier → Telegram Bot
     ↑                                  ↓
     └────────── Cron Job ──────────────┘
                    ↕
               MongoDB Atlas
             (deduplication)
```

Every N hours the agent:
1. Fetches unread emails from your Gmail
2. Checks if each email has already been processed (MongoDB)
3. Classifies each new email using Groq's LLaMA 3.3 70B model
4. Sends a formatted Telegram notification if a hackathon or competition is detected
5. Marks the email as processed to prevent duplicate notifications

---

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js (ES Modules) |
| Email Access | Gmail API (OAuth 2.0) |
| AI Classifier | Groq API — LLaMA 3.3 70B |
| Notifications | Telegram Bot API |
| Database | MongoDB Atlas |
| Scheduler | node-cron |

---

## Project Structure

```
hackathon-agent/
├── auth/
│   ├── authenticate.js       # One-time Gmail OAuth flow
│   ├── credentials.json      # Google OAuth credentials (never commit)
│   └── token.json            # Gmail access token (never commit)
├── models/
│   └── ProcessedEmail.js     # Mongoose schema for deduplication
├── src/
│   ├── emailFetcher.js       # Fetches unread emails from Gmail
│   ├── classifier.js         # Classifies emails using Groq LLM
│   ├── notifier.js           # Sends Telegram notifications
│   ├── storage.js            # MongoDB connection and query logic
│   └── agent.js              # Main pipeline orchestrator
├── test/
│   ├── testClassifier.js     # Tests classifier with fake emails
│   ├── testNotifier.js       # Tests Telegram notification
│   └── testStorage.js        # Tests MongoDB deduplication
├── cron.js                   # Schedules agent runs
├── .env                      # Environment variables (never commit)
├── .gitignore
└── package.json
```

---

## Prerequisites

- Node.js v18+
- A Google account with Gmail
- A Telegram account
- MongoDB Atlas account (free tier)
- Groq Cloud account (free tier)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/hackathon-agent.git
cd hackathon-agent
npm install
```

### 2. Google Cloud Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → enable **Gmail API**
3. Go to **APIs & Services → OAuth consent screen**
   - Choose External → fill in app name and email
   - Add your Gmail as a test user
4. Go to **Credentials → Create Credentials → OAuth Client ID**
   - Application type: Desktop App
   - Download the JSON → rename to `credentials.json` → place in `auth/`

### 3. Gmail Authentication

```bash
node auth/authenticate.js
```

- Open the printed URL in your browser
- Sign in and approve access
- Copy the authorization code from the redirect URL
- Paste it in the terminal
- `auth/token.json` will be generated automatically

### 4. Telegram Bot Setup

1. Open Telegram → search `@BotFather`
2. Send `/newbot` → follow the prompts
3. Copy the `BOT_TOKEN`
4. Search `@userinfobot` → send any message → copy your `CHAT_ID`
5. Open your bot on Telegram and send it any message first (required before it can message you)

### 5. MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow all — for development)
5. Connect → Drivers → copy the connection string
6. Replace `<password>` with your database user password

### 6. Groq API Setup

1. Go to [console.groq.com](https://console.groq.com)
2. Create an account → API Keys → Create API Key
3. Copy the key

### 7. Environment Variables

Create a `.env` file in the root directory:

```env
# Gmail
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=urn:ietf:wg:oauth:2.0:oob
GMAIL_REFRESH_TOKEN=your_refresh_token_from_token.json

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Groq
GROQ_API_KEY=your_groq_api_key

```

---

## Running the Agent

### Run once manually

```bash
node src/agent.js
```

### Run on a schedule (recommended)

```bash
node cron.js
```

Default schedule: every day at 9am and 6pm.

To change the schedule, edit `cron.js`:

```js
// Every 2 hours
cron.schedule('0 */2 * * *', ...);

// Every day at 9am and 6pm
cron.schedule('0 9,18 * * *', ...);

// Every 3 hours
cron.schedule('0 */3 * * *', ...);
```

---

## Testing Individual Modules

```bash
# Test classifier only
node test/testClassifier.js

# Test Telegram notification
node test/testNotifier.js

# Test MongoDB deduplication
node test/testStorage.js
```

--- 
