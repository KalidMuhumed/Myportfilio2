# Städhjälpen Väst – Chat Demo (Portfolio Export)

Fristående kopia av **UI + auto-play demo** för Städhjälpen-widgeten.  
Ingen backend. Ingen multi-tenant-logik. Redo att droppas in i din portfolio.

## Vad ingår

- Dark mode (`#1E1E1C`, text `#FBFBF9`, accent `#d97757`)
- Launcher + bot-avatar: 🧹
- User-avatar: **O**
- Realistisk typing-simulation (input + bubblor)
- Bokningsformulär (förnamn, efternamn, e-post, önskad tid)
- Demo visar: AI bokar **inte** själv – den frågar, kollar tider, skickar förfrågan via formulär

## Filer

| Fil | Beskrivning |
|---|---|
| `stadhjalpen-demo-widget.js` | Hela UI + demo-logik |
| `README.md` | Denna guide |

## Snabbstart (HTML)

1. Kopiera mappen till ditt portfolio-projekt, t.ex. `public/demos/stadhjalpen-chat-demo/`
2. Lägg till scriptet längst ner i sidan (eller i projektsektionen):

```html
<script src="/demos/stadhjalpen-chat-demo/stadhjalpen-demo-widget.js"></script>
```

3. Öppna sidan → klicka på 🧹-bubblan → demot körs automatiskt.

## Next.js / React

Ladda scriptet bara på den sida/sektion där demot ska synas:

```tsx
'use client';

import { useEffect } from 'react';

export default function StadhjalpenDemo() {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = '/demos/stadhjalpen-chat-demo/stadhjalpen-demo-widget.js';
    s.async = true;
    document.body.appendChild(s);
    return () => {
      // Widgeten mountas global; ta bort knappen/fönstret vid unmount om du byter sida
      document.getElementById('agy-widget-btn')?.remove();
      document.getElementById('agy-widget-window')?.remove();
      // @ts-expect-error demo flag
      delete window.__STADHJALPEN_DEMO_LOADED__;
    };
  }, []);

  return null; // widgeten injectar sig själv
}
```

Lägg JS-filen under `public/demos/stadhjalpen-chat-demo/`.

## Demoflöde (exakt)

1. AI: `Hej! Hur kan jag hjälpa dig idag?`
2. Kund skriver: hemstädning Göteborg fredag
3. AI frågar: info, offert eller boka tid?
4. Kund: vill boka tid
5. AI kollar lediga tider
6. AI visar tider + formulär
7. Formulär fylls i (Anna Andersson) och skickas
8. AI: bokningsförfrågan skickad

## Färger

| Token | Hex |
|---|---|
| Bakgrund / cards | `#1E1E1C` |
| Text | `#FBFBF9` |
| Accent | `#d97757` |

## Viktigt

- Detta är en **simulerad demo** för showcase/filmning.
- Den skarpa produkten lever i `public/widget.js` i AI-kund-projektet (multi-tenant + API).
- Ändra inte originalet i AI-kund om du bara vill ha portfolio-kopian.
