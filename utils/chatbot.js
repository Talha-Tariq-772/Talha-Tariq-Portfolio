import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: ".env.local" });
dotenv.config();

const geminiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || '';
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

const PROFILE_CONTEXT = {
  name: 'Talha Tariq',
  role: 'AI Engineer and MERN Web Developer',
  summary:
    'Builds AI software, business systems, automation workflows, and full-stack web applications.',
  contact: {
    email: 'tariqtalha772@gmail.com',
    phone: '03256525755',
    address: 'Pakistan',
    github: 'https://github.com/Talha-Tariq-772',
    linkedin: 'https://www.linkedin.com/in/talha-tariq-81a85a35a',
  },
  services: [
    'Business website and web app development (MERN stack)',
    'AI software for automation, prediction, and NLP use cases',
    'Backend API architecture, integrations, and deployment',
    'UI/UX implementation with responsive, performance-focused frontend engineering',
  ],
  projects: [
    { name: 'Ebn Al Arab', url: 'https://ebnalarab.com' },
    { name: 'Albark LS', url: 'https://albarkls.com' },
    { name: 'Porta Cabins Online', url: 'https://portacabins.online' },
    { name: 'Rapid Kitchen', url: 'https://rapidkitchen.com' },
    {
      name: 'Disease Prediction System',
      url: 'https://diseasepredictormlproject-gd2sfquwaeamoxsuc4gpwn.streamlit.app/',
    },
    {
      name: 'AI Recipe Bot',
      url: 'https://intent-recipe-chatbot.streamlit.app/',
    },
  ],
  topSkills: [
    'MERN Stack Development',
    'AI Software Engineering',
    'Business Web Systems',
    'REST API Architecture',
    'Automation Workflows',
    'NLP Solutions',
    'Scalable Backend Design',
    'Responsive UI Engineering',
  ],
};

const DEFAULT_SUGGESTIONS = [
  'Show your top services',
  'List your best projects',
  'What AI software can you build?',
  'How can I contact you?',
];

