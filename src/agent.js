import { fetchUnreadEmails } from "../src/emailFetcher.js";
import classifyEmail from "../src/classifier.js";
import sendNotification from "../src/notifier.js";
import { hasSeen, markSeen } from "../src/storage.js";

async function runAgent() {
  const fetchedEmails = await fetchUnreadEmails();

  for (const email of fetchedEmails) {
    if (await hasSeen(email.uid)) {
      console.log("Already processed email");
    } else {
      const data = await classifyEmail(email);
      console.log(`[${email.uid}] Subject: "${email.subject}" → is_relevant: ${data.is_relevant}`);
      if(data.is_relevant){
        await sendNotification(data, email);
      }
      await markSeen(email.uid);
    }
  }
}
