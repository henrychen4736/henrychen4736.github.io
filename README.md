# Student Portfolio Template

A personal portfolio for students — built to impress recruiters, interviewers, and professors.

- **Animated 3D gradient background**: [ShaderGradient](https://github.com/ruucm/shadergradient) on [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
- **Liquid-metal monogram**: the shader from [paper-design/liquid-logo](https://github.com/paper-design/liquid-logo) (`@paper-design/shaders-react`)
- **Liquid glass UI**: SVG-displacement refraction adapted from [shuding/liquid-glass](https://github.com/shuding/liquid-glass), with a frosted-glass fallback for Safari/Firefox

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Requires Node 20+.

## Make it yours (no component edits needed)

| What | Where |
| --- | --- |
| Name, monogram, role, school, location | `src/config/site.ts` → `person` |
| Headline, status pill, buttons, quick stats | `src/config/site.ts` → `hero` |
| Nav links, social links | `src/config/site.ts` → `nav`, `socials` |
| Colors and accent | `src/config/theme.ts` → `colors` |
| Background gradient | `src/config/theme.ts` → `gradient` |
| Liquid-metal emblem look | `src/config/theme.ts` → `emblem` |
| Your CV | drop it at `public/cv.pdf` |

**Tips**

- In `hero.headline`, wrap words in `*asterisks*` to render them in the italic accent style.
- Set `person.logoImage` to a transparent PNG/SVG in `public/` to use your own logo in liquid metal instead of letters.
- Design a gradient at [shadergradient.co/customize](https://www.shadergradient.co/customize), copy its URL, and paste it into `theme.gradient.urlString`.
- Supported social icons: `github`, `linkedin`, `scholar`, `email`, `x`, `orcid`, `website`.

## Design review screenshots

```bash
npm run dev
node scripts/screenshot.mjs   # writes screenshots/desktop.png and screenshots/mobile.png
```
