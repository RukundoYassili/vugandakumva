import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const SUPPORT_INFO = {
  emergencyNumber: '112',
  hotlineNumber: '3512',
  childHelpline: '116',
  whatsappNumber: '+250 781 640 246',
  whatsappUrl:
    'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.',
  contactPhonePrimary: '+250 781 640 246',
  contactPhoneSecondary: '+250 791 274 264',
  email: 'vugandakumvainitiative@gmail.com',
  location: 'Kigali, Rwanda',
  resourcesPage: '/resources.html',
  contactPage: '/contact.html',
  awarenessPage: '/awareness.html',
};

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
const client = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

if (!hasOpenAIKey) {
  console.warn('OPENAI_API_KEY is missing. Chatbot will run in built-in support mode.');
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.post('/chat', async (req, res) => {
  try {
    const messages = normalizeMessages(req.body?.messages);
    const context = normalizeContext(req.body?.context);

    if (messages.length === 0) {
      return res.status(400).json({ error: 'Messages must be a non-empty array.' });
    }

    const latestUserMessage = getLatestUserMessage(messages);
    const intent = detectIntent(latestUserMessage);

    if (!client) {
      return res.json(buildFallbackPayload(latestUserMessage, intent));
    }

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(context),
          },
          ...messages,
        ],
        max_tokens: 350,
        temperature: 0.7,
      });

      const output = response.choices?.[0]?.message?.content?.trim();

      if (!output) {
        return res.json(buildFallbackPayload(latestUserMessage, intent));
      }

      return res.json({
        output,
        mode: 'ai',
        actions: getActionsForIntent(intent),
        statusLabel: 'AI live',
      });
    } catch (error) {
      console.error('OpenAI request error:', {
        status: error?.status ?? null,
        code: error?.code ?? null,
        type: error?.type ?? null,
      });

      return res.json(buildFallbackPayload(latestUserMessage, intent));
    }
  } catch (error) {
    console.error('Unexpected chat route error:', error);
    return res.status(500).json({ error: 'Server error in chat route' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => {
      if (!message || typeof message !== 'object') {
        return false;
      }

      const isSupportedRole = message.role === 'user' || message.role === 'assistant';
      return isSupportedRole && typeof message.content === 'string' && message.content.trim();
    })
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 3000),
    }));
}

function normalizeContext(context) {
  if (!context || typeof context !== 'object') {
    return {};
  }

  const safeString = (value) =>
    typeof value === 'string' ? value.trim().slice(0, 160) : '';

  return {
    path: safeString(context.path),
    title: safeString(context.title),
  };
}

function getLatestUserMessage(messages) {
  const latestUser = [...messages].reverse().find((message) => message.role === 'user');
  return latestUser?.content ?? '';
}

