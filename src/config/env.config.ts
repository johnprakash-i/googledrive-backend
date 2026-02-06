import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: process.env.MONGO_URI as string,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_ACTIVATION_SECRET: process.env.JWT_ACTIVATION_SECRET as string,

  AWS_REGION: process.env.AWS_REGION as string,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_BUCKET: process.env.AWS_BUCKET_NAME as string,

  // ✅ EMAIL SETTINGS
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true', // true for 465
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  EMAIL_FROM:
    process.env.EMAIL_FROM || `Google Drive Clone <${process.env.EMAIL_USER}>`,

  CLIENT_URL: process.env.CLIENT_URL as string,
  RESEND_API_KEY:process.env.RESEND_API_KEY as string,
};