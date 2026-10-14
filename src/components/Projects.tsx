"use client";

import { ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { StadhjalpenDemoWidget } from "@/chat-widget/StadhjalpenDemoWidget";
import { useDictionary } from "@/i18n/LanguageProvider";

function GithubIcon({ size = 16 }: { size?: number }) {
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

function DemoActions({
  liveDemoLabel,
  githubLabel,
  hint,
  onReplay,
}: {
  liveDemoLabel: string;
  githubLabel: string;
  hint: string;
  onReplay: () => void;
}) {
  const buttonClassName =
    "inline-flex min-h-11 touch-manipulation select-none items-center gap-2 rounded-md border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent active:border-accent active:text-accent active:scale-[0.98]";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <button type="button" className={buttonClassName} onClick={onReplay}>
          <ExternalLink size={16} strokeWidth={1.75} />
          {liveDemoLabel}
        </button>
        <span
          className="inline-flex min-h-11 cursor-default items-center gap-2 rounded-md border border-border px-3.5 py-2.5 text-sm text-muted opacity-70"
          aria-disabled="true"
        >
          <GithubIcon size={16} />
          {githubLabel}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted/80">{hint}</p>
    </>
  );
}

export function Projects() {
  const { projects } = useDictionary();
  const demoRef = useRef<HTMLDivElement>(null);

  // Initial mount ("boot") waits until the widget is visible before playing.
  // Live Demo bumps the key → widget remounts → plays immediately. No page reload.
  const [demoKey, setDemoKey] = useState("boot");

  const replayDemo = () => {
    setDemoKey(String(Date.now()));
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-border px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl sm:mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            {projects.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-[1.75rem] font-medium tracking-tight text-foreground sm:text-4xl">
            {projects.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted sm:mt-4 sm:text-base">
            {projects.intro}
          </p>
        </div>

        <article className="overflow-hidden rounded-[12px] border border-border bg-card">
          <div className="grid gap-0 lg:grid-cols-[1fr_minmax(300px,400px)]">
            <div className="flex min-w-0 flex-col justify-center border-b border-border p-4 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
                {projects.featured.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-medium tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {projects.featured.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {projects.featured.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                {projects.featured.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-border px-2.5 py-1 text-xs tracking-wide text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-5 hidden md:mt-6 md:block">
                <DemoActions
                  liveDemoLabel={projects.liveDemo}
                  githubLabel={projects.github}
                  hint={projects.featured.hint}
                  onReplay={replayDemo}
                />
              </div>
            </div>

            <div
              ref={demoRef}
              className="relative z-0 min-h-[600px] scroll-mt-20 overflow-hidden bg-[#141413] sm:min-h-[640px]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,119,87,0.08),transparent_55%)]"
              />
              <div className="relative h-full min-h-[600px] sm:min-h-[640px]">
                <StadhjalpenDemoWidget
                  key={demoKey}
                  autoStart={demoKey === "boot" ? "visible" : "immediate"}
                />
              </div>
            </div>

            <div className="relative z-50 border-t border-border bg-card p-4 md:hidden">
              <DemoActions
                liveDemoLabel={projects.liveDemo}
                githubLabel={projects.github}
                hint={projects.featured.hint}
                onReplay={replayDemo}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
