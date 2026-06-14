# vamsikrishnapodipireddi.in

Personal site + portfolio for **Vamsi Krishna Podipireddi** — a dark, glassy
landing page that showcases projects (with source + live links) and a small blog.

Built with [Astro](https://astro.build) and deployed to **Cloudflare Workers**
([static assets](https://developers.cloudflare.com/workers/static-assets/)).

## Edit the content

Almost everything is data-driven from one file:

- **`src/consts.ts`** — site title/description, author bio + socials, and the
  `PROJECTS` array (name, tagline, tags, GitHub/live URLs, accent colors). Add or
  reorder projects here.
- **`src/content/blog/*.md`** — blog posts (frontmatter: `title`, `description`,
  `pubDate`, optional `updatedDate`, `heroImage`, `heroImageAlt`).
- **`src/styles/global.css`** — design tokens (colors, glass, radii) at the top.
- **`public/og.png`** — social share card. Regenerate with
  `node scripts/generate-og.mjs` after editing `scripts/og.svg`.

## Develop

```sh
npm install
npm run dev        # local dev server
npm run build      # production build -> dist/
npm run preview    # build + run on the Cloudflare runtime (wrangler dev)
npm run deploy     # wrangler deploy (requires `wrangler login`)
```

## Structure

| Path | What |
|------|------|
| `src/pages/index.astro` | Hero + projects grid + about teaser + recent writing |
| `src/pages/about.astro` | About page |
| `src/pages/blog/` | Blog index + post route |
| `src/components/` | `Header`, `Footer`, `ProjectCard`, `SocialLinks`, `Icon`, … |
| `src/layouts/` | `Layout` (shell) + `BlogPost` |

Routing/deploy config lives in `astro.config.mjs` (adapter + `site`) and
`wrangler.json` (Worker name + assets).
