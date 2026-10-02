const skillGroups = [
  {
    title: "Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: "Backend",
    skills: ["Python", "Node.js", "REST APIs", "PostgreSQL", "Webhooks"],
  },
  {
    title: "Automation & Tools",
    skills: ["n8n", "Workflow automation", "API integrations", "Git", "Docker"],
  },
];

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border px-4 py-20 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            About me
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Fullstack &amp; automation med fokus
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            <p>
              Jag heter Kalid Muhumed — fullstack developer med fokus på
              automation. Jag bygger webbappar i Next.js och kopplar ihop dem
              med Python-tjänster, APIs och webhooks så att manuella steg blir
              pålitliga flöden.
            </p>
            <p>
              Oavsett om det handlar om en dashboard, en lead-pipeline eller en
              nattlig synk mellan system, vill jag att resultatet ska kännas
              enkelt för användaren och robust under huven.
            </p>
            <p>
              Just nu arbetar jag med projekt där gränssnitt, data och
              automatiserade workflows möts — från prototyp till något som går
              att lita på i produktion.
            </p>
          </div>
        </div>

        <div className="rounded-[12px] border border-border bg-card p-6 sm:p-8">
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">
            Färdigheter
          </h3>
          <p className="mt-2 text-sm text-muted">
            Tech stack grupperad efter hur jag faktiskt jobbar.
          </p>

          <div className="mt-8 space-y-8">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  {group.title}
                </h4>
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
    </section>
  );
}
