/**
 * ARCHIVED template: 2-column project card grid.
 * Not imported by the live app. Copy into Projects.tsx when you add more projects.
 *
 * Needs:
 * - projectMeta[] with { image, liveUrl, githubUrl }
 * - projects.items in dictionaries
 * - GithubIcon + ExternalLink + next/image
 */

"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";

type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
};

type ProjectMeta = {
  image: string;
  liveUrl: string;
  githubUrl: string;
};

type Labels = {
  liveDemo: string;
  github: string;
  mockupAlt: string;
};

export function ProjectCardsGrid({
  items,
  meta,
  labels,
  GithubIcon,
}: {
  items: ProjectItem[];
  meta: readonly ProjectMeta[];
  labels: Labels;
  GithubIcon: (props: { size?: number }) => React.ReactNode;
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((project, index) => {
        const itemMeta = meta[index];
        if (!itemMeta) return null;

        return (
          <article
            key={project.title}
            className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card transition-colors hover:border-white/15"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-[#181816]">
              <Image
                src={itemMeta.image}
                alt={labels.mockupAlt.replace("{title}", project.title)}
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
                  href={itemMeta.liveUrl}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <ExternalLink size={16} strokeWidth={1.75} />
                  {labels.liveDemo}
                </a>
                <a
                  href={itemMeta.githubUrl}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <GithubIcon size={16} />
                  {labels.github}
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
