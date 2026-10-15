"use client";

import { useDictionary } from "@/i18n/LanguageProvider";

const CONTACT_EMAIL = "kalid.automations@gmail.com";

export function Privacy() {
  const { privacy } = useDictionary();
  const [beforeEmail, afterEmail] = privacy.controlBody.split(CONTACT_EMAIL);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-serif text-sm font-medium tracking-tight text-foreground">
          {privacy.title}
        </h1>
        <p className="mt-6 text-xs leading-relaxed text-muted">{privacy.intro}</p>

        <h2 className="mt-14 font-serif text-sm font-medium tracking-tight text-foreground">
          {privacy.collectTitle}
        </h2>
        <p className="mt-4 text-xs leading-relaxed text-muted">{privacy.collectBody}</p>

        <h2 className="mt-14 font-serif text-sm font-medium tracking-tight text-foreground">
          {privacy.useTitle}
        </h2>
        <p className="mt-4 text-xs leading-relaxed text-muted">{privacy.useBody}</p>

        <h2 className="mt-14 font-serif text-sm font-medium tracking-tight text-foreground">
          {privacy.controlTitle}
        </h2>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          {beforeEmail}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          {afterEmail}
        </p>
      </article>
    </section>
  );
}
