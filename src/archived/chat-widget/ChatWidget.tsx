"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ChevronDownIcon, CloseIcon, SendIcon } from "@/chat-widget/icons";
import { getTenant } from "@/chat-widget/tenants";
import type { TenantId } from "@/chat-widget/types";

type ChatMessage = {
  id: string;
  role: "visitor" | "ai";
  text: string;
  streaming?: boolean;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  slot: string;
  submitLabel: string;
  submittedLabel: string;
  phase: "empty" | "filling" | "ready" | "sent";
};

type ChatWidgetProps = {
  tenantId?: TenantId;
  className?: string;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex h-[18px] items-center gap-1.5 px-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-[6px] w-[6px] rounded-full"
          style={{
            backgroundColor: color,
            animation: `chat-dot 1.05s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AiAvatar({ emoji }: { emoji: string }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] leading-none"
      style={{
        backgroundColor: "#2a2420",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
      }}
      aria-hidden
    >
      <span className="select-none">{emoji}</span>
    </div>
  );
}

function VisitorAvatar({ initial }: { initial: string }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-medium lowercase leading-none"
      style={{
        backgroundColor: "#2e2a28",
        color: "#FBFBF9",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function BookingForm({ form }: { form: FormState }) {
  const field = (
    label: string,
    value: string,
    kind: "text" | "select" = "text",
  ) => (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium tracking-wide text-white/55">
        {label}
      </span>
      <div
        className="flex h-10 items-center justify-between rounded-[10px] px-3 text-[13px]"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "rgba(255,255,255,0.03)",
          color: "#FBFBF9",
        }}
      >
        <span>{value || "\u00A0"}</span>
        {kind === "select" ? (
          <span className="text-white/45">
            <ChevronDownIcon />
          </span>
        ) : null}
      </div>
    </label>
  );

  return (
    <div
      className="ml-10 max-w-[92%] rounded-[14px] p-3.5"
      style={{
        backgroundColor: "#151514",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div className="space-y-2.5">
        {field("Förnamn", form.firstName)}
        {field("Efternamn", form.lastName)}
        {field("E-post", form.email)}
        {field("Önskad tid", form.slot, "select")}
      </div>
      <div
        className="mt-3.5 flex h-10 items-center justify-center rounded-[10px] text-[13px] font-semibold text-white"
        style={{ backgroundColor: "#d97757" }}
      >
        {form.phase === "sent" ? form.submittedLabel : form.submitLabel}
      </div>
    </div>
  );
}

export function ChatWidget({
  tenantId = "stadhjalpen",
  className = "",
}: ChatWidgetProps) {
  const tenant = getTenant(tenantId);
  const { theme } = tenant;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiTyping, inputValue, form, scrollToBottom]);

  useEffect(() => {
    cancelledRef.current = false;
    let loopId = 0;

    const typeIntoInput = async (text: string) => {
      setInputValue("");
      await sleep(280);
      for (let i = 1; i <= text.length; i++) {
        if (cancelledRef.current) return;
        setInputValue(text.slice(0, i));
        await sleep(24 + Math.random() * 18);
      }
      await sleep(220);
    };

    const streamAi = async (id: string, text: string) => {
      for (let i = 1; i <= text.length; i++) {
        if (cancelledRef.current) return;
        const slice = text.slice(0, i);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, text: slice } : m)),
        );
        await sleep(16 + Math.random() * 14);
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
      );
    };

    const runLoop = async () => {
      while (!cancelledRef.current) {
        loopId += 1;
        setMessages([]);
        setInputValue("");
        setAiTyping(false);
        setForm(null);

        await sleep(500);
        if (cancelledRef.current) return;

        for (const turn of tenant.autoPlayScript) {
          if (cancelledRef.current) return;

          if (turn.role === "visitor") {
            await typeIntoInput(turn.text);
            if (cancelledRef.current) return;
            setMessages((prev) => [
              ...prev,
              {
                id: `v-${loopId}-${Date.now()}`,
                role: "visitor",
                text: turn.text,
              },
            ]);
            setInputValue("");
            await sleep(420);
          } else if (turn.role === "ai") {
            setAiTyping(true);
            await sleep(600 + Math.random() * 280);
            if (cancelledRef.current) return;
            setAiTyping(false);

            const id = `a-${loopId}-${Date.now()}`;
            setMessages((prev) => [
              ...prev,
              { id, role: "ai", text: "", streaming: true },
            ]);
            await streamAi(id, turn.text);
            await sleep(380);
          } else if (turn.role === "form") {
            // Reveal empty form, then type each field, then mark sent
            setForm({
              firstName: "",
              lastName: "",
              email: "",
              slot: "",
              submitLabel: turn.submitLabel,
              submittedLabel: turn.submittedLabel,
              phase: "empty",
            });
            await sleep(350);
            if (cancelledRef.current) return;

            setForm((f) =>
              f
                ? { ...f, phase: "filling", firstName: turn.fields.firstName }
                : f,
            );
            await sleep(320);
            setForm((f) =>
              f ? { ...f, lastName: turn.fields.lastName } : f,
            );
            await sleep(300);
            setForm((f) => (f ? { ...f, email: turn.fields.email } : f));
            await sleep(300);
            setForm((f) =>
              f
                ? { ...f, slot: turn.fields.slot, phase: "ready" }
                : f,
            );
            await sleep(500);
            setForm((f) => (f ? { ...f, phase: "sent" } : f));
            await sleep(700);
          }
        }

        await sleep(2400);
      }
    };

    void runLoop();
    return () => {
      cancelledRef.current = true;
    };
  }, [tenant.autoPlayScript]);

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
      className={`relative flex w-full flex-col items-center ${className}`}
      style={cssVars}
      data-tenant={tenant.id}
    >
      <style>{`
        @keyframes chat-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div
        className="flex h-[560px] w-full max-w-[372px] flex-col overflow-hidden rounded-[18px] shadow-[0_22px_55px_rgba(0,0,0,0.5)]"
        style={{ backgroundColor: "var(--cw-bg)" }}
        role="region"
        aria-label={`${tenant.brandName} chat demo`}
        aria-live="polite"
      >
        {/* Header — matches original screenshots */}
        <div
          className="flex shrink-0 items-start justify-between px-4 pb-3.5 pt-3.5"
          style={{ backgroundColor: "var(--cw-accent)" }}
        >
          <div>
            <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-white">
              {tenant.brandName}
            </p>
            <p className="mt-0.5 text-[12px] font-medium text-white/92">
              {tenant.statusLabel}
            </p>
          </div>
          <span className="mt-0.5 text-white/90" aria-hidden>
            <CloseIcon size={18} />
          </span>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-4 [scrollbar-width:thin]"
          style={{ color: "var(--cw-text)" }}
        >
          {messages.map((msg) =>
            msg.role === "ai" ? (
              <div key={msg.id} className="flex items-end gap-2">
                <AiAvatar emoji={tenant.aiEmoji} />
                <div
                  className="max-w-[78%] rounded-[16px] rounded-bl-md px-3.5 py-2.5 text-[13.5px] leading-[1.45]"
                  style={{
                    backgroundColor: "var(--cw-ai)",
                    border: "1px solid var(--cw-ai-border)",
                    color: "var(--cw-text)",
                  }}
                >
                  {msg.text}
                  {msg.streaming ? (
                    <span className="ml-0.5 inline-block opacity-55">▍</span>
                  ) : null}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex items-end justify-end gap-2">
                <div
                  className="max-w-[78%] rounded-[16px] rounded-br-md px-3.5 py-2.5 text-[13.5px] leading-[1.45]"
                  style={{
                    backgroundColor: "var(--cw-visitor)",
                    color: "var(--cw-text)",
                  }}
                >
                  {msg.text}
                </div>
                <VisitorAvatar initial={tenant.visitorInitial} />
              </div>
            ),
          )}

          {aiTyping ? (
            <div className="flex items-end gap-2">
              <AiAvatar emoji={tenant.aiEmoji} />
              <div
                className="rounded-[16px] rounded-bl-md px-3.5 py-3"
                style={{
                  backgroundColor: "var(--cw-ai)",
                  border: "1px solid var(--cw-ai-border)",
                }}
              >
                <TypingDots color={theme.messageText} />
              </div>
            </div>
          ) : null}

          {form ? <BookingForm form={form} /> : null}
        </div>

        {/* Input bar */}
        <div
          className="flex shrink-0 items-center gap-2.5 border-t px-3 py-3"
          style={{ borderColor: "var(--cw-input-border)" }}
        >
          <div
            className="flex h-11 flex-1 items-center overflow-hidden rounded-[12px] px-3.5"
            style={{ border: "1px solid var(--cw-input-border)" }}
          >
            <span
              className="truncate text-[13.5px]"
              style={{
                color: inputValue ? "var(--cw-text)" : "rgba(251,251,249,0.35)",
              }}
            >
              {inputValue || tenant.inputPlaceholder}
            </span>
          </div>
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-white"
            style={{ backgroundColor: "var(--cw-accent)" }}
            aria-hidden
          >
            <SendIcon size={17} />
          </div>
        </div>
      </div>

      {/* Launcher FAB — visual only, like the original widget */}
      <div
        className="mt-3.5 flex h-14 w-14 items-center justify-center rounded-full text-[22px] shadow-[0_10px_28px_rgba(217,119,87,0.38)]"
        style={{ backgroundColor: "var(--cw-accent)" }}
        aria-hidden
      >
        <span className="select-none leading-none">{tenant.aiEmoji}</span>
      </div>
    </div>
  );
}
