/**
 * Städhjälpen Väst – Auto-play chat demo (portfolio export)
 *
 * Fristående kopia av UI + demo-logik. Ingen backend krävs.
 * Bot-avatar: 🧹 | User-avatar: O
 *
 * Användning:
 *   <script src="./stadhjalpen-demo-widget.js"></script>
 */
(function () {
  'use strict';

  if (window.__STADHJALPEN_DEMO_LOADED__) return;
  window.__STADHJALPEN_DEMO_LOADED__ = true;

  const COMPANY_NAME = 'Städhjälpen Väst';
  const ACCENT = '#d97757';
  const BTN_ICON_CLOSE =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const BTN_ICON_OPEN = '🧹';

  document.documentElement.style.setProperty('--agy-primary', ACCENT);

  let demoPlayed = false;
  let demoRunning = false;
  let isOpen = false;

  // ── CSS ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #agy-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--agy-primary, #d97757);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      z-index: 99998;
      transition: transform 0.2s, box-shadow 0.2s;
      font-size: 26px;
      line-height: 1;
    }
    #agy-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,0,0,0.3);
    }
    #agy-widget-btn svg { pointer-events: none; }

    #agy-widget-window {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 360px;
      height: min(520px, 70vh);
      max-height: 520px;
      border-radius: 16px;
      background: #1E1E1C;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 8px 40px rgba(0,0,0,0.45);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      transform: scale(0.95) translateY(10px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    #agy-widget-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #agy-widget-header {
      background: var(--agy-primary, #d97757);
      color: #fff;
      padding: 14px 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      position: relative;
      z-index: 5;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    #agy-widget-header span {
      font-size: 13px;
      opacity: 0.85;
      font-weight: 400;
    }
    #agy-close-btn {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 18px;
      opacity: 0.8;
      padding: 0;
      line-height: 1;
    }
    #agy-messages {
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      z-index: 1;
      background: #1E1E1C;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.2) transparent;
    }
    #agy-messages::-webkit-scrollbar { width: 6px; }
    #agy-messages::-webkit-scrollbar-track { background: transparent; }
    #agy-messages::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 999px;
    }
    #agy-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.3);
    }
    .agy-msg {
      padding: 7px 11px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.4;
      width: max-content;
      max-width: min(92%, 280px);
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .agy-msg.user {
      background: rgba(217, 119, 87, 0.2);
      color: #FBFBF9;
      border: 1px solid rgba(217, 119, 87, 0.25);
      border-bottom-right-radius: 4px;
    }
    .agy-msg.bot {
      background: #1E1E1C;
      color: #FBFBF9;
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom-left-radius: 4px;
    }
    .agy-msg.bot.streaming { opacity: 0.85; }
    .agy-msg.bot.notice {
      background: #1E1E1C;
      color: #FBFBF9;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .agy-msg-row {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      max-width: 100%;
    }
    .agy-msg-row.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .agy-msg-row.bot { align-self: flex-start; }
    .agy-msg-row .agy-msg { max-width: min(92%, 280px); }
    .agy-avatar {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      line-height: 1;
      background: rgba(255,255,255,0.08);
      color: #FBFBF9;
      font-weight: 600;
      font-family: inherit;
    }
    #agy-input-area {
      display: flex;
      padding: 10px 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      gap: 8px;
      background: #1E1E1C;
      flex-shrink: 0;
      position: relative;
      z-index: 5;
    }
    .agy-typing {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-height: 1.2em;
      padding: 2px 0;
    }
    .agy-typing span {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(251,251,249,0.45);
      animation: agy-typing-bounce 1.2s infinite ease-in-out;
    }
    .agy-typing span:nth-child(2) { animation-delay: 0.15s; }
    .agy-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes agy-typing-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
      30% { transform: translateY(-4px); opacity: 1; }
    }
    #agy-input {
      flex: 1;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 7px 10px;
      font-size: 13px;
      outline: none;
      resize: none;
      line-height: 1.4;
      max-height: 80px;
      font-family: inherit;
      background: rgba(255,255,255,0.04);
      color: #FBFBF9;
    }
    #agy-input::placeholder { color: rgba(251,251,249,0.45); }
    #agy-input:focus { border-color: var(--agy-primary, #d97757); }
    #agy-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--agy-primary, #d97757);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      align-self: flex-end;
      transition: opacity 0.2s;
    }
    #agy-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #agy-send-btn svg { pointer-events: none; }
    .agy-booking-card {
      align-self: flex-start;
      width: min(100%, 260px);
      margin: 2px 0 2px 30px;
      padding: 12px;
      border-radius: 12px;
      background: #1E1E1C;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .agy-booking-card label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11px;
      color: rgba(251,251,249,0.7);
    }
    .agy-booking-card input,
    .agy-booking-card select {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #FBFBF9;
      padding: 7px 9px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
    }
    .agy-booking-card input:focus,
    .agy-booking-card select:focus {
      border-color: rgba(217,119,87,0.55);
    }
    .agy-booking-card select option {
      background: #1E1E1C;
      color: #FBFBF9;
    }
    .agy-booking-submit {
      margin-top: 4px;
      border: none;
      border-radius: 8px;
      background: #d97757;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 12px;
      cursor: pointer;
      font-family: inherit;
    }
    .agy-booking-submit:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    @media (max-width: 400px) {
      #agy-widget-window { width: calc(100vw - 24px); right: 12px; bottom: 80px; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'agy-widget-btn';
  btn.setAttribute('aria-label', 'Öppna chatt');
  btn.innerHTML = BTN_ICON_OPEN;

  const win = document.createElement('div');
  win.id = 'agy-widget-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', COMPANY_NAME + ' chatt');
  win.innerHTML =
    '<div id="agy-widget-header">' +
    '<div><div id="agy-company-name">' +
    COMPANY_NAME +
    '</div><span>AI Assistent • Online</span></div>' +
    '<button id="agy-close-btn" aria-label="Stäng chatt">✕</button>' +
    '</div>' +
    '<div id="agy-messages" role="log" aria-live="polite"></div>' +
    '<div id="agy-input-area">' +
    '<textarea id="agy-input" placeholder="Skriv ett meddelande..." rows="1"></textarea>' +
    '<button id="agy-send-btn" aria-label="Skicka">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
    '</button></div>';

  document.body.appendChild(btn);
  document.body.appendChild(win);

  const messagesEl = document.getElementById('agy-messages');
  const inputEl = document.getElementById('agy-input');
  const sendBtn = document.getElementById('agy-send-btn');

  // ── Helpers ───────────────────────────────────────────────────────────────
  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function wrapMessageRow(role, bubbleEl) {
    const row = document.createElement('div');
    row.className = 'agy-msg-row ' + role;
    const avatar = document.createElement('span');
    avatar.className = 'agy-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? 'O' : '🧹';
    row.appendChild(avatar);
    row.appendChild(bubbleEl);
    messagesEl.appendChild(row);
    return bubbleEl;
  }

  function appendMessage(role, text) {
    const el = document.createElement('div');
    el.className = 'agy-msg ' + role;
    el.textContent = text;
    wrapMessageRow(role, el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function showTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'agy-msg bot streaming';
    el.setAttribute('aria-label', 'Skriver');
    el.innerHTML = '<div class="agy-typing"><span></span><span></span><span></span></div>';
    wrapMessageRow('bot', el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function abortDemoIfClosed(typingEl) {
    if (isOpen) return false;
    if (typingEl && typingEl.parentNode) {
      const row = typingEl.parentNode.classList.contains('agy-msg-row')
        ? typingEl.parentNode
        : typingEl;
      if (row.parentNode) row.parentNode.removeChild(row);
    }
    if (inputEl) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
      inputEl.disabled = false;
    }
    demoRunning = false;
    sendBtn.disabled = false;
    return true;
  }

  async function typeText(el, text, msPerChar) {
    el.textContent = '';
    for (let i = 0; i < text.length; i++) {
      if (!isOpen) return false;
      el.textContent += text.charAt(i);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      await sleep(msPerChar);
    }
    return true;
  }

  async function demoVisitorMessage(text, pauseAfterMs) {
    if (abortDemoIfClosed()) return false;
    inputEl.disabled = false;
    inputEl.value = '';
    inputEl.focus();

    for (let i = 0; i < text.length; i++) {
      if (!isOpen) {
        abortDemoIfClosed();
        return false;
      }
      inputEl.value = text.slice(0, i + 1);
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
      await sleep(28 + Math.floor(Math.random() * 22));
    }

    await sleep(350);
    if (abortDemoIfClosed()) return false;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    inputEl.disabled = true;
    appendMessage('user', text);

    if (pauseAfterMs) {
      await sleep(pauseAfterMs);
      if (abortDemoIfClosed()) return false;
    }
    return true;
  }

  async function demoBotReply(text, typingMs, pauseAfterMs) {
    const typingEl = showTypingIndicator();
    await sleep(typingMs);
    if (abortDemoIfClosed(typingEl)) return false;

    typingEl.classList.remove('streaming');
    typingEl.removeAttribute('aria-label');
    if (!(await typeText(typingEl, text, 22))) {
      abortDemoIfClosed(typingEl);
      return false;
    }

    if (pauseAfterMs) {
      await sleep(pauseAfterMs);
      if (abortDemoIfClosed()) return false;
    }
    return true;
  }

  async function typeIntoField(field, text, msPerChar) {
    field.value = '';
    field.focus();
    for (let i = 0; i < text.length; i++) {
      if (!isOpen) return false;
      field.value = text.slice(0, i + 1);
      await sleep(msPerChar);
    }
    return true;
  }

  function appendBookingForm() {
    const card = document.createElement('form');
    card.className = 'agy-booking-card';
    card.setAttribute('autocomplete', 'off');
    card.innerHTML =
      '<label>Förnamn<input type="text" name="firstName" /></label>' +
      '<label>Efternamn<input type="text" name="lastName" /></label>' +
      '<label>E-post<input type="email" name="email" /></label>' +
      '<label>Önskad tid<select name="slot">' +
      '<option value="">Välj tid</option>' +
      '<option value="09:00">Fredag 09:00</option>' +
      '<option value="13:00">Fredag 13:00</option>' +
      '</select></label>' +
      '<button type="submit" class="agy-booking-submit">Skicka förfrågan</button>';
    messagesEl.appendChild(card);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return card;
  }

  async function simulateBookingForm(form) {
    const first = form.querySelector('input[name="firstName"]');
    const last = form.querySelector('input[name="lastName"]');
    const email = form.querySelector('input[name="email"]');
    const slot = form.querySelector('select[name="slot"]');
    const submit = form.querySelector('.agy-booking-submit');

    if (!(await typeIntoField(first, 'Anna', 45))) return false;
    await sleep(250);
    if (abortDemoIfClosed()) return false;

    if (!(await typeIntoField(last, 'Andersson', 40))) return false;
    await sleep(250);
    if (abortDemoIfClosed()) return false;

    if (!(await typeIntoField(email, 'anna@email.com', 28))) return false;
    await sleep(300);
    if (abortDemoIfClosed()) return false;

    slot.value = '09:00';
    slot.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(500);
    if (abortDemoIfClosed()) return false;

    submit.focus();
    await sleep(400);
    if (abortDemoIfClosed()) return false;

    submit.disabled = true;
    submit.textContent = 'Skickar…';
    await sleep(700);
    if (abortDemoIfClosed()) return false;

    submit.textContent = 'Skickat';
    Array.prototype.forEach.call(form.querySelectorAll('input, select, button'), function (el) {
      el.disabled = true;
    });
    return true;
  }

  async function playDemo() {
    if (demoPlayed || demoRunning) return;
    demoRunning = true;
    sendBtn.disabled = true;
    if (inputEl) inputEl.disabled = true;

    messagesEl.innerHTML = '';

    appendMessage('bot', 'Hej! Hur kan jag hjälpa dig idag?');
    await sleep(500);
    if (abortDemoIfClosed()) return;

    if (
      !(await demoVisitorMessage(
        'Hej! Har ni ledig tid för hemstädning i Göteborg på fredag?',
        700
      ))
    )
      return;

    if (
      !(await demoBotReply(
        'Hej! Vad vill du ha hjälp med? Info, offert eller boka tid?',
        1100,
        800
      ))
    )
      return;

    if (!(await demoVisitorMessage('Jag vill boka tid', 700))) return;

    if (!(await demoBotReply('Okej, jag kollar vilka tider som är lediga.', 1100, 600))) return;

    const searching = showTypingIndicator();
    await sleep(1400);
    if (abortDemoIfClosed(searching)) return;
    if (searching.parentNode) {
      const row = searching.parentNode.classList.contains('agy-msg-row')
        ? searching.parentNode
        : searching;
      if (row.parentNode) row.parentNode.removeChild(row);
    }

    if (
      !(await demoBotReply(
        'Lediga tider på fredag: 09:00 och 13:00. Fyll i formuläret så skickar vi din förfrågan.',
        900,
        500
      ))
    )
      return;

    const form = appendBookingForm();
    await sleep(400);
    if (abortDemoIfClosed()) return;

    if (!(await simulateBookingForm(form))) return;

    if (
      !(await demoBotReply(
        'Tack! Din bokningsförfrågan är skickad. Vi återkommer snart.',
        1000,
        0
      ))
    )
      return;

    demoPlayed = true;
    demoRunning = false;
    sendBtn.disabled = false;
    if (inputEl) {
      inputEl.disabled = false;
      inputEl.focus();
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    btn.innerHTML = isOpen ? BTN_ICON_CLOSE : BTN_ICON_OPEN;
    if (isOpen) {
      if (!demoPlayed) {
        playDemo();
      } else {
        inputEl.focus();
      }
    }
  }

  btn.addEventListener('click', toggleChat);
  document.getElementById('agy-close-btn').addEventListener('click', toggleChat);

  // Efter demot: enkel offline-respons (ingen backend)
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || sendBtn.disabled || demoRunning) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    appendMessage('user', text);

    const botEl = showTypingIndicator();
    await sleep(900);
    botEl.classList.remove('streaming');
    botEl.removeAttribute('aria-label');
    botEl.textContent =
      'Detta är en portfolio-demo. I den skarpa produkten svarar AI:n live och skickar bokningsförfrågan vidare.';
    botEl.classList.add('notice');
    messagesEl.scrollTop = messagesEl.scrollHeight;

    sendBtn.disabled = false;
    inputEl.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  inputEl.addEventListener('input', function () {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
  });
})();
