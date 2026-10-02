# Student Portfolio Template

A pixel-art × liquid-glass portfolio for students — built to impress recruiters, interviewers, and professors.

- **Pixel-art background**: a procedurally drawn night city (`src/components/PixelScene.tsx`), rendered crisp at any size
- **Liquid glass cards**: SVG-displacement refraction adapted from [shuding/liquid-glass](https://github.com/shuding/liquid-glass), with a frosted fallback for Safari/Firefox
- **Bento layout**: About, Contact, Education, Awards, GitHub activity, Projects, Experience, Publications, Skills

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Make it yours

All content is in **`src/config/site.ts`** — no component edits needed.

| Card | Key in `site.ts` |
| --- | --- |
| Name, title, location, status, résumé link | `person` |
| About Me (terminal-style lines) | `about` |
| Contact blurb + links | `contact` |
| Education / Experience / Projects | `education`, `experience`, `projects` |
| Publications (your name is bolded automatically) | `publications` |
| Skills (grouped, with icons) | `skills` |
| Awards | `awards` |

- Empty any array to hide that card.
- Drop your résumé at `public/cv.pdf`.
- Colors, heatmap palette, background chunkiness/dimming, and the skyline seed are in **`src/config/theme.ts`**.
- Rearrange cards by moving components between the columns in `src/App.tsx`. Mobile order is set in `src/index.css` (`.card--*` `order` rules).

## Design review screenshots

```bash
npm run dev
npm run screenshot   # writes screenshots/{desktop,mobile}{,-full}.png
```
