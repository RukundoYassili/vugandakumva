import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2:1b';
const ollamaEnabled = process.env.OLLAMA_ENABLED !== 'false';

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

const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
const genAI = hasGeminiKey ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

if (ollamaEnabled) {
  console.warn(`Ollama mode enabled. Expected local API at ${ollamaBaseUrl} using model ${ollamaModel}.`);
}

if (!hasGeminiKey) {
  console.warn('GEMINI_API_KEY is missing. Gemini AI fallback will be unavailable.');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
  console.warn('Supabase URL or Key is missing. Auth routes will be unavailable.');
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

// --- AUTHENTICATION ROUTES ---

app.post('/auth/signup', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Auth system is currently offline' });
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || '' }
    }
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ user: data.user, session: data.session });
});

app.post('/auth/login', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Auth system is currently offline' });
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ user: data.user, session: data.session });
});

app.post('/auth/logout', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Auth system is currently offline' });
  
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    // A real production app would optionally invalidate the session server-side here. 
    // Supabase handles logout gracefully via the client anyway.
  }
  return res.status(200).json({ success: true });
});

// --- CHATBOT ROUTE ---

app.post('/chat', async (req, res) => {
  try {
    const messages = normalizeMessages(req.body?.messages);
    const context = normalizeContext(req.body?.context);

    if (messages.length === 0) {
      return res.status(400).json({ error: 'Messages must be a non-empty array.' });
    }

    const latestUserMessage = getLatestUserMessage(messages);
    const intent = detectIntent(latestUserMessage);
    const instantReply = buildInstantReply(latestUserMessage, intent, context);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    if (instantReply) {
      res.write(`data: ${JSON.stringify({ type: 'metadata', actions: getActionsForIntent(intent), statusLabel: 'Local AI live', mode: 'ai' })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'token', text: instantReply })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const success = await streamAiReply(res, messages, context, intent, latestUserMessage);

    if (!success) {
      const fallback = buildFallbackPayload(latestUserMessage, intent);
      res.write(`data: ${JSON.stringify({ type: 'metadata', actions: fallback.actions, statusLabel: fallback.statusLabel, mode: fallback.mode })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'token', text: fallback.output })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }
  } catch (error) {
    console.error('Unexpected chat route error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Server error in chat route' });
    } else {
      res.end();
    }
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
    'You are the Vugandakumva support assistant for a gender-based violence (GBV) awareness and survivor support organization in Rwanda.',
    'Your tone is warm, calm, modern, and human. However, you must never pretend to be a human or a licensed medical counselor.',
    'IMPORTANT LANGUAGE INSTRUCTION: You are fully bilingual. If the user speaks to you in Kinyarwanda (e.g. "Muraho", "Ndembye", "Amakuru", "Gufasha"), you MUST reply entirely and fluently in professional, empathetic Kinyarwanda. If they speak English, reply in English.',
    'Keep your replies very concise: 1 to 2 short paragraphs or 3 bullet points maximum.',
    'Do not invent facts about Vugandakumva, team members, Rwandan laws, or services. If you do not know, say so gently.',
    `If someone implies they are in immediate danger, tell them to call ${SUPPORT_INFO.emergencyNumber} immediately and the GBV hotline ${SUPPORT_INFO.hotlineNumber}.`,
    'CRITICAL: NEVER output raw URLs or .html links in your text (e.g., do not say "/contact.html" or "https://"). Instead, just say "our contact page" or "the resources section". The system will automatically spawn clickable buttons for the user below your message.',
    'Be practical. End with a helpful, gentle next step when appropriate.',
    buildGroundingFacts(),
    pageContext.length ? `[Current page context: ${pageContext.join(' | ')}]` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function buildGroundingFacts() {
  let customKnowledge = '';
  try {
    const knowledgePath = path.join(__dirname, 'custom_knowledge.json');
    if (existsSync(knowledgePath)) {
      const db = JSON.parse(readFileSync(knowledgePath, 'utf8'));
      customKnowledge = `\n--- Custom KnowledgeBase ---\n${JSON.stringify(db)}`;
    }
  } catch(e) {}

  return [
    '--- Grounding Facts ---',
    'We have a Resources page, a Contact page, and an Awareness page.',
    'There is no report form, no "report tab", no booking engine, and no account system on this website.',
    `Primary Emergency number: ${SUPPORT_INFO.emergencyNumber}. GBV hotline: ${SUPPORT_INFO.hotlineNumber}. Child helpline: ${SUPPORT_INFO.childHelpline}.`,
    `WhatsApp support: ${SUPPORT_INFO.whatsappNumber}. Email: ${SUPPORT_INFO.email}.`,
    'CRITICAL: For ALL localized facts, emergency processes, specific center details, and RIB protocols, strictly derive your answers from the Custom KnowledgeBase provided below.',
    'Never instruct the user to click a tab or feature that does not exist in these grounding facts.',
    customKnowledge
  ].join(' ');
}

async function streamAiReply(res, messages, context, intent, latestUserMessage) {
  if (ollamaEnabled) {
    const success = await streamOllamaReply(res, messages, context, intent, latestUserMessage);
    if (success) return true;
  }

  if (genAI) {
    const success = await streamGeminiReply(res, messages, context, intent, latestUserMessage);
    if (success) return true;
  }

  return false;
}

async function streamOllamaReply(res, messages, context, intent, latestUserMessage) {
  try {
    const response = await fetchWithTimeout(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        stream: true,
        keep_alive: '30m',
        messages: [{ role: 'system', content: buildSystemPrompt(context) }, ...messages],
        options: { temperature: 0.4, num_predict: 350 },
      }),
    }, 60000);

    if (!response.ok) {
      console.error('Ollama request error:', response.status);
      return false;
    }

    res.write(`data: ${JSON.stringify({ type: 'metadata', actions: getActionsForIntent(intent), statusLabel: 'Local AI live', mode: 'ai' })}\n\n`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunks = decoder.decode(value, { stream: true }).split('\n');
      for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        try {
          const parsed = JSON.parse(chunk);
          if (parsed.message?.content) {
            res.write(`data: ${JSON.stringify({ type: 'token', text: parsed.message.content })}\n\n`);
          }
        } catch (e) {}
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
    return true;
  } catch (error) {
    console.error('Ollama connection error:', error?.message ?? error);
    return false;
  }
}

