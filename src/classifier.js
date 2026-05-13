import Groq from "groq-sdk";
import "dotenv/config";

//dotenv.config();

// Initializes Groq client using API key from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Takes a single email object, sends subject + sender + body to Groq,
// returns structured JSON telling us if it's a hackathon/competition
async function classifyEmail(email) {
  const prompt = `
                    You are an assistant that detects hackathon and competition emails.

                    Analyze this email and respond ONLY in raw JSON — no markdown, no backticks, no explanation.

                    Email details:
                    From: ${email.from}
                    Subject: ${email.subject}
                    Body: ${email.body || "No body available"}

                    Respond with exactly this structure:
                    {
                    "is_relevant": true or false,
                    "type": "hackathon" or "competition" or "contest" or "other",
                    "name": "event name or null",
                    "deadline": "deadline date as string or null",
                    "prize": "prize details or null",
                    "link": "registration link or null",
                    "summary": "one line summary of the email"
                    }
                    `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // zero temperature = deterministic, consistent JSON output
      max_tokens: 256, // classification response is small, no need for more
    });

    const text = response.choices[0].message.content.trim();

    // Strip markdown code fences if model wraps output despite instructions
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return parsed;
  } catch (err) {
    console.error(`Classification failed for "${email.subject}":`, err.message);

    // Safe default — one bad email should never crash the full pipeline
    return {
      is_relevant: false,
      type: "other",
      name: null,
      deadline: null,
      prize: null,
      link: null,
      summary: "Classification failed",
    };
  }
}

export default classifyEmail;
