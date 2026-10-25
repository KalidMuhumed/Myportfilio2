"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useDictionary } from "@/i18n/LanguageProvider";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const directLinks = [
  {
    href: "mailto:kalid.automations@gmail.com",
    label: "kalid.automations@gmail.com",
    icon: Mail,
  },
  {
    href: "https://github.com/KalidMuhumed",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/kalid-muhumed-32451b1aa/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
const SEND_LIMIT_MS = 24 * 60 * 60 * 1000;
const SEND_LIMIT_KEY = "portfolio-contact-limit";

type SendLimit = { at: number; email: string };

function readSendLimit(): SendLimit | null {
  try {
    const raw = localStorage.getItem(SEND_LIMIT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SendLimit;
    if (typeof parsed.at !== "number" || typeof parsed.email !== "string") return null;
    if (Date.now() - parsed.at >= SEND_LIMIT_MS) {
      localStorage.removeItem(SEND_LIMIT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

type Status = "idle" | "sending" | "error" | "success";

export function Contact() {
  const { contact } = useDictionary();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus("error");
      setFeedback(contact.errorRequired);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus("error");
      setFeedback(contact.errorEmail);
      return;
    }

    const previous = readSendLimit();
    if (previous) {
      setStatus("error");
      setFeedback(contact.errorLimit);
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus("error");
      setFeedback(contact.errorSend);
      return;
    }

    setStatus("sending");
    setFeedback(contact.sending);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Nytt meddelande från portfolion",
          from_name: "Ny Kund - Portfolio",
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const data = (await response.json()) as { success?: boolean };

      if (!response.ok || !data.success) {
        setStatus("error");
        setFeedback(contact.errorSend);
        return;
      }

      localStorage.setItem(
        SEND_LIMIT_KEY,
        JSON.stringify({ at: Date.now(), email: trimmedEmail.toLowerCase() }),
      );
      setStatus("success");
      setFeedback(contact.success);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback(contact.errorSend);
    }
  }

  const inputClassName =
    "w-full rounded-md border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-accent";

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border px-4 py-20 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            {contact.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {contact.intro}
          </p>

          <ul className="mt-8 space-y-4">
            {directLinks.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:") ? undefined : "noopener noreferrer"
                  }
                  className="inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[12px] border border-border bg-card p-6 sm:p-8"
        >
          <input type="hidden" name="from_name" value="Ny Kund - Portfolio" />
          <div className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                {contact.name}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={status === "sending"}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={inputClassName}
                placeholder={contact.namePlaceholder}
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                {contact.email}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={status === "sending"}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={inputClassName}
                placeholder={contact.emailPlaceholder}
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                {contact.message}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                disabled={status === "sending"}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={`${inputClassName} resize-y min-h-[140px]`}
                placeholder={contact.messagePlaceholder}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? contact.sending : contact.submit}
          </button>

          <p className="mt-4 text-[10px] leading-relaxed text-muted/80 sm:text-xs">
            {contact.privacyNote}{" "}
            <Link
              href="/privacy"
              className="text-foreground/65 underline decoration-border underline-offset-4 transition-colors hover:text-accent"
            >
              {contact.privacyLink}
            </Link>
            .
          </p>

          <p
            role="status"
            aria-live="polite"
            className={`mt-4 min-h-[1.25rem] text-sm ${
              status === "error"
                ? "text-accent"
                : status === "success"
                  ? "text-foreground"
                  : "text-muted"
            }`}
          >
            {status === "idle" ? "" : feedback}
          </p>
        </form>
      </div>
    </section>
  );
}
