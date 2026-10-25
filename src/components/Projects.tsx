"use client";

import { Boxes, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  architectureLabel,
  githubLabel,
  hint,
  architectureOpen,
  onReplay,
  onArchitecture,
}: {
  liveDemoLabel: string;
  architectureLabel: string;
  githubLabel: string;
  hint: string;
  architectureOpen: boolean;
  onReplay: () => void;
  onArchitecture: () => void;
}) {
  const buttonClassName =
    "inline-flex h-11 min-w-0 flex-1 basis-0 touch-manipulation select-none items-center justify-center gap-1 whitespace-nowrap rounded-md border bg-transparent px-1.5 text-[11px] leading-none transition-colors hover:border-accent hover:text-accent active:border-accent active:text-accent active:scale-[0.98] md:h-auto md:min-h-11 md:flex-none md:basis-auto md:gap-2 md:px-3.5 md:py-2.5 md:text-sm";
  const idleClassName = "border-border text-foreground";

  return (
    <>
      <div className="flex w-full flex-nowrap items-center gap-1.5 md:w-auto md:gap-3">
        <button type="button" className={`${buttonClassName} ${idleClassName}`} onClick={onReplay}>
          <ExternalLink size={14} strokeWidth={1.75} className="shrink-0" />
          {liveDemoLabel}
        </button>
        <button
          type="button"
          className={`${buttonClassName} ${architectureOpen ? "border-accent text-accent" : idleClassName}`}
          data-architecture-toggle=""
          aria-expanded={architectureOpen}
          onClick={onArchitecture}
        >
          <Boxes size={14} strokeWidth={1.75} className="shrink-0" />
          {architectureLabel}
        </button>
        <a
          href="https://github.com/KalidMuhumed"
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClassName} ${idleClassName}`}
        >
          <GithubIcon size={14} />
          {githubLabel}
        </a>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-muted/80 sm:text-xs">{hint}</p>
    </>
  );
}

export function Projects() {
  const { projects } = useDictionary();
  const demoRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [architectureSession, setArchitectureSession] = useState(0);

  // Initial mount ("boot") waits until the widget is visible before playing.
  // Live Demo bumps the key → widget remounts → plays immediately. No page reload.
  const [demoKey, setDemoKey] = useState("boot");

  const replayDemo = () => {
    setDemoKey(String(Date.now()));
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openArchitecture = () => {
    setShowArchitecture(true);
    setArchitectureSession((session) => session + 1);
  };

  useEffect(() => {
    if (!showArchitecture) return;

    architectureRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const closeTimer = window.setTimeout(() => {
      setShowArchitecture(false);
    }, 10000);

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (architectureRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-architecture-toggle]")) return;
      setShowArchitecture(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.clearTimeout(closeTimer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [showArchitecture, architectureSession]);

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
                  architectureLabel={projects.architecture}
                  githubLabel={projects.github}
                  hint={projects.featured.hint}
                  architectureOpen={showArchitecture}
                  onReplay={replayDemo}
                  onArchitecture={openArchitecture}
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
                architectureLabel={projects.architecture}
                githubLabel={projects.github}
                hint={projects.featured.hint}
                architectureOpen={showArchitecture}
                onReplay={replayDemo}
                onArchitecture={openArchitecture}
              />
            </div>
          </div>
        </article>

        {showArchitecture ? (
          <div
            ref={architectureRef}
            id="architecture"
            className="mt-8 scroll-mt-20 sm:mt-10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
              {projects.architecture}
            </p>
            <h3 className="mt-3 font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              {projects.architectureTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {projects.architectureBody}
            </p>
            <div className="mx-auto mt-5 w-fit max-w-full sm:mt-6">
              <img
                src="/architecture/last.svg"
                alt={projects.architectureAlt}
                className="h-auto w-[402px] max-w-full"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
