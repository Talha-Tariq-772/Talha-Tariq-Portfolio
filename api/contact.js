import dotenv from 'dotenv';
import { sendEmail } from '../utils/email.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => origin.replace(/\/+$/, ''));
}

function normalizeHost(host = '') {
  return host.replace(/^www\./, '');
}

function resolveCorsOrigin(req) {
  const allowedOrigins = getAllowedOrigins();
  const requestOriginHeader = req.headers.origin?.trim();

  const parseOrigin = (value) => {
    try {
      const url = new URL(value);
      return { origin: url.origin, host: normalizeHost(url.hostname) };
    } catch {
      return { origin: value?.replace(/\/+$/, ''), host: '' };
    }
  };

  const { origin: requestOrigin, host: requestHost } = parseOrigin(requestOriginHeader);
  const apiHost = normalizeHost(req.headers.host || '');

  if (
    requestOrigin &&
    (allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin))
  ) {
    return requestOrigin;
  }

  if (requestOrigin && requestHost && apiHost && requestHost === apiHost) {
    return requestOrigin;
  }

  return allowedOrigins[0] || '*';
}

function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', resolveCorsOrigin(req));
  res.setHeader('Vary', 'Origin');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With',
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ success: false, error: 'Name, email, and message are required.' });
    }

    const emailResult = await sendEmail(name.trim(), email.trim(), message.trim());

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        error: emailResult.error
          ? String(emailResult.error)
          : 'Failed to send email. Please try again.',
      });
    }

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Error handling /api/contact:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to send email. Please try again.' });
  }
}