function normalizeText(value = '') {
  return value.toLowerCase().trim();
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function isContactIntent(text) {
  return hasAny(text, [
    'hire',
    'contact',
    'email',
    'phone',
    'phone number',
    'number',
    'reach',
    'linkedin',
    'github',
    'address',
    'location',
    'where are you',
    'addrss',
    'adress',
    'gmail',
  ]);
}

function buildContactReply() {
  return {
    reply:
      `You can contact ${PROFILE_CONTEXT.name} through:\n` +
      `- Email: ${PROFILE_CONTEXT.contact.email}\n` +
      `- Phone: ${PROFILE_CONTEXT.contact.phone}\n` +
      `- Address/Location: ${PROFILE_CONTEXT.contact.address}\n` +
      `- LinkedIn: ${PROFILE_CONTEXT.contact.linkedin}\n` +
      `- GitHub: ${PROFILE_CONTEXT.contact.github}`,
    suggestions: [
      'I have a project idea',
      'Can we discuss timeline?',
      'What services do you offer?',
      'Show portfolio projects',
    ],
    mode: 'fallback',
  };
}

function formatProjectList(limit = 4) {
  return PROFILE_CONTEXT.projects
    .slice(0, limit)
    .map((project) => `- ${project.name}: ${project.url}`)
    .join('\n');
}

function getSuggestionSet(text) {
  if (hasAny(text, ['project', 'portfolio', 'work', 'case study'])) {
    return ['Show AI projects', 'Show web projects', 'What stack was used?', 'How to start a project?'];
  }

  if (hasAny(text, ['service', 'offer', 'build', 'solution'])) {
    return ['Web development services', 'AI software services', 'Business system development', 'Project timeline'];
  }

  if (hasAny(text, ['contact', 'hire', 'email', 'phone', 'address', 'location', 'where'])) {
    return ['Share email', 'Share phone number', 'Share address', 'Book a project call'];
  }

  return DEFAULT_SUGGESTIONS;
}

function buildRuleBasedReply(userMessage) {
  const text = normalizeText(userMessage);

  if (!text) {
    return {
      reply: 'Share your requirements and I can help you with the best solution direction.',
      suggestions: DEFAULT_SUGGESTIONS,
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['hi', 'hello', 'hey', 'salam', 'assalam'])) {
    return {
      reply:
        `Hi, I am ${PROFILE_CONTEXT.name}'s portfolio assistant. ${PROFILE_CONTEXT.name} is an ${PROFILE_CONTEXT.role} focused on business web systems and AI software. ` +
        'Tell me what you want to build and I can suggest the right scope.',
      suggestions: ['Show your top services', 'List your best projects', 'Tell me your top skills', 'How can I contact you?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['who are you', 'about', 'introduce', 'profile'])) {
    return {
      reply:
        `${PROFILE_CONTEXT.name} is an ${PROFILE_CONTEXT.role}. ${PROFILE_CONTEXT.summary} ` +
        'Core strengths include MERN applications, AI integrations, automation workflows, and production-focused delivery.',
      suggestions: ['Tell me your top skills', 'List your services', 'Show your projects', 'How can I contact you?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['service', 'offer', 'what do you do', 'what can you build', 'solution'])) {
    return {
      reply:
        `Here are the main services:\n${PROFILE_CONTEXT.services.map((service) => `- ${service}`).join('\n')}`,
      suggestions: ['Show web projects', 'Show AI projects', 'Can you build business systems?', 'How do we start?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['web', 'website', 'mern', 'react', 'frontend', 'backend'])) {
    return {
      reply:
        'For web development, the focus is on high-performance business websites and scalable MERN applications with clean architecture, modern UI, and conversion-driven UX.\n\n' +
        `Featured web projects:\n${formatProjectList(4)}`,
      suggestions: ['Can you build an admin dashboard?', 'What is your MERN process?', 'How long does a website take?', 'How can we work together?'],
      mode: 'fallback',
    };
  }

  if (isContactIntent(text)) {
    return buildContactReply();
  }

  if (hasAny(text, ['ai', 'ml', 'machine learning', 'deep learning', 'nlp', 'automation', 'chatbot', 'model'])) {
    return {
      reply:
        'AI software offerings include predictive systems, NLP solutions, intelligent assistants, and automation workflows integrated into web products.\n\n' +
        `Examples:\n- Disease Prediction System\n- AI Recipe Bot\n- NLP-based AI solutions\n\n` +
        `You can also review portfolio projects here:\n${formatProjectList(6)}`,
      suggestions: ['What AI stack do you use?', 'Can you integrate AI into my website?', 'Show AI projects', 'How to start an AI project?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['project', 'portfolio', 'work', 'case study', 'examples'])) {
    return {
      reply:
        `Here are selected projects:\n${formatProjectList(6)}\n\n` +
        'If you share your industry or use case, I can suggest which project approach matches your needs.',
      suggestions: ['Show web projects only', 'Show AI projects only', 'What technologies were used?', 'Can you build similar system for me?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['skill', 'stack', 'technology', 'tech'])) {
    return {
      reply:
        `Top skills:\n${PROFILE_CONTEXT.topSkills.map((skill) => `- ${skill}`).join('\n')}\n\n` +
        'Primary technologies include React, Node.js, Express, MongoDB, TypeScript, Python, TensorFlow, PyTorch, and Transformers.',
      suggestions: ['Show your top services', 'Can you build enterprise systems?', 'Do you do AI integrations?', 'How can I contact you?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['price', 'cost', 'budget', 'quote'])) {
    return {
      reply:
        'Project pricing depends on scope, integrations, and timeline. Share your requirements (features, tech preference, deadline), and I can provide a structured estimate approach.',
      suggestions: ['I need a web app quote', 'I need an AI project quote', 'What details do you need?', 'How fast can you deliver?'],
      mode: 'fallback',
    };
  }

  if (hasAny(text, ['timeline', 'deadline', 'how long'])) {
    return {
      reply:
        'Typical timelines vary by scope: a focused business website can be delivered quickly, while full AI-integrated systems require phased delivery (planning, implementation, testing, optimization).',
      suggestions: ['What is your process?', 'Can you work on urgent projects?', 'Show past projects', 'How can I contact you?'],
      mode: 'fallback',
    };
  }

  return {
    reply:
      `${PROFILE_CONTEXT.name} can help with AI software, business systems, and full-stack MERN products. Share your goal, required features, and timeline, and I will suggest the right solution path.`,
    suggestions: getSuggestionSet(text),
    mode: 'fallback',
  };
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-10)
    .map((item) => ({
      role: item?.role === 'assistant' ? 'assistant' : 'user',
      content: String(item?.content || '').trim().slice(0, 1000),
    }))
    .filter((item) => item.content.length > 0);
}

function buildSystemPrompt() {
  return `You are the website assistant for ${PROFILE_CONTEXT.name}.\n` +
    `Role: ${PROFILE_CONTEXT.role}.\n` +
    `Focus: ${PROFILE_CONTEXT.summary}\n\n` +
    `Service areas:\n${PROFILE_CONTEXT.services.map((service) => `- ${service}`).join('\n')}\n\n` +
    `Project highlights:\n${PROFILE_CONTEXT.projects.map((project) => `- ${project.name}: ${project.url}`).join('\n')}\n\n` +
    `Top skills:\n${PROFILE_CONTEXT.topSkills.map((skill) => `- ${skill}`).join('\n')}\n\n` +
    'Instructions:\n' +
    '- Be professional, concise, and client-focused.\n' +
    '- Prioritize clarity and concrete next steps.\n' +
    '- If asked about contact, provide email/phone/address/LinkedIn/GitHub from context.\n' +
    '- Do not invent achievements or unavailable project links.\n' +
    '- Keep responses around 80-160 words unless user asks for more detail.';
}

function buildGeminiContents(history, message) {
  const cleaned = cleanHistory(history).map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }],
  }));

  while (cleaned.length > 0 && cleaned[0].role !== 'user') {
    cleaned.shift();
  }

  cleaned.push({
    role: 'user',
    parts: [{ text: message }],
  });

  return cleaned;
}

function shouldTryNextModel(error) {
  const status = error?.status || error?.code;
  if (status === 404 || status === 429) return true;

  const message = String(error?.message || error || '').toLowerCase();
  return (
    message.includes('404') ||
    message.includes('not found') ||
    message.includes('429') ||
    message.includes('rate limit')
  );
}

async function generateGeminiReply(message, history) {
  const apiKey = geminiKey.trim();
  if (!apiKey || !genAI) return null;

  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const modelCandidates = Array.from(
    new Set(
      [
        configuredModel,
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro-latest',
      ].filter(Boolean),
    ),
  );

  let lastError = null;

  for (const model of modelCandidates) {
    try {
      const generativeModel = genAI.getGenerativeModel({
        model,
        systemInstruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
      });

      const result = await generativeModel.generateContent({
        contents: buildGeminiContents(history, message),
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 420,
        },
      });

      const reply = result?.response?.text?.()?.trim();

      if (reply) {
        return reply;
      }

      lastError = `Gemini response for ${model} did not contain text.`;
    } catch (error) {
      lastError = `Gemini request failed for ${model}: ${error?.message || error}`;
      if (shouldTryNextModel(error)) {
        continue;
      }
      throw new Error(lastError);
    }
  }

  if (lastError) {
    throw new Error(lastError);
  }

  return null;
}

export async function generateChatReply({ message, history = [] }) {
  const cleanMessage = String(message || '').trim().slice(0, 1200);
  const fallback = buildRuleBasedReply(cleanMessage);
  const normalizedMessage = normalizeText(cleanMessage);

  if (!cleanMessage) {
    return fallback;
  }

  // Always return guaranteed contact details for contact-related queries.
  if (isContactIntent(normalizedMessage)) {
    return buildContactReply();
  }

  try {
    const aiReply = await generateGeminiReply(cleanMessage, history);
    if (!aiReply) {
      return fallback;
    }

    return {
      reply: aiReply,
      suggestions: fallback.suggestions,
      mode: 'gemini',
    };
  } catch (error) {
    console.error('Chatbot AI fallback triggered:', error?.message || error);
    return fallback;
  }
}

