import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });
dotenv.config(); // load env before importing helpers
import { MongoClient, ServerApiVersion } from 'mongodb';
import { sendEmail } from '../utils/email.js';

// Cache Mongo client across invocations to avoid reconnecting.
let cachedClient;
let cachedCollection;
let cachedDbName;
let cachedCollectionName;

function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

async function getCollection() {
  const dbName = process.env.MONGODB_DB_NAME || 'portfolio';
  const collectionName = process.env.MONGODB_COLLECTION || 'incomming';

  if (
    cachedCollection &&
    cachedDbName === dbName &&
    cachedCollectionName === collectionName
  ) {
    return cachedCollection;
  }

  if (!process.env.MONGODB_URI) {
    const error = new Error('Missing MONGODB_URI in environment');
    error.code = 'MISSING_MONGODB_URI';
    throw error;
  }

  if (cachedClient) {
    try {
      await cachedClient.db('admin').command({ ping: 1 });
    } catch (err) {
      console.warn('Mongo ping failed; reconnecting:', err.message);
      cachedClient = undefined;
      cachedCollection = undefined;
    }
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
    });
    try {
      await cachedClient.connect();
    } catch (connectErr) {
      const err = new Error(
        `Mongo connection failed: ${connectErr.message || 'unknown error'}`,
      );
      err.code = connectErr.code || connectErr.name || 'MONGO_CONNECT_FAILED';
      cachedClient = undefined;
      cachedCollection = undefined;
      throw err;
    }
  }

  const db = cachedClient.db(dbName);
  cachedCollection = db.collection(collectionName);
  cachedDbName = dbName;
  cachedCollectionName = collectionName;
  await cachedCollection.createIndex({ createdAt: -1 });
  return cachedCollection;
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const collection = await getCollection();

    if (req.method === 'GET') {
      const limitParam = Number.parseInt(req.query.limit, 10);
      const limit = Number.isFinite(limitParam) ? Math.min(limitParam, 100) : 25;

      const messages = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return res.status(200).json({ messages });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ error: 'Name, email, and message are required.' });
    }

    const entry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(entry);
    const emailResult = await sendEmail(entry.name, entry.email, entry.message);
    if (!emailResult.success) {
      console.error('Resend email failed:', emailResult.error);
    }

    return res.status(201).json({
      message: 'Message stored successfully.',
      id: result.insertedId,
      createdAt: entry.createdAt,
      emailSent: emailResult.success,
      emailError: emailResult.success ? undefined : String(emailResult.error),
    });
  } catch (error) {
    const errorCode = error?.code || error?.name || 'UNKNOWN_ERROR';
    const errorMessage = error?.message || 'Unknown failure';

    console.error('Error handling /api/messages:', {
      code: errorCode,
      message: errorMessage,
    });

    return res.status(500).json({
      error: 'Failed to process request. Please try again.',
      errorCode,
    });
  }
}
