import type { Config } from "@react-router/dev/config";
import { readdirSync } from "node:fs";

// Enumerate blog slugs from the content dir so new posts are auto-prerendered.
const slugs = readdirSync("app/content/blog")
	.filter((f) => /\.mdx?$/.test(f))
	.map((f) => f.replace(/\.mdx?$/, ""));

export default {
	// No server runtime: pure static output in build/client.
	ssr: false,
	// Pre-render every route to static HTML (real HTML per page, good for SEO).
	// "/404" renders the catch-all; build script copies it to build/client/404.html
	// so Cloudflare Pages serves a styled 404 on unmatched URLs.
	prerender: ["/", "/about", "/blog", "/404", ...slugs.map((s) => `/blog/${s}`)],
} satisfies Config;
