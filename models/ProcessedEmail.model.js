import mongoose from 'mongoose';



// Defines the schema for storing processed email UIDs
// We only need the UID and when it was processed
const processedEmailSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  processed_at: { type: Date, default: Date.now },
});

const ProcessedEmail = mongoose.model('ProcessedEmail', processedEmailSchema);

export default ProcessedEmail;