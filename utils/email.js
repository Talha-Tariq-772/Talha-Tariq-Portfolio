import dotenv from 'dotenv';
import { Resend } from "resend";

// Ensure environment variables are loaded for local/dev usage.
dotenv.config({ path: ".env.local" });
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const defaultFrom =
  process.env.FROM_EMAIL ||
  process.env.RESEND_FROM ||
  'Portfolio Contact <onboarding@resend.dev>';
const defaultTo =
  process.env.RECEIVER_EMAIL || process.env.RESEND_TO || 'tariqtalha772@gmail.com';

export async function sendEmail(name, email, message) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY; email not sent.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: defaultTo,
      replyTo: `${name} <${email}>`,
      subject: 'New Portfolio Message',
      html: `
        <h2>New Message Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
      text: `New Message Received
Name: ${name}
Email: ${email}
Message:
${message}`,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

