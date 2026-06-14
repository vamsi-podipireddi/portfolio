# vamsikrishnapodipireddi.in

Personal site + portfolio for **Vamsi Krishna Podipireddi** — a dark, glassy
landing page that showcases projects (with source + live links) and a small blog.

Built with [React Router v7](https://reactrouter.com) (framework mode, SPA + full
prerender) and deployed to **Cloudflare Pages** as pure static assets — no Worker,
no Pages Functions, so it never touches the Workers request quota.

## Edit the content

Almost everything is data-driven from one file:

- **`app/lib/consts.ts`** — site title/description, author bio + socials, and the
  `PROJECTS` array (name, tagline, tags, GitHub/live URLs, accent colors). Add or
  reorder projects here.
- **`app/content/blog/*.md`** — blog posts (frontmatter: `title`, `description`,
  `pubDate`, optional `updatedDate`, `heroImage`, `heroImageAlt`). New files are
  auto-discovered, prerendered, and added to the RSS feed + sitemap on the next build.
- **`app/styles/global.css`** — design tokens (colors, glass, radii) at the top.
- **`public/og.png`** — social share card. Regenerate with
  `node scripts/generate-og.mjs` after editing `scripts/og.svg`.

## Develop

```sh
npm install
npm run dev        # local dev server
npm run build      # static build -> build/client/
npm run typecheck  # react-router typegen + tsc
npx serve build/client   # preview the built static site locally
```

The `build` script also rasterizes the OG image, generates `rss.xml` + `sitemap.xml`,
and copies the prerendered 404 to `build/client/404.html`.

## Deploy (Cloudflare Pages)

Create a Pages project from this repo with:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `build/client` |
| Environment | `NODE_VERSION=22` |

Output is 100% static (`_worker.js`-free). Add the custom domain in the Pages
dashboard.

## Structure

| Path | What |
|------|------|
| `app/root.tsx` | HTML shell, `<head>`/SEO, background, Header + Footer |
| `app/routes.ts` | Route table |
| `app/routes/home.tsx` | Hero + projects grid + about teaser + recent writing |
| `app/routes/about.tsx` | About page |
| `app/routes/blog._index.tsx` | Blog index |
| `app/routes/blog.$slug.tsx` | Blog post (renders Markdown/MDX) |
| `app/routes/$.tsx` | 404 catch-all |
| `app/components/` | `Header`, `Footer`, `ProjectCard`, `SocialLinks`, `Icon`, `FormattedDate` |
| `app/lib/` | `consts`, `posts` (content loader), `seo` (meta helper) |
| `scripts/` | `generate-og.mjs`, `generate-feeds.mjs` |

Static + prerender config lives in `react-router.config.ts` (`ssr: false` +
`prerender`), and the MDX + Shiki pipeline in `vite.config.ts`.
