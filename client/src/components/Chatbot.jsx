import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const CHAT_KEY = 'vugandakumva-chatbot-session-v3';
const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

const fallbackActions = [
  { label: 'Call 112', url: 'tel:112', variant: 'danger' },
  { label: 'GBV Hotline 3512', url: 'tel:3512', variant: 'primary' },
  { label: 'WhatsApp Support', url: WA_URL, variant: 'soft' },
];

function getPageSuggestions(path) {
  if (path.includes('resources')) return ['I need help now', 'How do I report GBV?', 'Find counseling', 'Show hotline numbers'];
  if (path.includes('contact')) return ['How do I contact your team?', 'WhatsApp support', 'Volunteer with Vugandakumva', 'Partnership inquiry'];
  if (path.includes('awareness')) return ['What is GBV?', 'What are warning signs?', 'How can I help a friend?', 'Find support resources'];
  return ['Hi', 'How are you?', 'I need urgent support', 'How do I report abuse?', 'Find legal help', 'How can I contact Vugandakumva?'];
}

function getWelcome(path) {
  if (path.includes('resources')) return 'Hello. I am Vugandakumva AI, and I can help you quickly find hotlines, counseling, legal aid, shelters, and reporting steps from this page.';
  if (path.includes('contact')) return 'Hello. I am Vugandakumva AI, and I can guide you to the right phone number, WhatsApp support, email contact, or the best next step before reaching out.';
  if (path.includes('awareness')) return 'Hello. I am Vugandakumva AI, and I can explain GBV, warning signs, and where someone can go for help if support is needed right now.';
  return 'Hello. I am Vugandakumva AI, here to help with safety, GBV awareness, reporting steps, counseling, shelter options, and direct contact with the Vugandakumva team.';
}

