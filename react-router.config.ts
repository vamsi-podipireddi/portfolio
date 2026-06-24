import type { Config } from "@react-router/dev/config";

export default {
	// No server runtime: pure static output in build/client.
	ssr: false,
	// Pre-render routes to static HTML.
	// "/404" renders the catch-all; build script copies it to build/client/404.html
	// so Cloudflare Pages serves a styled 404 on unmatched URLs.
	prerender: ["/", "/404"],
} satisfies Config;
