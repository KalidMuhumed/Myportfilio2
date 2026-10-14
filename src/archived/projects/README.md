# Projects UI layout (saved for later)

Live site shows **only** the featured project: **AI Tenant Chat, Städhjälpen Väst**.  
Placeholder cards (Order Sync Hub, Lead Intake, Invoice Flow, Site Monitor) were removed from the homepage.

**Mobile-first:** most visitors use phones. Stack featured content on small screens; only split left/right from `lg:`. Keep tap targets ~44px and avoid horizontal overflow. See `.cursor/rules/mobile-first.mdc`.

## Layout A: Featured split (in use)

Used for interactive demos (chat widget).

```
┌─────────────────────────────────────────────────────────┐
│  Utvalda projekt (section title)                        │
├──────────────────────────┬──────────────────────────────┤
│  LEFT                    │  RIGHT                       │
│  eyebrow / title         │  live widget / media         │
│  description             │  (min-h ~600px, dark bg)     │
│  tags                    │                              │
│  Live Demo + GitHub      │                              │
│  hint                    │                              │
└──────────────────────────┴──────────────────────────────┘
```

- File: `src/components/Projects.tsx`
- Copy: `projects.featured` in `sv.json` / `en.json`
- Widget: `src/chat-widget/StadhjalpenDemoWidget.tsx`
- Autoplay starts when the widget scrolls into view (refresh-safe); Live Demo bumps the widget `key` to replay in place (no page refresh)
- GitHub on featured is decorative (`span`, not a link)

## Layout B: Card grid (placeholder template)

For normal projects with mockup image + links. Pattern:

```tsx
<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
  {projects.items.map((project, index) => (
    <article className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card ...">
      {/* image aspect-[16/10] */}
      {/* title, description, tags */}
      {/* Live Demo <a> + GitHub <a> */}
    </article>
  ))}
</div>
```

Saved reference implementation:

- `Projects.grid-cards.tsx` (full card grid component snippet)
- `placeholder-items.sv.json` / `placeholder-items.en.json` (old copy)
- Mockups: `/public/projects/*.svg`

## How to add another project later

1. Prefer **Layout B** for static projects: put items back in `dictionaries` `projects.items` and render the grid under the featured article (see `Projects.grid-cards.tsx`).
2. Prefer **Layout A** for another live demo: duplicate the featured `<article>` split and wire a new widget/ref.
3. Keep button classes identical so the portfolio looks consistent:

```
inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm ...
```

## Current homepage

`Hero` → `Projects` (featured only) → `Contact`
