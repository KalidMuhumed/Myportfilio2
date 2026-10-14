"use client";

import { useDictionary } from "@/i18n/LanguageProvider";

export function About() {
  const { about } = useDictionary();

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
          {about.eyebrow}
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {about.title}
        </h1>

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">
              {about.backgroundTitle}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h2 className="mt-12 text-sm font-medium uppercase tracking-[0.2em] text-foreground">
              {about.educationTitle}
            </h2>
            <ul className="mt-5 space-y-6">
              {about.education.map((item) => (
                <li key={item.title}>
                  <h3 className="text-base font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">
              {about.skillsTitle}
            </h2>
            <p className="mt-3 text-sm text-muted">{about.skillsIntro}</p>

            <div className="mt-8 space-y-8">
              {about.skillGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                    {group.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md border border-border px-2.5 py-1 text-xs tracking-wide text-muted"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
