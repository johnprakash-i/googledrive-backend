import mongoose from 'mongoose';
import { env } from './env.config';

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI);
  console.log('✅ MongoDB Connected');
};
