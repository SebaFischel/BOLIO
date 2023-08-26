import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SessionModel = mongoose.model('Session', sessionSchema);

export default SessionModel;