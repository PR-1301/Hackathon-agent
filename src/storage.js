import mongoose from 'mongoose';
import 'dotenv/config';
import ProcessedEmail from '../models/ProcessedEmail.model.js';

// Connects to MongoDB Atlas using connection string from .env
async function connectDB() {
  if (mongoose.connection.readyState === 1) return; // already connected, skip
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
}

// Returns true if this email UID has been processed before, false if not
async function hasSeen(uid) {
  await connectDB();
  const existing = await ProcessedEmail.findOne({ uid });
  return !!existing;
}

// Saves the email UID to the database so future runs skip it
async function markSeen(uid) {
  await connectDB();
  await ProcessedEmail.create({ uid });
}

export { connectDB, hasSeen, markSeen };