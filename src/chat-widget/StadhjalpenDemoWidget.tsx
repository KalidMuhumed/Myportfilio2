"use client";

/**
 * Portfolio embed: scripted Städhjälpen demo.
 *
 * Autoplay:
 * - `autoStart="visible"` (default): on mount/refresh the demo waits until the
 *   widget is actually in the viewport, then plays. Visitors never miss the start.
 * - `autoStart="immediate"`: plays right away (used when Live Demo restarts it).
 *
 * Live Demo remounts this component via a changed `key` (no page reload).
 */

import { useEffect, useRef, useState } from "react";

type AutoStart = "visible" | "immediate";

const COMPANY_NAME = "Städhjälpen Väst";
const ACCENT = "#d97757";

const SEND_ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

type Msg =
  | {
      id: string;
      kind: "text";
      role: "user" | "bot";
      text: string;
      streaming?: boolean;
      notice?: boolean;
    }
  | { id: string; kind: "typing" }
  | {
      id: string;
      kind: "form";
      firstName: string;
      lastName: string;
      email: string;
      slot: string;
      submitLabel: string;
      disabled: boolean;
    };

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const GREETING_TEXT = "Hej! Hur kan jag hjälpa dig idag?";

export function StadhjalpenDemoWidget({
  autoStart = "visible",
}: {
  autoStart?: AutoStart;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "greeting", kind: "text", role: "bot", text: GREETING_TEXT },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true);
  const [sendDisabled, setSendDisabled] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, inputValue]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [inputValue]);

  // ONE path: mount → (wait until visible) → wait 300ms (Strict Mode) → full demo
  useEffect(() => {
    let cancelled = false;
    const stop = () => cancelled;

    runningRef.current = true;
    setSendDisabled(true);
    setInputDisabled(true);
    setInputValue("");
    setMessages([
      {
        id: `bot-${Date.now()}`,
        kind: "text",
        role: "bot",
        text: GREETING_TEXT,
      },
    ]);

    const run = async () => {
      await sleep(500);
      if (stop()) return;

      const visitorType = async (text: string, pauseAfterMs: number) => {
        setInputDisabled(false);
        setInputValue("");
        for (let i = 0; i < text.length; i++) {
          if (stop()) return false;
          setInputValue(text.slice(0, i + 1));
          await sleep(28 + Math.floor(Math.random() * 22));
        }
        await sleep(350);
        if (stop()) return false;
        setInputValue("");
        setInputDisabled(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${Date.now()}-${Math.random()}`,
            kind: "text",
            role: "user",
            text,
          },
        ]);
        if (pauseAfterMs) {
          await sleep(pauseAfterMs);
          if (stop()) return false;
        }
        return true;
      };

      const botReply = async (
        text: string,
        typingMs: number,
        pauseAfterMs: number,
      ) => {
        const typingId = `typing-${Date.now()}`;
        setMessages((prev) => [...prev, { id: typingId, kind: "typing" }]);
        await sleep(typingMs);
        if (stop()) return false;

        const msgId = `bot-${Date.now()}-${Math.random()}`;
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== typingId),
          {
            id: msgId,
            kind: "text",
            role: "bot",
            text: "",
            streaming: true,
          },
        ]);

        for (let i = 0; i < text.length; i++) {
          if (stop()) return false;
          const slice = text.slice(0, i + 1);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId && m.kind === "text" ? { ...m, text: slice } : m,
            ),
          );
          await sleep(22);
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId && m.kind === "text"
              ? { ...m, streaming: false }
              : m,
          ),
        );
        if (pauseAfterMs) {
          await sleep(pauseAfterMs);
          if (stop()) return false;
        }
        return true;
      };

      if (
        !(await visitorType(
          "Har ni ledig tid för hemstädning i Göteborg på fredag?",
          700,
        ))
      ) {
        return;
      }

      if (
        !(await botReply(
          "Absolut! Vad vill du ha hjälp med? Info, offert eller boka tid?",
          1100,
          800,
        ))
      ) {
        return;
      }

      if (!(await visitorType("Jag vill boka tid", 700))) return;

      if (
        !(await botReply(
          "Okej, jag kollar vilka tider som är lediga.",
          1100,
          600,
        ))
      ) {
        return;
      }

      // "Searching available slots" (typing dots)
      const searchId = `search-${Date.now()}`;
      setMessages((prev) => [...prev, { id: searchId, kind: "typing" }]);
      await sleep(2000);
      if (stop()) return;
      setMessages((prev) => prev.filter((m) => m.id !== searchId));

      if (
        !(await botReply(
          "Lediga tider på fredag: 09:00 och 13:00. Fyll i formuläret så skickar vi din förfrågan.",
          3000,
          600, // short beat so the visitor starts reading
        ))
      ) {
        return;
      }

      // "Fetching the form" (typing dots while the visitor finishes reading)
      const fetchFormId = `fetch-form-${Date.now()}`;
      setMessages((prev) => [...prev, { id: fetchFormId, kind: "typing" }]);
      await sleep(4400);
      if (stop()) return;
      setMessages((prev) => prev.filter((m) => m.id !== fetchFormId));

      const formId = `form-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: formId,
          kind: "form",
          firstName: "",
          lastName: "",
          email: "",
          slot: "",
          submitLabel: "Skicka förfrågan",
          disabled: false,
        },
      ]);
      await sleep(400);
      if (stop()) return;

      const typeField = async (
        key: "firstName" | "lastName" | "email",
        text: string,
        ms: number,
      ) => {
        for (let i = 0; i < text.length; i++) {
          if (stop()) return false;
          const slice = text.slice(0, i + 1);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === formId && m.kind === "form" ? { ...m, [key]: slice } : m,
            ),
          );
          await sleep(ms);
        }
        return true;
      };

      if (!(await typeField("firstName", "Anna", 45))) return;
      await sleep(250);
      if (stop()) return;
      if (!(await typeField("lastName", "Andersson", 40))) return;
      await sleep(250);
      if (stop()) return;
      if (!(await typeField("email", "anna@email.com", 28))) return;
      await sleep(300);
      if (stop()) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === formId && m.kind === "form" ? { ...m, slot: "09:00" } : m,
        ),
      );
      await sleep(500);
      if (stop()) return;
      await sleep(400);
      if (stop()) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === formId && m.kind === "form"
            ? { ...m, submitLabel: "Skickar…" }
            : m,
        ),
      );
      await sleep(700);
      if (stop()) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === formId && m.kind === "form"
            ? { ...m, submitLabel: "Skickat", disabled: true }
            : m,
        ),
      );

      if (
        !(await botReply(
          "Tack! Din bokningsförfrågan är skickad. Vi återkommer snart.",
          1000,
          0,
        ))
      ) {
        return;
      }

      if (stop()) return;
      runningRef.current = false;
      setSendDisabled(false);
      setInputDisabled(false);
    };

    // Survive React Strict Mode double-mount
    let startId: number | undefined;
    let observer: IntersectionObserver | undefined;

    const schedule = () => {
      if (startId !== undefined || stop()) return;
      startId = window.setTimeout(() => {
        if (!stop()) void run();
      }, 300);
    };

    const el = rootRef.current;
    if (
      autoStart === "immediate" ||
      !el ||
      typeof IntersectionObserver === "undefined"
    ) {
      schedule();
    } else {
      // On refresh: don't play to an empty room; wait until the widget is on screen.
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect();
            observer = undefined;
            schedule();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(el);
    }

    return () => {
      cancelled = true;
      if (startId !== undefined) window.clearTimeout(startId);
      observer?.disconnect();
      runningRef.current = false;
    };
  }, [autoStart]);

  const sendManual = async () => {
    const text = inputValue.trim();
    if (!text || sendDisabled || runningRef.current) return;
    setInputValue("");
    setSendDisabled(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        kind: "text",
        role: "user",
        text,
      },
    ]);
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [...prev, { id: typingId, kind: "typing" }]);
    await sleep(900);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== typingId),
      {
        id: `bot-${Date.now()}`,
        kind: "text",
        role: "bot",
        notice: true,
        text: "Detta är en portfolio-demo. I den skarpa produkten svarar AI:n live och skickar bokningsförfrågan vidare.",
      },
    ]);
    setSendDisabled(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="agy-embed relative h-full min-h-[560px] w-full font-sans">
      <style>{`
        .agy-embed { --agy-primary: ${ACCENT}; }
        .agy-embed .agy-window {
          position: absolute; top: 16px; bottom: 16px; left: 50%;
          width: min(360px, calc(100% - 32px));
          max-width: 360px;
          transform: translateX(-50%);
          border-radius: 16px; background: #1E1E1C;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45);
          display: flex; flex-direction: column; z-index: 1; overflow: hidden;
          font-family: inherit;
          font-size: 13px;
        }
        .agy-embed .agy-header {
          background: var(--agy-primary); color: #fff; padding: 14px 16px;
          font-weight: 600; display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .agy-embed .agy-header span { font-size: 12px; opacity: 0.85; font-weight: 400; }
        .agy-embed .agy-messages {
          flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto;
          padding: 16px; display: flex; flex-direction: column; gap: 10px;
          background: #1E1E1C; scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        .agy-embed .agy-msg {
          padding: 7px 11px; border-radius: 12px; font-size: 12px; line-height: 1.4;
          width: max-content; max-width: min(92%, 280px); white-space: normal;
          overflow-wrap: anywhere; word-break: break-word;
        }
        .agy-embed .agy-msg.user {
          background: rgba(217, 119, 87, 0.2); color: #FBFBF9;
          border: 1px solid rgba(217, 119, 87, 0.25); border-bottom-right-radius: 4px;
        }
        .agy-embed .agy-msg.bot {
          background: #1E1E1C; color: #FBFBF9;
          border: 1px solid rgba(255,255,255,0.1); border-bottom-left-radius: 4px;
        }
        .agy-embed .agy-msg.bot.streaming { opacity: 0.85; }
        .agy-embed .agy-msg.bot.notice {
          background: #1E1E1C; color: #FBFBF9; border: 1px solid rgba(255,255,255,0.1);
        }
        .agy-embed .agy-msg-row {
          display: flex; align-items: flex-end; gap: 6px; max-width: 100%;
        }
        .agy-embed .agy-msg-row.user { align-self: flex-end; flex-direction: row-reverse; }
        .agy-embed .agy-msg-row.bot { align-self: flex-start; }
        .agy-embed .agy-avatar {
          flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; line-height: 1; background: rgba(255,255,255,0.08);
          color: #FBFBF9; font-weight: 600;
        }
        .agy-embed .agy-input-area {
          display: flex; padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.08);
          gap: 8px; background: #1E1E1C; flex-shrink: 0;
        }
        .agy-embed .agy-typing {
          display: inline-flex; align-items: center; gap: 4px; min-height: 1.2em; padding: 2px 0;
        }
        .agy-embed .agy-typing span {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(251,251,249,0.45);
          animation: agy-typing-bounce 1.2s infinite ease-in-out;
        }
        .agy-embed .agy-typing span:nth-child(2) { animation-delay: 0.15s; }
        .agy-embed .agy-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes agy-typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .agy-embed .agy-input {
          flex: 1; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
          padding: 7px 10px; font-size: 12px; outline: none; resize: none;
          line-height: 1.4; min-height: 38px; max-height: 140px;
          overflow-y: hidden; font-family: inherit;
          background: rgba(255,255,255,0.04); color: #FBFBF9;
          box-sizing: border-box;
        }
        .agy-embed .agy-input::placeholder { color: rgba(251,251,249,0.45); }
        .agy-embed .agy-input:focus { border-color: var(--agy-primary); }
        .agy-embed .agy-send {
          width: 38px; height: 38px; border-radius: 10px; background: var(--agy-primary);
          border: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; align-self: flex-end;
        }
        .agy-embed .agy-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .agy-embed .agy-booking-card {
          align-self: center; width: min(100%, 280px); margin: 2px auto;
          box-sizing: border-box; padding: 12px; border-radius: 12px; background: #1E1E1C;
          border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 8px;
        }
        .agy-embed .agy-booking-card label {
          display: flex; flex-direction: column; gap: 4px; font-size: 10px;
          color: rgba(251,251,249,0.7);
        }
        .agy-embed .agy-booking-card input,
        .agy-embed .agy-booking-card select {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #FBFBF9; padding: 7px 9px; font-size: 12px;
          font-family: inherit; outline: none; width: 100%;
        }
        .agy-embed .agy-booking-submit {
          margin-top: 4px; border: none; border-radius: 8px; background: #d97757;
          color: #fff; font-size: 12px; font-weight: 600; padding: 8px 12px;
          font-family: inherit; cursor: default;
        }
        .agy-embed .agy-booking-submit:disabled { opacity: 0.55; }
        .agy-embed .agy-window input,
        .agy-embed .agy-window textarea,
        .agy-embed .agy-window select,
        .agy-embed .agy-window button,
        .agy-embed .agy-window label {
          font-family: inherit;
        }
      `}</style>

      <div className="agy-window" role="dialog" aria-label={`${COMPANY_NAME} chatt`}>
        <div className="agy-header">
          <div>
            <div>{COMPANY_NAME}</div>
            <span>AI Assistent • Online</span>
          </div>
        </div>

        <div ref={messagesRef} className="agy-messages" role="log" aria-live="polite">
          {messages.map((msg) => {
            if (msg.kind === "typing") {
              return (
                <div key={msg.id} className="agy-msg-row bot">
                  <span className="agy-avatar" aria-hidden>
                    🧹
                  </span>
                  <div className="agy-msg bot streaming" aria-label="Skriver">
                    <div className="agy-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              );
            }
            if (msg.kind === "form") {
              return (
                <form
                  key={msg.id}
                  className="agy-booking-card"
                  autoComplete="off"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label>
                    Förnamn
                    <input
                      type="text"
                      value={msg.firstName}
                      readOnly
                      disabled={msg.disabled}
                    />
                  </label>
                  <label>
                    Efternamn
                    <input
                      type="text"
                      value={msg.lastName}
                      readOnly
                      disabled={msg.disabled}
                    />
                  </label>
                  <label>
                    E-post
                    <input
                      type="email"
                      value={msg.email}
                      readOnly
                      disabled={msg.disabled}
                    />
                  </label>
                  <label>
                    Önskad tid
                    <select
                      value={msg.slot}
                      disabled={msg.disabled}
                      onChange={() => undefined}
                    >
                      <option value="">Välj tid</option>
                      <option value="09:00">Fredag 09:00</option>
                      <option value="13:00">Fredag 13:00</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="agy-booking-submit"
                    disabled={
                      msg.disabled || msg.submitLabel !== "Skicka förfrågan"
                    }
                  >
                    {msg.submitLabel}
                  </button>
                </form>
              );
            }
            return (
              <div key={msg.id} className={`agy-msg-row ${msg.role}`}>
                <span className="agy-avatar" aria-hidden>
                  {msg.role === "user" ? "O" : "🧹"}
                </span>
                <div
                  className={`agy-msg ${msg.role}${msg.streaming ? " streaming" : ""}${msg.notice ? " notice" : ""}`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="agy-input-area">
          <textarea
            ref={inputRef}
            className="agy-input"
            placeholder="Skriv ett meddelande..."
            rows={1}
            value={inputValue}
            disabled={inputDisabled}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendManual();
              }
            }}
          />
          <button
            type="button"
            className="agy-send"
            aria-label="Skicka"
            disabled={sendDisabled}
            onClick={() => void sendManual()}
          >
            {SEND_ICON}
          </button>
        </div>
      </div>
    </div>
  );
}
