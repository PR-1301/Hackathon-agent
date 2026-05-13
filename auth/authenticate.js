import fs from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Access Scopes
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly"
//Credentials
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
//tokens
const TOKEN_PATH = path.join(__dirname, "token.json");

async function authenticate() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  // If token already exists, use it
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    console.log("Already authenticated.");
    return oAuth2Client;
  }

  // First time — generate auth URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("\n🔗 Open this URL in your browser:\n");
  console.log(authUrl);
  console.log("\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question("Paste the authorization code here: ", async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log("Token saved to auth/token.json");
        resolve(oAuth2Client);
      } catch (err) {
        reject("Error retrieving token: " + err);
      }
    });
  });
}

export default authenticate;

authenticate()
