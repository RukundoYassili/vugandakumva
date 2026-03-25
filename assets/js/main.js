/* ============================================
   VUGANDAKUMVA - Main JavaScript
   Handles: Navigation, Slider, Animations,
            Counter, Mobile Menu, Scroll, Chatbot
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderShadow();
  initSlider();
  initFadeIn();
  initCounters();
  initSmoothScroll();
  initContactForm();
  initResourceFilters();
  initFloatingButtons();
  initChatbot();
});

function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initHeaderShadow() {
  const header = document.getElementById('header');

  if (!header) {
    return;
  }

  window.addEventListener('scroll', () => {
    header.style.boxShadow =
      window.scrollY > 10
        ? '0 4px 30px rgba(0,0,0,0.12)'
        : '0 2px 20px rgba(0,0,0,0.08)';
  });
}

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const btnNext = document.querySelector('.slider-next');
  const btnPrev = document.querySelector('.slider-prev');

  if (!slides.length) {
    return;
  }

  let currentSlide = 0;
  let slideInterval = null;

  const goToSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');

    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  };

  const restartSlider = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
    }

    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  };

  goToSlide(0);
  restartSlider();

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      restartSlider();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      restartSlider();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      restartSlider();
    });
  });
}

function initFadeIn() {
  const fadeElements = document.querySelectorAll('.fade-in');

  if (!fadeElements.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((element) => observer.observe(element));
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (!counters.length || !('IntersectionObserver' in window)) {
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.target, 10);
  const suffix = element.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    element.textContent = Math.floor(current).toLocaleString() + suffix;

    if (current < target) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function handleAnchorClick(event) {
      const target = document.querySelector(this.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener('submit', function handleFormSubmit(event) {
    event.preventDefault();

    const button = this.querySelector('button[type="submit"]');
    const originalHtml = button.innerHTML;

    button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    button.style.background = '#2E7D32';
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = originalHtml;
      button.style.background = '';
      button.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

function initResourceFilters() {
  const buttons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.resource-card[data-cat]');

  if (!buttons.length || !cards.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      const activeCategory = button.dataset.filter;

      cards.forEach((card) => {
        card.style.display =
          activeCategory === 'all' || card.dataset.cat === activeCategory ? '' : 'none';
      });
    });
  });
}

function initFloatingButtons() {
  window.addEventListener('scroll', () => {
    const whatsappButton = document.getElementById('whatsapp-btn');

    if (whatsappButton) {
      whatsappButton.style.opacity = window.scrollY > 300 ? '1' : '0.85';
    }
  });
}

function initChatbot() {
  const CHAT_STORAGE_KEY = 'vugandakumva-chatbot-session-v2';
  const fallbackActions = [
    {
      label: 'Call 112',
      url: 'tel:112',
      variant: 'danger',
    },
    {
      label: 'GBV Hotline 3512',
      url: 'tel:3512',
      variant: 'primary',
    },
    {
      label: 'WhatsApp Support',
      url: 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.',
      variant: 'soft',
    },
  ];

  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  const session = loadSession();
  const state = {
    conversation: Array.isArray(session.conversation) ? session.conversation : [],
    transcript: Array.isArray(session.transcript) ? session.transcript : [],
    isOpen: false,
    isPending: false,
  };

  const launcher = document.createElement('button');
  launcher.className = 'chatbot-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open Vugandakumva support chat');
  launcher.innerHTML = `
    <span class="chatbot-launcher__halo"></span>
    <span class="chatbot-launcher__icon"><i class="fas fa-comments"></i></span>
    <span class="chatbot-launcher__text">
      <strong>Support Chat</strong>
      <small>Safe, guided help</small>
    </span>
  `;

  const shell = document.createElement('section');
  shell.className = 'chatbot-shell';
  shell.setAttribute('aria-label', 'Vugandakumva chatbot');
  shell.innerHTML = `
    <div class="chatbot-shell__frame">
      <header class="chatbot-header">
        <div class="chatbot-header__identity">
          <div class="chatbot-header__avatar">
            <i class="fas fa-heart"></i>
          </div>
          <div>
            <p class="chatbot-header__eyebrow">Vugandakumva</p>
            <h3>Support Companion</h3>
            <div class="chatbot-status" data-chat-status="default">
              <span class="chatbot-status__dot"></span>
              <span class="chatbot-status__label">Guided support</span>
            </div>
          </div>
        </div>
        <button class="chatbot-close" type="button" aria-label="Close chatbot">
          <i class="fas fa-times"></i>
        </button>
      </header>

      <div class="chatbot-body">
        <div class="chatbot-safety-card">
          <div>
            <p class="chatbot-safety-card__eyebrow">Immediate support</p>
            <h4>If someone is in danger, act now.</h4>
            <p>Call <strong>112</strong> for emergencies or <strong>3512</strong> for GBV support in Rwanda.</p>
          </div>
          <div class="chatbot-safety-card__actions">
            <a href="tel:112">Call 112</a>
            <a href="tel:3512">Call 3512</a>
          </div>
        </div>

        <div class="chatbot-chip-row" data-chat-suggestions></div>

        <div class="chatbot-message-list" data-chat-messages></div>
      </div>

      <form class="chatbot-composer" data-chat-form>
        <label class="sr-only" for="chatbot-input">Type your message</label>
        <textarea
          id="chatbot-input"
          rows="1"
          maxlength="500"
          placeholder="Ask about support, reporting, counseling, safety, or contact options..."
          data-chat-input
        ></textarea>
        <button type="submit" class="chatbot-send" aria-label="Send message">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(shell);

  const closeButton = shell.querySelector('.chatbot-close');
  const form = shell.querySelector('[data-chat-form]');
  const input = shell.querySelector('[data-chat-input]');
  const messages = shell.querySelector('[data-chat-messages]');
  const suggestions = shell.querySelector('[data-chat-suggestions]');

  populateSuggestions(suggestions, getPromptSuggestions(pageName), handlePromptClick);
  renderWelcome(messages, pageName);
  renderTranscript(messages, state.transcript);
  setStatus(shell, 'default');
  scrollMessages(messages);

  launcher.addEventListener('click', () => {
    state.isOpen = !state.isOpen;
    syncChatVisibility();
  });

  closeButton.addEventListener('click', () => {
    state.isOpen = false;
    syncChatVisibility();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.isOpen) {
      state.isOpen = false;
      syncChatVisibility();
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message || state.isPending) {
      return;
    }

    await submitUserMessage(message);
  });

  function syncChatVisibility() {
    shell.classList.toggle('is-open', state.isOpen);
    launcher.classList.toggle('is-active', state.isOpen);

    if (state.isOpen) {
      setTimeout(() => input.focus(), 180);
      scrollMessages(messages);
    }
  }

  function handlePromptClick(prompt) {
    if (state.isPending) {
      return;
    }

    state.isOpen = true;
    syncChatVisibility();
    input.value = prompt;
    input.dispatchEvent(new Event('input'));
    submitUserMessage(prompt);
  }

  async function submitUserMessage(message) {
    appendMessage(messages, { role: 'user', text: message });
    state.transcript.push({ role: 'user', text: message });
    state.conversation.push({ role: 'user', content: message });
    trimConversation();
    persistSession();

    input.value = '';
    input.style.height = 'auto';

    const typingElement = appendTyping(messages);
    state.isPending = true;
    setStatus(shell, 'thinking');
    form.classList.add('is-busy');

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: state.conversation,
          context: {
            path: window.location.pathname,
            title: document.title,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with ${response.status}`);
      }

      const data = await response.json();
      typingElement.remove();

      const assistantEntry = {
        role: 'assistant',
        text:
          typeof data.output === 'string' && data.output.trim()
            ? data.output.trim()
            : 'Support is available. If you need urgent help, call 3512 or 112.',
        actions: Array.isArray(data.actions) ? data.actions : [],
        mode: data.mode === 'ai' ? 'ai' : 'fallback',
      };

      state.conversation.push({ role: 'assistant', content: assistantEntry.text });
      trimConversation();
      state.transcript.push(assistantEntry);
      appendMessage(messages, assistantEntry);
      setStatus(shell, assistantEntry.mode === 'ai' ? 'ai' : 'fallback');
      persistSession();
    } catch (error) {
      console.error(error);
      typingElement.remove();

      const offlineEntry = {
        role: 'assistant',
        text: buildOfflineFallback(message, pageName),
        actions: fallbackActions,
        mode: 'fallback',
      };

      state.conversation.push({ role: 'assistant', content: offlineEntry.text });
      trimConversation();
      state.transcript.push(offlineEntry);
      appendMessage(messages, offlineEntry);
      setStatus(shell, 'fallback');
      persistSession();
    } finally {
      state.isPending = false;
      form.classList.remove('is-busy');
      scrollMessages(messages);
    }
  }

  function trimConversation() {
    state.conversation = state.conversation.slice(-12);
  }

  function persistSession() {
    const payload = {
      conversation: state.conversation,
      transcript: state.transcript,
    };

    window.sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));
  }

  function loadSession() {
    try {
      const raw = window.sessionStorage.getItem(CHAT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.error(error);
      return {};
    }
  }
}

function renderWelcome(container, pageName) {
  const welcomeText = getWelcomeMessage(pageName);
  appendMessage(container, {
    role: 'assistant',
    text: welcomeText,
    actions: [
      { label: 'Open Resources', url: '/resources.html', variant: 'primary' },
      { label: 'Contact Team', url: '/contact.html', variant: 'soft' },
      {
        label: 'WhatsApp',
        url: 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.',
        variant: 'soft',
      },
    ],
  });
}

function renderTranscript(container, transcript) {
  transcript.forEach((entry) => appendMessage(container, entry));
}

function appendMessage(container, entry) {
  const wrapper = document.createElement('article');
  wrapper.className = `chatbot-message chatbot-message--${entry.role === 'user' ? 'user' : 'assistant'}`;

  const bubble = document.createElement('div');
  bubble.className = 'chatbot-bubble';

  const meta = document.createElement('div');
  meta.className = 'chatbot-message__meta';
  meta.textContent = entry.role === 'user' ? 'You' : entry.mode === 'ai' ? 'AI-assisted' : 'Support guide';

  const content = document.createElement('div');
  content.className = 'chatbot-message__content';
  content.innerHTML = formatMessage(entry.text || '');

  bubble.appendChild(meta);
  bubble.appendChild(content);

  if (Array.isArray(entry.actions) && entry.actions.length) {
    const actions = document.createElement('div');
    actions.className = 'chatbot-actions';

    entry.actions.forEach((action) => {
      if (!action || typeof action !== 'object') {
        return;
      }

      const element = action.url ? document.createElement('a') : document.createElement('button');
      element.className = `chatbot-action chatbot-action--${action.variant || 'soft'}`;
      element.textContent = action.label || 'Open';

      if (action.url) {
        element.href = action.url;

        if (action.url.startsWith('http')) {
          element.target = '_blank';
          element.rel = 'noopener';
        }
      } else {
        element.type = 'button';
      }

      actions.appendChild(element);
    });

    bubble.appendChild(actions);
  }

  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  scrollMessages(container);
}

function appendTyping(container) {
  const wrapper = document.createElement('article');
  wrapper.className = 'chatbot-message chatbot-message--assistant';

  const bubble = document.createElement('div');
  bubble.className = 'chatbot-bubble chatbot-bubble--typing';
  bubble.innerHTML = `
    <div class="chatbot-message__meta">Support guide</div>
    <div class="chatbot-typing" aria-label="Typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  scrollMessages(container);
  return wrapper;
}

function populateSuggestions(container, prompts, onClick) {
  container.innerHTML = '';

  prompts.forEach((prompt) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chatbot-chip';
    button.textContent = prompt;
    button.addEventListener('click', () => onClick(prompt));
    container.appendChild(button);
  });
}

function getPromptSuggestions(pageName) {
  const byPage = {
    'resources.html': [
      'I need help now',
      'How do I report GBV?',
      'Find counseling',
      'Show hotline numbers',
    ],
    'contact.html': [
      'How do I contact your team?',
      'WhatsApp support',
      'Volunteer with Vugandakumva',
      'Partnership inquiry',
    ],
    'awareness.html': [
      'What is GBV?',
      'What are warning signs?',
      'How can I help a friend?',
      'Find support resources',
    ],
  };

  return (
    byPage[pageName] || [
      'I need urgent support',
      'How do I report abuse?',
      'Find legal help',
      'How can I contact Vugandakumva?',
    ]
  );
}

function getWelcomeMessage(pageName) {
  if (pageName === 'resources.html') {
    return 'I can help you quickly find hotlines, counseling, legal aid, shelters, and reporting steps from this page.';
  }

  if (pageName === 'contact.html') {
    return 'I can guide you to the right phone number, WhatsApp support, email contact, or the best next step before reaching out.';
  }

  if (pageName === 'awareness.html') {
    return 'I can explain GBV, warning signs, and where someone can go for help if support is needed right now.';
  }

  return 'I am here to help with safety, GBV awareness, reporting steps, counseling, shelter options, and direct contact with the Vugandakumva team.';
}

function buildOfflineFallback(message, pageName) {
  const normalized = (message || '').toLowerCase();

  if (
    normalized.includes('danger') ||
    normalized.includes('emergency') ||
    normalized.includes('urgent') ||
    normalized.includes('right now')
  ) {
    return 'If someone is in immediate danger, call 112 right now. For GBV support in Rwanda, call 3512, and if speaking feels difficult you can use WhatsApp support at +250 781 640 246.';
  }

  if (normalized.includes('report') || normalized.includes('police') || normalized.includes('legal')) {
    return 'Start with safety first, then seek medical care if needed, call 3512 for guidance, and report to the nearest police station when it is safe. The Resources page also lists reporting and legal support options.';
  }

  if (pageName === 'contact.html') {
    return 'You can reach the team by WhatsApp at +250 781 640 246, by phone at +250 781 640 246 or +250 791 274 264, or by email at vugandakumvainitiative@gmail.com.';
  }

  return 'Live chat is temporarily unavailable, but support is still here. You can call 3512 for GBV help, call 112 in an emergency, use WhatsApp at +250 781 640 246, or open the Resources and Contact pages for direct guidance.';
}

function setStatus(shell, mode) {
  const status = shell.querySelector('.chatbot-status');
  const label = shell.querySelector('.chatbot-status__label');

  if (!status || !label) {
    return;
  }

  status.dataset.chatStatus = mode;

  if (mode === 'ai') {
    label.textContent = 'AI live';
    return;
  }

  if (mode === 'thinking') {
    label.textContent = 'Preparing reply';
    return;
  }

  if (mode === 'fallback') {
    label.textContent = 'Support mode';
    return;
  }

  label.textContent = 'Guided support';
}

function scrollMessages(container) {
  container.scrollTop = container.scrollHeight;
}

function formatMessage(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
