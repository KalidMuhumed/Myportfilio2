"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

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
    href: "https://github.com/",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

type Status = "idle" | "error" | "success";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus("error");
      setFeedback("Fyll i namn, e-post och meddelande innan du skickar.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus("error");
      setFeedback("Ange en giltig e-postadress.");
      return;
    }

    setStatus("success");
    setFeedback("Tack! Ditt meddelande är redo — jag återkommer så snart jag kan.");
    setName("");
    setEmail("");
    setMessage("");
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
            Contact
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Let&apos;s connect
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Har du ett projekt, en automationsidé eller bara en fråga? Skicka
            ett meddelande — eller nå mig direkt via e-post och sociala länkar.
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
          <div className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                Namn
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={inputClassName}
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                E-post
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={inputClassName}
                placeholder="namn@exempel.se"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                Meddelande
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={`${inputClassName} resize-y min-h-[140px]`}
                placeholder="Berätta kort om ditt projekt eller din fråga…"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90 sm:w-auto"
          >
            Skicka meddelande
          </button>

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
