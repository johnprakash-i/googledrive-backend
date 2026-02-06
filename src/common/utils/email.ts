import nodemailer from 'nodemailer';
import { env } from '../../config/env.config';
export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: false, 
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD, 
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({ from: env.EMAIL_USER, to, subject, html });
  transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email server connection FAILED')
    console.error(error)
  } else {
    console.log('✅ Email server is READY to send messages')
  }
})
};
