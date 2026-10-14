# Projects section (archived)

The **Selected projects / Utvalda projekt** grid is turned off so the homepage stays clean (Hero → Contact).

## What’s saved

| Path | Purpose |
|------|---------|
| `Projects.tsx` | Full section component (cards, tags, Live Demo / GitHub) |
| `../../dictionaries/sv.json` → `projects` | Swedish copy (still in live dictionaries) |
| `../../dictionaries/en.json` → `projects` | English copy (still in live dictionaries) |
| `/public/projects/*.svg` | Placeholder mockups |

## How to activate again

1. Copy `Projects.tsx` back to `src/components/Projects.tsx`  
   (or move this file there).
2. In `src/app/page.tsx`:

```tsx
import { Projects } from "@/components/Projects";

// …
<Hero />
<Projects />
<Contact />
```

3. Restore the nav / footer link:

```tsx
{ href: "/#projects", label: nav.projects },
// and in Footer:
{ href: "/#projects", label: footer.projects },
```

4. Replace placeholder `projectMeta` URLs and images with real projects when ready.

## Current site (without projects)

Homepage: `Hero` → `Contact` only. Nav links: About, Contact (+ language switcher).
