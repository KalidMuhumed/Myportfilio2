"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { BroomIcon, CloseIcon, SendIcon } from "@/chat-widget/icons";
import { getTenant } from "@/chat-widget/tenants";
import type { ChatRole, TenantId } from "@/chat-widget/types";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  streaming?: boolean;
};

type ChatWidgetProps = {
  /** Multi-tenant: only pass tenants that exist. Demo uses stadhjalpen. */
  tenantId?: TenantId;
  /** Start open so the projects demo is visible immediately */
  defaultOpen?: boolean;
  className?: string;
};

async function wait(ms: number, signal: { cancelled: boolean }) {
  const step = 40;
  let left = ms;
  while (left > 0) {
    if (signal.cancelled) return;
    const chunk = Math.min(step, left);
    await new Promise<void>((r) => setTimeout(r, chunk));
    left -= chunk;
  }
}

function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full opacity-40"
          style={{
            backgroundColor: color,
            animation: `chat-dot 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function ChatWidget({
  tenantId = "stadhjalpen",
  defaultOpen = true,
  className = "",
}: ChatWidgetProps) {
  const tenant = getTenant(tenantId);
  const { theme } = tenant;

  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiTyping, inputValue, scrollToBottom]);

  // One effect = one autoplay run. Cleanup cancels (needed for React Strict Mode).
  useEffect(() => {
    if (!open) return;

    const signal = { cancelled: false };
    const script = tenant.autoPlayScript;

    const run = async () => {
      setMessages([]);
      setInputValue("");
      setAiTyping(false);

      await wait(450, signal);
      if (signal.cancelled) return;

      for (const turn of script) {
        if (signal.cancelled) return;

        if (turn.role === "visitor") {
          setInputValue("");
          await wait(320, signal);
          if (signal.cancelled) return;

          for (let i = 1; i <= turn.text.length; i++) {
            if (signal.cancelled) return;
            setInputValue(turn.text.slice(0, i));
            await wait(26 + Math.random() * 20, signal);
          }
          await wait(260, signal);
          if (signal.cancelled) return;

          setMessages((prev) => [
            ...prev,
            {
              id: `visitor-${Date.now()}-${Math.random()}`,
              role: "visitor",
              text: turn.text,
            },
          ]);
          setInputValue("");
          await wait(500, signal);
        } else {
          setAiTyping(true);
          await wait(650 + Math.random() * 300, signal);
          if (signal.cancelled) return;
          setAiTyping(false);

          const id = `ai-${Date.now()}-${Math.random()}`;
          setMessages((prev) => [
            ...prev,
            { id, role: "ai", text: "", streaming: true },
          ]);

          for (let i = 1; i <= turn.text.length; i++) {
            if (signal.cancelled) return;
            const slice = turn.text.slice(0, i);
            setMessages((prev) =>
              prev.map((m) => (m.id === id ? { ...m, text: slice } : m)),
            );
            await wait(16 + Math.random() * 14, signal);
          }

          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
          );
          await wait(450, signal);
        }
      }
    };

    void run();

    return () => {
      signal.cancelled = true;
    };
  }, [open, tenant.autoPlayScript]);

  const cssVars = {
    "--cw-bg": theme.chatBg,
    "--cw-text": theme.messageText,
    "--cw-accent": theme.accent,
    "--cw-input-border": theme.inputBorder,
    "--cw-visitor": theme.visitorBubble,
    "--cw-ai": theme.aiBubble,
    "--cw-ai-border": theme.aiBubbleBorder,
  } as CSSProperties;

  return (
    <div
      className={`relative flex h-full min-h-[520px] w-full flex-col items-end justify-end ${className}`}
      style={cssVars}
      data-tenant={tenant.id}
    >
      <style>{`
        @keyframes chat-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>

      {open ? (
        <div
          className="flex h-[min(560px,70vh)] w-full max-w-[380px] flex-col overflow-hidden rounded-[16px] shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
          style={{ backgroundColor: "var(--cw-bg)" }}
          role="dialog"
          aria-label={`${tenant.brandName} chat`}
        >
          <div
            className="flex shrink-0 items-start justify-between px-4 py-3.5"
            style={{ backgroundColor: "var(--cw-accent)" }}
          >
            <div>
              <p className="text-[15px] font-semibold leading-tight text-white">
                {tenant.brandName}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-white/90">
                {tenant.statusLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-white/90 transition-opacity hover:opacity-80"
              aria-label="Stäng chat"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
            style={{ color: "var(--cw-text)" }}
          >
            {messages.map((msg) =>
              msg.role === "ai" ? (
                <div key={msg.id} className="flex items-end gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#2a2420",
                      border: "1px solid var(--cw-ai-border)",
                    }}
                  >
                    <BroomIcon size={16} />
                  </div>
                  <div
                    className="max-w-[78%] rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                    style={{
                      backgroundColor: "var(--cw-ai)",
                      border: "1px solid var(--cw-ai-border)",
                      color: "var(--cw-text)",
                    }}
                  >
                    {msg.text}
                    {msg.streaming ? (
                      <span className="ml-0.5 inline-block animate-pulse opacity-70">
                        |
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex items-end justify-end gap-2">
                  <div
                    className="max-w-[78%] rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                    style={{
                      backgroundColor: "var(--cw-visitor)",
                      color: "var(--cw-text)",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold lowercase"
                    style={{
                      backgroundColor: "#3a322e",
                      color: "var(--cw-text)",
                      border: "1px solid var(--cw-input-border)",
                    }}
                  >
                    {tenant.visitorInitial}
                  </div>
                </div>
              ),
            )}

            {aiTyping ? (
              <div className="flex items-end gap-2">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#2a2420",
                    border: "1px solid var(--cw-ai-border)",
                  }}
                >
                  <BroomIcon size={16} />
                </div>
                <div
                  className="rounded-[14px] px-3.5 py-3"
                  style={{
                    backgroundColor: "var(--cw-ai)",
                    border: "1px solid var(--cw-ai-border)",
                  }}
                >
                  <TypingDots color={theme.messageText} />
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="flex shrink-0 items-center gap-2 border-t px-3 py-3"
            style={{ borderColor: "var(--cw-input-border)" }}
          >
            <input
              type="text"
              readOnly
              value={inputValue}
              placeholder={tenant.inputPlaceholder}
              aria-label={tenant.inputPlaceholder}
              className="h-11 flex-1 rounded-[12px] bg-transparent px-3.5 text-[13.5px] outline-none placeholder:text-white/35"
              style={{
                color: "var(--cw-text)",
                border: "1px solid var(--cw-input-border)",
              }}
            />
            <button
              type="button"
              disabled
              aria-label="Skicka"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-white opacity-95"
              style={{ backgroundColor: "var(--cw-accent)" }}
            >
              <SendIcon size={17} />
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(217,119,87,0.35)] transition-transform hover:scale-[1.03]"
        style={{ backgroundColor: "var(--cw-accent)" }}
        aria-label={open ? "Stäng chat" : "Öppna chat"}
      >
        {open ? <CloseIcon size={22} /> : <BroomIcon size={26} />}
      </button>
    </div>
  );
}
