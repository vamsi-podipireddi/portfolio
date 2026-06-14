// Build-time RSS + sitemap generation (no server runtime on Cloudflare Pages).
// Reads frontmatter from app/content/blog and writes public/rss.xml + public/sitemap.xml.
// Run: node scripts/generate-feeds.mjs  (wired into `npm run build`)
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const SITE = "https://vamsikrishnapodipireddi.in";
const SITE_TITLE = "Vamsi Krishna Podipireddi";
const SITE_DESCRIPTION =
	"Engineer and builder. I make systems-y things — local AI, developer tooling, and interactive learning. Selected projects, with source and live links.";

const dir = "app/content/blog";
const posts = readdirSync(dir)
	.filter((f) => /\.mdx?$/.test(f))
	.map((f) => {
		const slug = f.replace(/\.mdx?$/, "");
		const { data } = matter(readFileSync(join(dir, f), "utf8"));
		return { slug, ...data };
	})
	.sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf());

const esc = (s) =>
	String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const items = posts
	.map(
		(p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.pubDate).toUTCString()}</pubDate>
    </item>`,
	)
	.join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
writeFileSync("public/rss.xml", rss);

const urls = ["/", "/about", "/blog", ...posts.map((p) => `/blog/${p.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync("public/sitemap.xml", sitemap);

console.log(
	`wrote public/rss.xml (${posts.length} items) + public/sitemap.xml (${urls.length} urls)`,
);