async function streamGeminiReply(res, messages, context, intent, latestUserMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const validHistory = [
      { role: 'user', parts: [{ text: "SYSTEM INSTRUCTION: " + buildSystemPrompt(context) }] },
      { role: 'model', parts: [{ text: "Understood. I will strictly follow these facts and instructions for all answers." }] }
    ];
    let lastRole = null;
    for (const msg of messages) {
      const mappedRole = msg.role === 'assistant' ? 'model' : 'user';
      if (mappedRole !== lastRole) {
        validHistory.push({ role: mappedRole, parts: [{ text: msg.content }] });
        lastRole = mappedRole;
      } else {
        validHistory[validHistory.length - 1].parts[0].text += '\n' + msg.content;
      }
    }

    const result = await model.generateContentStream({ contents: validHistory });

    res.write(`data: ${JSON.stringify({ type: 'metadata', actions: getActionsForIntent(intent), statusLabel: 'Gemini AI Live', mode: 'ai' })}\n\n`);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ type: 'token', text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
    return true;
  } catch (error) {
    console.error('Gemini stream error:', error?.message ?? error);
    return false;
  }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function detectIntent(message) {
  const text = (message || '').toLowerCase();

  if (
    hasAny(text, [
      'danger', 'unsafe', 'emergency', 'hurting me', 'hurt me', 'attacking', 'attack', 'right now', 'immediate help', 'urgent',
      'ndembye', 'byihutirwa', 'mutabare', 'kwiheba', 'gukubitwa', 'ihohoterwa', 'anyishe'
    ])
  ) {
    return 'emergency';
  }

  if (hasAny(text, ['report', 'police', 'legal', 'court', 'justice', 'rights', 'law', 'kurega', 'polisi', 'amategeko', 'inkiko', 'uburenganzira', 'rib'])) {
    return 'reporting';
  }

  if (hasAny(text, ['counseling', 'counselling', 'therapy', 'trauma', 'mental health', 'healing', 'kuganirizwa', 'ihumure', 'guhumurizwa', 'kugisha inama'])) {
    return 'counseling';
  }

  if (hasAny(text, ['shelter', 'safe house', 'safe place', 'housing', 'bucumbi', 'aho kwihisha', 'kicumbi'])) {
    return 'shelter';
  }

  if (hasAny(text, ['hotline', 'call', 'phone', 'number', 'whatsapp', 'contact', 'nimero', 'guhamagara', 'kuhamagara', 'tuvugane'])) {
    return 'contact';
  }

  if (hasAny(text, ['what is gbv', 'gbv', 'awareness', 'abuse', 'warning signs', 'signs', 'ihohoterwa rishingiye ku gitsina', 'bimwe mu bimenyetso'])) {
    return 'awareness';
  }

  if (hasAny(text, ['volunteer', 'partner', 'donate', 'collaborate', 'support your mission', 'gufasha', 'gushyigikira', 'inkunga'])) {
    return 'involvement';
  }

  if (
    hasAny(text, [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you', 'how r you', 'what can you do', 'who are you',
      'muraho', 'bite', 'amakuru', 'mwaramutse', 'mwiriwe', 'uri inde', 'wakora iki'
    ])
  ) {
    return 'smalltalk';
  }

  return 'general';
}

function hasAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function isKinyarwanda(text) {
  return hasAny((text || '').toLowerCase(), [
    'muraho', 'bite', 'amakuru', 'mwiriwe', 'mwaramutse', 'ndembye', 'mutabare', 'polisi', 'kurega', 'amategeko', 'gufasha', 'ihohoterwa', 'rwanda', 'yego', 'oya', 'ndashaka', 'kuhamagara', 'nimero', 'ihumure'
  ]);
}

function buildInstantReply(message, intent, context) {
  if (intent !== 'smalltalk') {
    return null;
  }

  const text = (message || '').toLowerCase().trim();
  const isKw = isKinyarwanda(text);

  if (text.includes('how are you') || text.includes('how r you') || text.includes('amakuru') || text.includes('bite') || text.includes('muraho')) {
    return isKw 
      ? 'Muraho! Ndi hano kugira ngo ngufashe. Wambwira icyo wifuza tukaguha amakuru ku butabazi, uko watanga ikirego, cyangwa uko wavugana n\'ikipe ya Vugandakumva.'
      : 'I am here and ready to help. If you want, tell me what you need and I can guide you through support resources, reporting steps, counseling options, or how to contact the Vugandakumva team.';
  }

  if (text.includes('what can you do') || text.includes('wakora iki')) {
    return isKw
      ? 'Nshobora kugufasha kubona amakuru ku ihohoterwa rishingiye ku gitsina, ubutabazi bwihuse, uko batanga ikirego, aho wabona ubufasha bw\'ihumure (counseling), n\'uko wavugana na Vugandakumva.'
      : 'I can help with GBV awareness, urgent support options, reporting guidance, counseling and shelter information, and the fastest way to reach the Vugandakumva team.';
  }

  if (text.includes('who are you') || text.includes('uri inde')) {
    return isKw
      ? 'Ndi AI ya Vugandakumva, igufasha kubona ubufasha kuri uru rubuga. Nshobora kugusobanurira amakuru n\'uko wegera inzego zibishinzwe.'
      : 'I am Vugandakumva AI, a local support assistant for this website. I can explain resources, suggest next steps, and help you find the right contact or support option.';
  }

  if (context.path === '/contact.html') {
    return isKw
      ? 'Muraho. Nshobora kugufasha guhitamo uburyo bwiza bwo kuvugana na Vugandakumva: yaba WhatsApp, telefone, imeri, cyangwa wuzuza fomu hano.'
      : 'Hello. I can help you choose the best way to contact the Vugandakumva team, whether that is WhatsApp, phone, email, or the support form on this page.';
  }

  if (context.path === '/resources.html') {
    return isKw
      ? 'Muraho. Nshobora kugufasha gushaka nimero z\'ubutabazi, inama, amategeko n\'ibindi kuri uru rubuga.'
      : 'Hello. I can help you quickly find hotlines, counseling, legal aid, shelter options, and other support resources from this page.';
  }

  if (context.path === '/awareness.html') {
    return isKw
      ? 'Muraho. Nshobora kugusobanurira ibyerekeye ihohoterwa rishingiye ku gitsina, ibimenyetso byaryo n\'aho wabona ubufasha bwihuse.'
      : 'Hello. I can explain GBV, warning signs, and where someone can go for help if support is needed right now.';
  }

  return isKw
    ? 'Muraho. Ndi AI ya Vugandakumva, nshobora kugufasha kubona amakuru y\'ubutabazi, aho watanga ikirego, cyangwa se kuvugana n\'ikipe yacu.'
    : 'Hello. I am Vugandakumva AI, and I can help with support resources, reporting steps, counseling options, safety guidance, or how to contact the team.';
}

