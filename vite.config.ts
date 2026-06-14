import { reactRouter } from "@react-router/dev/vite";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		// MDX must run before the React Router plugin.
		mdx({
			include: ["**/*.md", "**/*.mdx"],
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
			rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
		}),
		reactRouter(),
	],
});
