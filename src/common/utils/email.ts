import { Resend } from 'resend';
import { env } from '../../config/env.config';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev', // default testing sender
    to,
    subject,
    html,
  });
};