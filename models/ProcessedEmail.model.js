import mongoose from 'mongoose';

const processedEmailSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  processed_at: { type: Date, default: Date.now },
});

const ProcessedEmail = mongoose.model('ProcessedEmail', processedEmailSchema);

export default ProcessedEmail;