import dotenv from 'dotenv';
import { generateChatReply } from '../utils/chatbot.js';

dotenv.config({ path: ".env.local" });
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

  const { origin: requestOrigin, host: requestHost } = parseOrigin(
    requestOriginHeader,
  );
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body || {};
    const cleanMessage = String(message || '').trim();

    if (!cleanMessage) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (cleanMessage.length > 1200) {
      return res
        .status(400)
        .json({ error: 'Message is too long. Please keep it under 1200 characters.' });
    }

    const chatResponse = await generateChatReply({
      message: cleanMessage,
      history: Array.isArray(history) ? history : [],
    });

    return res.status(200).json(chatResponse);
  } catch (error) {
    const errorCode = error?.code || error?.name || 'CHATBOT_FAILED';
    const errorMessage = error?.message || 'Unknown failure';

    console.error('Error handling /api/chat:', {
      code: errorCode,
      message: errorMessage,
    });

    return res.status(500).json({
      error: 'Failed to generate chatbot response. Please try again.',
      errorCode,
    });
  }
}
