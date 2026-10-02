# Student Portfolio Template

A pixel-art × liquid-glass portfolio for students — built to impress recruiters, interviewers, and professors.

- **Pixel-art background**: a procedurally drawn night city (`src/components/PixelScene.tsx`), rendered crisp at any size
- **Liquid glass UI**: [`liquid-glass-react`](https://github.com/rdev/liquid-glass-react) — edge refraction, chromatic aberration, elastic stretch toward the cursor, and hover/press highlights. Full refraction in Chromium; Safari/Firefox get the frosted blur. Wrapped by `src/components/Glass.tsx` so it works in normal page layout (presets: `card`, `button`, `chip`).
- **Light & dark themes**: sun/moon toggle (remembered per visitor, defaults to the OS setting); the pixel city switches between night and day
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
- Colors for both themes, heatmap palettes, scene colors, pixel size, and the skyline seed are in **`src/config/theme.ts`**. Set `defaultMode` to `'dark'`, `'light'`, or `'system'`.
- `public/cv.pdf` ships as a placeholder so the Résumé button works out of the box (it opens in a new tab).
- Rearrange cards by moving components between the columns in `src/App.tsx`. Mobile order is set in `src/index.css` (`.card--*` `order` rules).

## Design review screenshots

```bash
npm run dev
npm run screenshot   # writes screenshots/{desktop,mobile}{,-full}.png
```