function buildSystemPrompt(context) {
  const pageContext = [];

  if (context.title) {
    pageContext.push(`Page title: ${context.title}`);
  }

  if (context.path) {
    pageContext.push(`Page path: ${context.path}`);
  }

  return [
    'You are the Vugandakumva support assistant for a gender-based violence awareness and survivor support website.',
    'Be compassionate, calm, and direct.',
    `If someone may be in immediate danger, tell them to call ${SUPPORT_INFO.emergencyNumber} immediately and mention the GBV hotline ${SUPPORT_INFO.hotlineNumber}.`,
    `You may also direct users to WhatsApp support at ${SUPPORT_INFO.whatsappNumber}, the contact page ${SUPPORT_INFO.contactPage}, or the resources page ${SUPPORT_INFO.resourcesPage}.`,
    'Do not claim medical or legal certainty, and do not provide dangerous advice.',
    'Keep answers practical and concise, with short paragraphs or bullets when helpful.',
    pageContext.length ? `Current page context: ${pageContext.join(' | ')}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function detectIntent(message) {
  const text = (message || '').toLowerCase();

  if (
    hasAny(text, [
      'danger',
      'unsafe',
      'emergency',
      'hurting me',
      'hurt me',
      'attacking',
      'attack',
      'right now',
      'immediate help',
      'urgent',
    ])
  ) {
    return 'emergency';
  }

  if (hasAny(text, ['report', 'police', 'legal', 'court', 'justice', 'rights', 'law'])) {
    return 'reporting';
  }

  if (hasAny(text, ['hotline', 'call', 'phone', 'number', 'whatsapp', 'contact'])) {
    return 'contact';
  }

  if (hasAny(text, ['shelter', 'safe house', 'safe place', 'housing'])) {
    return 'shelter';
  }

  if (hasAny(text, ['counseling', 'counselling', 'therapy', 'trauma', 'mental health', 'healing'])) {
    return 'counseling';
  }

  if (hasAny(text, ['volunteer', 'partner', 'donate', 'collaborate', 'support your mission'])) {
    return 'involvement';
  }

  if (hasAny(text, ['what is gbv', 'gbv', 'awareness', 'abuse', 'warning signs', 'signs'])) {
    return 'awareness';
  }

  return 'general';
}

function hasAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function buildFallbackPayload(message, intent) {
  return {
    output: buildFallbackReply(message, intent),
    mode: 'fallback',
    actions: getActionsForIntent(intent),
    statusLabel: 'Support mode',
  };
}

function buildFallbackReply(message, intent) {
  switch (intent) {
    case 'emergency':
      return [
        `If you or someone else is in immediate danger, call ${SUPPORT_INFO.emergencyNumber} now.`,
        `For GBV support in Rwanda, you can also call ${SUPPORT_INFO.hotlineNumber} for confidential help. If speaking feels hard, use WhatsApp at ${SUPPORT_INFO.whatsappNumber}.`,
        'When it is safe, move to a trusted place and reach out to a hospital or the nearest Isange One Stop Centre for medical and psychosocial support.',
      ].join('\n\n');

    case 'reporting':
      return [
        'A simple next step is to focus on safety first, then documentation and support.',
        `When safe, seek medical care, call the GBV hotline ${SUPPORT_INFO.hotlineNumber}, and report to the nearest police station. Keep copies of any medical notes, messages, photos, or case numbers if you can do so safely.`,
        `You can also use the Resources page for legal aid and reporting guidance, or contact Vugandakumva directly through ${SUPPORT_INFO.contactPage}.`,
      ].join('\n\n');

    case 'contact':
      return [
        `You can reach Vugandakumva by WhatsApp at ${SUPPORT_INFO.whatsappNumber}, by email at ${SUPPORT_INFO.email}, or by phone at ${SUPPORT_INFO.contactPhonePrimary}.`,
        `If this is urgent, call ${SUPPORT_INFO.hotlineNumber} for GBV support or ${SUPPORT_INFO.emergencyNumber} if someone is in immediate danger.`,
        `The contact page also lists more details and another support number: ${SUPPORT_INFO.contactPhoneSecondary}.`,
      ].join('\n\n');

    case 'shelter':
      return [
        'If you need a safe place, prioritize immediate safety and do not share your plans with someone who may put you at risk.',
        `The site highlights shelters and Isange One Stop Centre support through the Resources page. If you need urgent guidance, call ${SUPPORT_INFO.hotlineNumber} or message WhatsApp support at ${SUPPORT_INFO.whatsappNumber}.`,
        'If a child is affected, the child helpline is 116.',
      ].join('\n\n');

    case 'counseling':
      return [
        'Support is available, and you do not have to carry this alone.',
        'Vugandakumva shares counseling, survivor support groups, and trauma-informed help through the Resources and Contact pages.',
        `If you want, you can contact the team directly on WhatsApp at ${SUPPORT_INFO.whatsappNumber} and ask for counseling or emotional support options.`,
      ].join('\n\n');

    case 'involvement':
      return [
        'There are several ways to support the mission.',
        'You can volunteer, explore partnerships, or contact the team for collaboration through the Contact page.',
        `For a quick start, email ${SUPPORT_INFO.email} or use WhatsApp at ${SUPPORT_INFO.whatsappNumber}.`,
      ].join('\n\n');

    case 'awareness':
      return [
        'Gender-based violence can be physical, emotional, sexual, or economic abuse.',
        'Warning signs can include threats, isolation, controlling money, harassment, intimidation, and unwanted sexual contact.',
        `The Awareness page explains these patterns in more detail, and the Resources page can guide someone toward help if support is needed right now.`,
      ].join('\n\n');

    default:
      return [
        'I can help with emergency contacts, reporting steps, counseling options, shelters, legal aid, or ways to contact the Vugandakumva team.',
        `If you need urgent support, call ${SUPPORT_INFO.hotlineNumber}. If someone is in immediate danger, call ${SUPPORT_INFO.emergencyNumber}.`,
        `You can also message WhatsApp support at ${SUPPORT_INFO.whatsappNumber} or explore the Resources page for step-by-step help.`,
      ].join('\n\n');
  }
}

function getActionsForIntent(intent) {
  switch (intent) {
    case 'emergency':
      return [
        { label: `Call ${SUPPORT_INFO.emergencyNumber}`, url: `tel:${SUPPORT_INFO.emergencyNumber}`, variant: 'danger' },
        { label: `GBV Hotline ${SUPPORT_INFO.hotlineNumber}`, url: `tel:${SUPPORT_INFO.hotlineNumber}`, variant: 'primary' },
        { label: 'WhatsApp Support', url: SUPPORT_INFO.whatsappUrl, variant: 'soft' },
      ];

    case 'reporting':
      return [
        { label: 'Open Resources', url: SUPPORT_INFO.resourcesPage, variant: 'primary' },
        { label: `Call ${SUPPORT_INFO.hotlineNumber}`, url: `tel:${SUPPORT_INFO.hotlineNumber}`, variant: 'soft' },
        { label: 'Contact Vugandakumva', url: SUPPORT_INFO.contactPage, variant: 'soft' },
      ];

    case 'contact':
      return [
        { label: 'WhatsApp Team', url: SUPPORT_INFO.whatsappUrl, variant: 'primary' },
        { label: 'Open Contact Page', url: SUPPORT_INFO.contactPage, variant: 'soft' },
        { label: `Call ${SUPPORT_INFO.contactPhonePrimary}`, url: 'tel:+250781640246', variant: 'soft' },
      ];

    case 'shelter':
      return [
        { label: 'Shelter Resources', url: SUPPORT_INFO.resourcesPage, variant: 'primary' },
        { label: `Call ${SUPPORT_INFO.hotlineNumber}`, url: `tel:${SUPPORT_INFO.hotlineNumber}`, variant: 'soft' },
        { label: 'Child Helpline 116', url: `tel:${SUPPORT_INFO.childHelpline}`, variant: 'soft' },
      ];

    case 'counseling':
      return [
        { label: 'Find Counseling', url: SUPPORT_INFO.resourcesPage, variant: 'primary' },
        { label: 'Contact the Team', url: SUPPORT_INFO.contactPage, variant: 'soft' },
        { label: 'WhatsApp Support', url: SUPPORT_INFO.whatsappUrl, variant: 'soft' },
      ];

    case 'involvement':
      return [
        { label: 'Open Contact Page', url: SUPPORT_INFO.contactPage, variant: 'primary' },
        { label: `Email ${SUPPORT_INFO.email}`, url: `mailto:${SUPPORT_INFO.email}`, variant: 'soft' },
        { label: 'Learn About Vugandakumva', url: '/about.html', variant: 'soft' },
      ];

    case 'awareness':
      return [
        { label: 'Open Awareness Page', url: SUPPORT_INFO.awarenessPage, variant: 'primary' },
        { label: 'View Resources', url: SUPPORT_INFO.resourcesPage, variant: 'soft' },
        { label: 'Contact Support', url: SUPPORT_INFO.contactPage, variant: 'soft' },
      ];

    default:
      return [
        { label: 'Resources', url: SUPPORT_INFO.resourcesPage, variant: 'primary' },
        { label: 'Contact Team', url: SUPPORT_INFO.contactPage, variant: 'soft' },
        { label: 'WhatsApp Support', url: SUPPORT_INFO.whatsappUrl, variant: 'soft' },
      ];
  }
}
