# Project guide — portfolio (vamsikrishnapodipireddi.in)

React Router v7, `ssr: false`, prerendered to static HTML, deployed on Cloudflare Pages.
Styling is **hand-rolled component-scoped CSS + global tokens**. No Tailwind, no CSS-in-JS, no component library.

## Design rules — read before touching UI

These exist to keep the site from looking AI-generated. Follow them.

### Icons
- **Never use emoji as icons or UI glyphs.** No 🚀 ✨ 📦 in JSX, data, or labels.
- Use **lucide-react** for every icon: `import { ArrowRight } from "lucide-react"`.
- Size via the `size` prop (px). Color is inherited — lucide uses `currentColor`, so set `color` on the parent in CSS.
- Decorative icons get `aria-hidden="true"`; icon-only links get an `aria-label` on the `<a>`.
- Project/site icons live as `LucideIcon` components in `app/lib/consts.ts` (field `icon`), not as strings.

### Styling
- Add styles in a component-scoped `*.css` next to the component, imported at top. Match the existing file's structure.
- **Reuse design tokens** from `app/styles/global.css` (`:root`). Never hardcode a hex/length that a token already covers.
  - color: `--ink`, `--ink-soft`, `--muted`, `--faint`, `--line`, `--line-strong`
  - accent: `--violet` (primary), `--cyan` (secondary), `--fuchsia`; `--accent`, `--accent-grad`
  - glass: `--glass-bg`, `--glass-bg-hover`, `--glass-blur`
  - shape/motion: `--radius`, `--radius-lg`, `--radius-sm`, `--shadow`, `--shadow-glow`, `--ease`
  - type: `--font-sans` (Inter), `--font-display` (Space Grotesk), `--font-mono` (JetBrains Mono)
  - layout: `--container`, plus helpers `.container`, `.section`
- **Reuse primitives** instead of re-styling: `.glass`, `.btn` / `.btn-primary` / `.btn-sm`, `.tag`, `.eyebrow`, `.lead`, `.gradient-text`.

### Aesthetic guardrails (the anti-AI-look list)
- One accent identity: violet primary, cyan secondary. Don't invent new gradients per component — use `--accent-grad` or a per-card accent pair (`--c1`/`--c2`).
- Consistent spacing: use `clamp()` scales like the existing files; don't sprinkle arbitrary px margins.
- Restraint: no drop-shadow / blur / gradient on everything. Glass and glow are already defined — reuse, don't multiply.
- Accessibility is non-negotiable: keep `:focus-visible`, `.sr-only`, `.skip-link`, and `prefers-reduced-motion` working.
- When unsure how something should look, ask for a reference (screenshot / real site) rather than inventing a generic layout.

### Dependencies
- Keep it dependency-light. Don't add a UI kit, icon set, or CSS framework without asking. lucide-react is the only icon source.

## Commands
- `npm run dev` — local dev
- `npm run typecheck` — `react-router typegen && tsc`
- `npm run build` — generates OG images + feeds, then prerenders to `build/client/`
