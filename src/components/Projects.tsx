"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { ChatWidget } from "@/chat-widget/ChatWidget";
import { useDictionary } from "@/i18n/LanguageProvider";

const projectMeta = [
  {
    image: "/projects/order-sync.svg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    image: "/projects/lead-intake.svg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    image: "/projects/invoice-flow.svg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    image: "/projects/site-monitor.svg",
    liveUrl: "#",
    githubUrl: "#",
  },
] as const;

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

export function Projects() {
  const { projects } = useDictionary();

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-border px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            {projects.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {projects.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {projects.intro}
          </p>
        </div>

        <article className="mb-6 overflow-hidden rounded-[12px] border border-border bg-card">
          <div className="grid gap-0 lg:grid-cols-[1fr_minmax(320px,400px)]">
            <div className="flex flex-col justify-center border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
                {projects.featured.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                {projects.featured.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {projects.featured.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {projects.featured.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-border px-2.5 py-1 text-xs tracking-wide text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-muted/80">
                {projects.featured.hint}
              </p>
            </div>

            <div className="relative flex min-h-[580px] items-end justify-center bg-[#141413] px-4 pb-5 pt-8 sm:px-6">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,119,87,0.08),transparent_55%)]"
              />
              <ChatWidget
                tenantId="stadhjalpen"
                defaultOpen
                className="relative z-[1]"
              />
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.items.map((project, index) => {
            const meta = projectMeta[index];
            if (!meta) return null;

            return (
              <article
                key={project.title}
                className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card transition-colors hover:border-white/15"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-[#181816]">
                  <Image
                    src={meta.image}
                    alt={projects.mockupAlt.replace("{title}", project.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border px-2.5 py-1 text-xs tracking-wide text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href={meta.liveUrl}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <ExternalLink size={16} strokeWidth={1.75} />
                      {projects.liveDemo}
                    </a>
                    <a
                      href={meta.githubUrl}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <GithubIcon size={16} />
                      {projects.github}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
