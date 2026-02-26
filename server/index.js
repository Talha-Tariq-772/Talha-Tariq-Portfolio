import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { sendEmail } from '../utils/email.js';
import { generateChatReply } from '../utils/chatbot.js';

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const maskKey = (value = '') => {
  if (!value) return 'missing';
  const trimmed = value.trim();
  if (trimmed.length <= 10) return `${trimmed.slice(0, 2)}...${trimmed.slice(-2)}`;
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
};

const geminiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || '';

console.log(`RESEND_API_KEY loaded: ${maskKey(process.env.RESEND_API_KEY)}`);
console.log(`GEMINI_API_KEY loaded: ${maskKey(geminiKey)}`);
console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL || 'not set'}`);
console.log(`RECEIVER_EMAIL: ${process.env.RECEIVER_EMAIL || 'not set'}`);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const mongoUri = (process.env.MONGODB_URI || '').trim();
const hasMongoUri =
  mongoUri.length > 0 && !mongoUri.includes('your_mongodb_connection_string');
const mongoClient = hasMongoUri
  ? new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  : null;

let messagesCollection = null;
let messagesApiEnabled = false;

async function connectDatabase() {
  if (!mongoClient) {
    console.warn('MongoDB disabled: MONGODB_URI not configured');
    return;
  }

  await mongoClient.connect();
  const databaseName = process.env.MONGODB_DB_NAME || 'portfolio';
  const collectionName = process.env.MONGODB_COLLECTION || 'incomming';

  const database = mongoClient.db(databaseName);
  messagesCollection = database.collection(collectionName);

  await messagesCollection.createIndex({ createdAt: -1 });
  messagesApiEnabled = true;
  console.log(
    `Connected to MongoDB "${databaseName}" using collection "${collectionName}".`,
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '250kb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, mongo: messagesApiEnabled ? 'connected' : 'disabled' });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongo: messagesApiEnabled ? 'connected' : 'disabled' });
});

app.post('/api/chat', async (req, res) => {
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
    console.error('Error generating chat response', error);
    return res.status(500).json({ error: 'Failed to generate chatbot response.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ success: false, error: 'Name, email, and message are required.' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    const emailResult = await sendEmail(trimmedName, trimmedEmail, trimmedMessage);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        error: emailResult.error
          ? String(emailResult.error)
          : 'Failed to send email. Please try again.',
      });
    }

    if (messagesApiEnabled && messagesCollection) {
      try {
        await messagesCollection.insertOne({
          name: trimmedName,
          email: trimmedEmail.toLowerCase(),
          message: trimmedMessage,
          createdAt: new Date(),
        });
      } catch (storeError) {
        console.error('Failed to store contact message', storeError);
      }
    }

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Error sending contact email', error);
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error?.message || 'Email failed',
      details: error?.name || 'unknown_error',
      statusCode,
    });
  }
});

app.post('/api/messages', async (req, res) => {
  if (!messagesApiEnabled || !messagesCollection) {
    return res.status(503).json({
      error:
        'Message API is not configured locally. Set MONGODB_URI and restart the server.',
    });
  }

  try {
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

    const result = await messagesCollection.insertOne(entry);
    const emailResult = await sendEmail(entry.name, entry.email, entry.message);
    if (!emailResult.success) {
      console.error('Resend email failed:', emailResult.error);
    }

    res.status(201).json({
      message: 'Message stored successfully.',
      id: result.insertedId,
      createdAt: entry.createdAt,
      emailSent: emailResult.success,
      emailError: emailResult.success ? undefined : String(emailResult.error),
    });
  } catch (error) {
    console.error('Error saving message', error);
    res.status(500).json({ error: 'Failed to save message. Please try again.' });
  }
});

app.get('/api/messages', async (req, res) => {
  if (!messagesApiEnabled || !messagesCollection) {
    return res.status(503).json({
      error:
        'Message API is not configured locally. Set MONGODB_URI and restart the server.',
    });
  }

  try {
    const limitParam = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitParam) ? Math.min(limitParam, 100) : 25;

    const messages = await messagesCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

app.use((err, req, res, next) => {
  if (req.path.startsWith('/api')) {
    const message = err?.message || 'Server error';
    return res.status(500).json({ error: message });
  }
  return next(err);
});

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Database connection failed. Continuing with chat-only mode.', error);
  }

  app.listen(port, () => {
    console.log(`API server ready on http://localhost:${port}`);
  });
}

startServer();

async function shutdown() {
  try {
    if (mongoClient) {
      await mongoClient.close();
    }
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
