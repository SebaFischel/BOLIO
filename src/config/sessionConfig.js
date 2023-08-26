import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';

dotenv.config();

const sessionConfig = () => {
  return session({
    secret: 'Coder39760',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 3600,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  });
};

export default sessionConfig;