function sanitizeAiOutput(output, intent, latestUserMessage) {
  const unsafePatterns = [
    'report tab',
    'booking tab',
    'book a session on the website',
    'www.vugandakumva.org',
    'log in',
    'create an account',
  ];

  const normalizedOutput = output.toLowerCase();
  const hasUnsafePattern = unsafePatterns.some((pattern) => normalizedOutput.includes(pattern));

  if (hasUnsafePattern) {
    return buildGuidedReply(latestUserMessage, intent);
  }

  return output;
}

function buildGuidedReply(message, intent) {
  const isKw = isKinyarwanda(message);
  switch (intent) {
    case 'reporting':
      return isKw
        ? [
            'Niba ushaka gutanga ikirego, banza witaye ku mutekano wawe.',
            `Mu gihe wumva utekanye, shaka ubufasha bwo kwa muganga niba ukeneye, hamagara ${SUPPORT_INFO.hotlineNumber} kugira ngo baguhe amabwiriza, cyangwa wegera sitasiyo ya Polisi ikwegereye. Bika ubutumwa, amafoto, n'impapuro za muganga niba bikunze.`,
            `Ushobora no gukoresha paji y'Amakuru (${SUPPORT_INFO.resourcesPage}) kwiyungura ubumenyi, cyangwa ukavugana na Vugandakumva kuri ${SUPPORT_INFO.contactPage}.`
          ].join('\n\n')
        : [
            'If you want to report GBV, start with safety first.',
            `When it is safe, seek medical care if needed, call ${SUPPORT_INFO.hotlineNumber} for guidance, and report to the nearest police station. Keep any messages, photos, medical notes, or case numbers if you can do so safely.`,
            `You can also use ${SUPPORT_INFO.resourcesPage} for step-by-step help or ${SUPPORT_INFO.contactPage} to reach the Vugandakumva team directly.`,
          ].join('\n\n');

    case 'contact':
      return isKw
        ? [
            `Ushobora kuvugana na Vugandakumva kuri WhatsApp: ${SUPPORT_INFO.whatsappNumber}, Imeri: ${SUPPORT_INFO.email}, cyangwa Telefone: ${SUPPORT_INFO.contactPhonePrimary}.`,
            `Niba ari byihutirwa, hamagara ${SUPPORT_INFO.hotlineNumber}. Niba wowe cyangwa undi muntu ari mu kaga ako kanya, hamagara ${SUPPORT_INFO.emergencyNumber}.`
          ].join('\n\n')
        : [
            `You can contact Vugandakumva by WhatsApp at ${SUPPORT_INFO.whatsappNumber}, by email at ${SUPPORT_INFO.email}, or by phone at ${SUPPORT_INFO.contactPhonePrimary}.`,
            `If this is urgent, call ${SUPPORT_INFO.hotlineNumber}. If someone is in immediate danger, call ${SUPPORT_INFO.emergencyNumber}.`,
          ].join('\n\n');

    default:
      return buildFallbackReply(message, intent);
  }
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
  const isKw = isKinyarwanda(message);
  switch (intent) {
    case 'emergency':
      return isKw
        ? [
            `Niba wowe cyangwa undi ari mu kaga, hamagara ${SUPPORT_INFO.emergencyNumber} ako kanya.`,
            `Ku byo ihohoterwa rishingiye ku gitsina, wakwitabaza nimero itishyurwa ${SUPPORT_INFO.hotlineNumber} bagufashe mu ibanga. Niba kuvuga bikugoye, ohereza ubutumwa kuri WhatsApp: ${SUPPORT_INFO.whatsappNumber}.`,
            'Niba wumva utekanye, gana Isange One Stop Centre aho ushobora kubona ubufasha bw\'ubuvuzi n\'ihumure.'
          ].join('\n\n')
        : [
            `If you or someone else is in immediate danger, call ${SUPPORT_INFO.emergencyNumber} now.`,
            `For GBV support in Rwanda, you can also call ${SUPPORT_INFO.hotlineNumber} for confidential help. If speaking feels hard, use WhatsApp at ${SUPPORT_INFO.whatsappNumber}.`,
            'When it is safe, move to a trusted place and reach out to a hospital or the nearest Isange One Stop Centre for medical and psychosocial support.',
          ].join('\n\n');

    case 'reporting':
      return isKw
        ? [
            'Banza ushake umutekano mbere na mbere.',
            `Vugana na muganga, hamagara ${SUPPORT_INFO.hotlineNumber}, cyangwa ujye kuri Polisi yagwegereye. Bika byose byagufasha kugaragaza ibimenyetso: inyandiko zo kwa muganga n'amafoto.`,
            `Mu bindi wasura paji yacu cyangwa ukavugana natwe kuri paji ya ${SUPPORT_INFO.contactPage}.`
          ].join('\n\n')
        : [
            'A simple next step is to focus on safety first, then documentation and support.',
            `When safe, seek medical care, call the GBV hotline ${SUPPORT_INFO.hotlineNumber}, and report to the nearest police station. Keep copies of any medical notes, messages, photos, or case numbers if you can do so safely.`,
            `You can also use the Resources page for legal aid and reporting guidance, or contact Vugandakumva directly through ${SUPPORT_INFO.contactPage}.`,
          ].join('\n\n');

    case 'contact':
      return isKw
        ? [
            `Mwatwandikira kuri WhatsApp: ${SUPPORT_INFO.whatsappNumber}, mukatwoherereza Imeri kuri ${SUPPORT_INFO.email}, cyangwa mukaduhamagara kuri ${SUPPORT_INFO.contactPhonePrimary}.`,
            `Mu bihe byihutirwa, mwahamagara ${SUPPORT_INFO.hotlineNumber} ku ihohoterwa, cyangwa ${SUPPORT_INFO.emergencyNumber} mu gihe uri mu kaga.`
          ].join('\n\n')
        : [
            `You can reach Vugandakumva by WhatsApp at ${SUPPORT_INFO.whatsappNumber}, by email at ${SUPPORT_INFO.email}, or by phone at ${SUPPORT_INFO.contactPhonePrimary}.`,
            `If this is urgent, call ${SUPPORT_INFO.hotlineNumber} for GBV support or ${SUPPORT_INFO.emergencyNumber} if someone is in immediate danger.`,
            `The contact page also lists more details and another support number: ${SUPPORT_INFO.contactPhoneSecondary}.`,
          ].join('\n\n');

    case 'shelter':
      return isKw
        ? [
            'Niba ukeneye aho kwihisha, banza gushaka umutekano wawe ntiwibwire umugambi wawe uwaguhutaza.',
            `Urubuga rwacu n'Isange One Stop Centre rwabigufashamo. Ibyihutirwa hamagara ${SUPPORT_INFO.hotlineNumber} cyangwa wandike kuri WhatsApp yacu ${SUPPORT_INFO.whatsappNumber}.`,
            'Niba hari umwana uhohoterwa, hamagara 116.'
          ].join('\n\n')
        : [
            'If you need a safe place, prioritize immediate safety and do not share your plans with someone who may put you at risk.',
            `The site highlights shelters and Isange One Stop Centre support through the Resources page. If you need urgent guidance, call ${SUPPORT_INFO.hotlineNumber} or message WhatsApp support at ${SUPPORT_INFO.whatsappNumber}.`,
            'If a child is affected, the child helpline is 116.',
          ].join('\n\n');

    case 'counseling':
      return isKw
        ? [
            'Ubufasha burahari, kandi ntabwo ukeneye kubyikorera wenyine.',
            'Vugandakumva igaragaza inama, amatsinda ashyigikira abahohotewe n\'ubufasha mu by\'ihungabana muri paji y\'ibyakwifashishwa (Resources).',
            `Wahita wiyandikira ikipe yetu kuri WhatsApp: ${SUPPORT_INFO.whatsappNumber} ugasaba ko baguhuza na muganga w'ihumure.`
          ].join('\n\n')
        : [
            'Support is available, and you do not have to carry this alone.',
            'Vugandakumva shares counseling, survivor support groups, and trauma-informed help through the Resources and Contact pages.',
            `If you want, you can contact the team directly on WhatsApp at ${SUPPORT_INFO.whatsappNumber} and ask for counseling or emotional support options.`,
          ].join('\n\n');

    case 'involvement':
      return isKw
        ? [
            'Hari uburyo bwinshi bwo gushyigikira iyi ntego.',
            `Kwitanga cyangwa gutera inkunga wabibona haba ukoresheje Paji ya ${SUPPORT_INFO.contactPage}.`,
            `Kugira ngo bworohere kandi, waduhamagara kuri WhatsApp: ${SUPPORT_INFO.whatsappNumber} cyangwa imeri: ${SUPPORT_INFO.email}.`
          ].join('\n\n')
        : [
            'There are several ways to support the mission.',
            'You can volunteer, explore partnerships, or contact the team for collaboration through the Contact page.',
            `For a quick start, email ${SUPPORT_INFO.email} or use WhatsApp at ${SUPPORT_INFO.whatsappNumber}.`,
          ].join('\n\n');

    case 'awareness':
      return isKw
        ? [
            'Ihohoterwa rishingiye ku gitsina rishobora gukorwa ari iry\'umubiri, imbamutima, imibonano, cyangwa mu by\'ubukungu.',
            'Ibimenyetso byaryo harimo iterabwoba, guheza cyangwa akato, imicungire y\'amafaranga, ihohoterwa mu magambo, n\'imibonano y\'agahato.',
            'Wanongeye kuganira natwe, usura paji ya Vugandakumva (Awareness page) ubone ibisobanuro birambuye.'
          ].join('\n\n')
        : [
            'Gender-based violence can be physical, emotional, sexual, or economic abuse.',
            'Warning signs can include threats, isolation, controlling money, harassment, intimidation, and unwanted sexual contact.',
            `The Awareness page explains these patterns in more detail, and the Resources page can guide someone toward help if support is needed right now.`,
          ].join('\n\n');

    default:
      return isKw
        ? [
            `Nshobora kugufasha ku bw'ibibazo byawe binjye mu buvuzi cyangwa ukomeza kwiga amakuru afasha kwirinda ihohoterwa.`,
            `Kugira ngo uvuge mu buryo bwihuse kandi, hamagara ${SUPPORT_INFO.hotlineNumber}. Mu kaga, hamagara ${SUPPORT_INFO.emergencyNumber}.`,
            `Cyane cyane kandi wandikire kuri WhatsApp yacu: ${SUPPORT_INFO.whatsappNumber}.`
          ].join('\n\n')
        : [
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

    case 'smalltalk':
      return [
        { label: 'Explore Resources', url: SUPPORT_INFO.resourcesPage, variant: 'primary' },
        { label: 'Talk to the Team', url: SUPPORT_INFO.contactPage, variant: 'soft' },
        { label: 'WhatsApp Support', url: SUPPORT_INFO.whatsappUrl, variant: 'soft' },
      ];

    default:
      return [
        { label: 'Resources', url: SUPPORT_INFO.resourcesPage, variant: 'primary' },
        { label: 'Contact Team', url: SUPPORT_INFO.contactPage, variant: 'soft' },
        { label: 'WhatsApp Support', url: SUPPORT_INFO.whatsappUrl, variant: 'soft' },
      ];
  }
}
