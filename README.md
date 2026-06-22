# Hackathon Notification Bot 🤖

An automated Node.js pipeline that monitors Gmail for hackathon and competition emails, classifies them using an LLM via Groq, and sends real-time Telegram notifications.

Although it uses a Large Language Model for classification, this project is **not an autonomous AI agent**. It follows a deterministic ETL (Extract → Transform → Load) workflow where the LLM serves as an intelligent filter instead of relying on brittle keyword matching or regex patterns.

---

## Architecture

```text
Gmail API → Groq LLM Classifier → Telegram Bot
↑                                 ↓
└────────── node-cron ────────────┘
↕
MongoDB Atlas
(Deduplication Layer)
```

### Workflow

1. **Extract** – Retrieve unread emails from Gmail.
2. **Deduplicate** – Check MongoDB to ensure the email has not already been processed.
3. **Classify** – Send the email content to Groq's LLaMA model to determine whether it is a hackathon or competition invitation.
4. **Notify** – Forward relevant opportunities to Telegram.
5. **Persist** – Store the email ID in MongoDB to prevent duplicate alerts.

---

## Features

* Gmail inbox monitoring
* LLM-powered email classification
* Telegram push notifications
* MongoDB-based deduplication
* Automated scheduling with cron jobs
* Modular architecture for easy maintenance and testing

---

## Tech Stack

| Layer          | Technology           | Purpose                         |
| -------------- | -------------------- | ------------------------------- |
| Runtime        | Node.js (ES Modules) | Core application runtime        |
| Email Source   | Gmail API            | Fetch unread emails             |
| Classification | Groq API (LLaMA 3.x) | Detect hackathon-related emails |
| Notifications  | Telegram Bot API     | Send alerts                     |
| Database       | MongoDB Atlas        | Store processed email IDs       |
| Scheduler      | node-cron            | Run periodic jobs               |

---

## Project Structure

```text
hackathon-agent/
├── auth/
│   ├── authenticate.js
│   ├── credentials.json
│   └── token.json
│
├── models/
│   └── ProcessedEmail.js
│
├── src/
│   ├── emailFetcher.js
│   ├── classifier.js
│   ├── notifier.js
│   ├── storage.js
│   └── agent.js
│
├── test/
│   ├── testClassifier.js
│   ├── testNotifier.js
│   └── testStorage.js
│
├── cron.js
├── .env
└── package.json
```

---

## Prerequisites

Before running the project, ensure you have:

* Node.js v18 or later
* MongoDB Atlas account
* Groq API key
* Google Cloud project with Gmail API enabled
* Telegram bot token

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/hackathon-agent.git
cd hackathon-agent
npm install
```

---

## Gmail API Setup

### 1. Create a Google Cloud Project

* Open Google Cloud Console.
* Create a new project.
* Enable the Gmail API.

### 2. Configure OAuth

* Navigate to **OAuth Consent Screen**.
* Select **External** application type.
* Add your email as a test user.

### 3. Create OAuth Credentials

* Go to **Credentials**.
* Create an **OAuth Client ID**.
* Choose **Desktop Application**.
* Download the generated JSON file.
* Rename it to:

```text
credentials.json
```

* Place it inside the `auth/` directory.

### 4. Generate Tokens

Run:

```bash
node auth/authenticate.js
```

This generates the OAuth access and refresh tokens required for Gmail access.

---

## Telegram Bot Setup

### Create a Bot

1. Open Telegram.
2. Message `@BotFather`.
3. Run:

```text
/newbot
```

4. Copy the generated bot token.

### Get Your Chat ID

Message:

```text
@userinfobot
```

Copy your numeric Chat ID.

### Activate the Bot

Send:

```text
/ start
```

to your newly created bot before running the project.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Gmail
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REDIRECT_URI=
GMAIL_REFRESH_TOKEN=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# MongoDB
MONGODB_URI=

# Groq
GROQ_API_KEY=
```

---

## Running the Project

### Single Execution

Process current unread emails once:

```bash
node src/agent.js
```

---

### Scheduled Mode

Run continuously using cron:

```bash
node cron.js
```

Default schedule:

```text
9:00 AM daily
6:00 PM daily
```

Example schedule for every 2 hours:

```javascript
"0 */2 * * *"
```

---

## Testing Individual Modules

### Test Classifier

```bash
node test/testClassifier.js
```

### Test Telegram Notifications

```bash
node test/testNotifier.js
```

### Test MongoDB Connectivity

```bash
node test/testStorage.js
```

---

## Why Use an LLM Instead of Regex?

Traditional keyword-based filters often fail when:

* Wording changes
* Opportunities use unconventional language
* Relevant emails don't contain expected keywords

Using an LLM allows semantic understanding of email content, resulting in significantly better classification accuracy with minimal maintenance.

---

## Future Improvements

* Email summarization
* Opportunity scoring and ranking
* Discord notifications
* Web dashboard
* Multi-user support
* Vector search for historical opportunities

---

## License

MIT License

Feel free to fork, modify, and extend the project for your own automation workflows.