function buildFallback(message, path) {
  const n = (message || '').toLowerCase();
  if (['danger', 'emergency', 'urgent', 'right now'].some(w => n.includes(w)))
    return 'If someone is in immediate danger, call 112 right now. For GBV support in Rwanda, call 3512, and if speaking feels difficult you can use WhatsApp support at +250 781 640 246.';
  if (['report', 'police', 'legal'].some(w => n.includes(w)))
    return 'Start with safety first, then seek medical care if needed, call 3512 for guidance, and report to the nearest police station when it is safe. The Resources page also lists reporting and legal support options.';
  if (path.includes('contact'))
    return 'You can reach the team by WhatsApp at +250 781 640 246, by phone at +250 781 640 246 or +250 791 274 264, or by email at vugandakumvainitiative@gmail.com.';
  return 'The local AI is unavailable for this moment, but support is still here. You can call 3512 for GBV help, call 112 in an emergency, use WhatsApp at +250 781 640 246, or open the Resources and Contact pages for direct guidance.';
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function formatMessage(text) { return escapeHtml(text).replace(/\n/g, '<br>'); }

function Message({ entry }) {
  const isUser = entry.role === 'user';
  return (
    <article className={`chatbot-message chatbot-message--${isUser ? 'user' : 'assistant'}`}>
      <div className={`chatbot-bubble ${entry.typing ? 'chatbot-bubble--typing' : ''}`}>
        <div className="chatbot-message__meta">{isUser ? 'You' : (entry.mode === 'ai' ? 'Vugandakumva AI' : 'Support guide')}</div>
        {entry.typing ? (
          <div className="chatbot-typing" aria-label="Typing"><span></span><span></span><span></span></div>
        ) : (
          <div className="chatbot-message__content" dangerouslySetInnerHTML={{ __html: formatMessage(entry.text || '') }} />
        )}
        {!entry.typing && entry.actions && entry.actions.length > 0 && (
          <div className="chatbot-actions">
            {entry.actions.map((action, i) => (
              action.url ? (
                <a key={i} href={action.url} className={`chatbot-action chatbot-action--${action.variant || 'soft'}`}
                  {...(action.url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
                  {action.label}
                </a>
              ) : (
                <button key={i} type="button" className={`chatbot-action chatbot-action--${action.variant || 'soft'}`}>{action.label}</button>
              )
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Chatbot() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState({ mode: 'default', label: 'AI Ready (En/Rw)' });
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    let savedConversation = [];
    let savedTranscript = [];
    try {
      const raw = sessionStorage.getItem(CHAT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        savedConversation = parsed.conversation || [];
        savedTranscript = parsed.transcript || [];
      }
    } catch {}

    const welcome = { role: 'assistant', text: getWelcome(pathname), mode: 'ai', actions: [
      { label: 'Open Resources', url: '/resources', variant: 'primary' },
      { label: 'Contact Team', url: '/contact', variant: 'soft' },
      { label: 'WhatsApp', url: WA_URL, variant: 'soft' },
    ]};

    setMessages([welcome, ...savedTranscript]);
    setConversation(savedConversation);
  }, [pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 180);
  }, [isOpen]);

  const persistSession = useCallback((conv, transcript) => {
    try { sessionStorage.setItem(CHAT_KEY, JSON.stringify({ conversation: conv, transcript })); } catch {}
  }, []);

  const submitMessage = useCallback(async (text) => {
    if (!text.trim() || isPending) return;

    const userEntry = { role: 'user', text };
    const typingEntry = { role: 'assistant', typing: true };
    const newConv = [...conversation, { role: 'user', content: text }].slice(-12);

    setMessages(prev => [...prev, userEntry, typingEntry]);
    setConversation(newConv);
    setIsPending(true);
    setStatus({ mode: 'thinking', label: 'Preparing reply' });
    setInput('');

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newConv, context: { path: pathname, title: document.title } }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const assistantEntry = { role: 'assistant', text: '', actions: [], mode: 'ai' };

      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.typing);
        return [...withoutTyping, assistantEntry];
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'metadata') {
                assistantEntry.actions = data.actions || [];
                assistantEntry.mode = data.mode || 'ai';
                const lbl = data.statusLabel || 'AI live';
                setStatus({ mode: data.mode || 'ai', label: lbl });
              } else if (data.type === 'token') {
                assistantEntry.text += data.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...assistantEntry };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }

      if (!assistantEntry.text.trim()) {
        assistantEntry.text = 'Support is available. If you need urgent help, call 3512 or 112.';
      }

      const finalConv = [...newConv, { role: 'assistant', content: assistantEntry.text }].slice(-12);
      setConversation(finalConv);
      persistSession(finalConv, [...messages.filter(m => !m.typing), userEntry, assistantEntry]);
      setStatus({ mode: 'ai', label: 'AI live' });
    } catch (err) {
      const fallbackEntry = { role: 'assistant', text: buildFallback(text, pathname), actions: fallbackActions, mode: 'fallback' };
      setMessages(prev => [...prev.filter(m => !m.typing), fallbackEntry]);
      const finalConv = [...newConv, { role: 'assistant', content: fallbackEntry.text }].slice(-12);
      setConversation(finalConv);
      persistSession(finalConv, []);
      setStatus({ mode: 'fallback', label: 'Support mode' });
    } finally {
      setIsPending(false);
    }
  }, [isPending, conversation, pathname, messages, persistSession]);

  const handleSubmit = (e) => { e.preventDefault(); submitMessage(input); };
  const handleChip = (prompt) => { setIsOpen(true); submitMessage(prompt); };

  const statusDotClass = {
    ai: 'bg-[#c8facc]',
    thinking: 'bg-[#f4b400] animate-pulse',
    fallback: 'bg-[#ffd166]',
    default: 'bg-[#ffd166]',
  }[status.mode] || 'bg-[#ffd166]';

  const statusLabel = { ai: status.label || 'AI live', thinking: 'Preparing reply', fallback: 'Support mode', default: 'AI Ready (En/Rw)' }[status.mode] || 'AI Ready';

  return (
    <>
      <button type="button" onClick={() => setIsOpen(o => !o)}
        aria-label="Open Vugandakumva support chat"
        className={`chatbot-launcher ${isOpen ? 'is-active' : ''}`}>
        <span className="chatbot-launcher__halo"></span>
        <span className="chatbot-launcher__icon"><i className="fas fa-comments"></i></span>
        <span className="chatbot-launcher__text">
          <strong>AI Chat</strong>
          <small>Bilingual Assistant</small>
        </span>
      </button>

      <section aria-label="Vugandakumva chatbot" className={`chatbot-shell ${isOpen ? 'is-open' : ''}`}>
        <div className="chatbot-shell__frame">
          <header className="chatbot-header">
            <div className="chatbot-header__identity">
              <div className="chatbot-header__avatar"><i className="fas fa-heart"></i></div>
              <div>
                <p className="chatbot-header__eyebrow">Vugandakumva</p>
                <h3>Vugandakumva AI</h3>
                <div className="chatbot-status" data-chat-status={status.mode}>
                  <span className={`chatbot-status__dot ${statusDotClass}`}></span>
                  <span className="chatbot-status__label">{statusLabel}</span>
                </div>
              </div>
            </div>
            <button className="chatbot-close" type="button" aria-label="Close chatbot" onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </header>

          <div className="chatbot-body">
            <div className="chatbot-safety-card">
              <div>
                <p className="chatbot-safety-card__eyebrow">Immediate support</p>
                <h4>If someone is in danger, act now.</h4>
                <p>Call <strong>112</strong> for emergencies or <strong>3512</strong> for GBV support in Rwanda.</p>
              </div>
              <div className="chatbot-safety-card__actions">
                <a href="tel:112">Call 112</a>
                <a href="tel:3512">Call 3512</a>
              </div>
            </div>

            <div className="chatbot-chip-row">
              {getPageSuggestions(pathname).map((prompt) => (
                <button key={prompt} type="button" className="chatbot-chip" onClick={() => handleChip(prompt)}>{prompt}</button>
              ))}
            </div>

            <div className="chatbot-message-list">
              {messages.map((entry, i) => <Message key={i} entry={entry} />)}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form className={`chatbot-composer ${isPending ? 'is-busy' : ''}`} onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chatbot-input">Type your message</label>
            <textarea
              id="chatbot-input"
              ref={inputRef}
              rows={1}
              maxLength={500}
              placeholder="Baza AI hano... / Say hi or ask about support, reporting, counseling..."
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            />
            <button type="submit" className="chatbot-send" aria-label="Send message" disabled={isPending}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
