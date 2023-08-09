import mongoose from 'mongoose';

// Define el esquema de la sesión
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

// Crea el modelo de sesión a partir del esquema
const SessionModel = mongoose.model('Session', sessionSchema);

export default SessionModel;