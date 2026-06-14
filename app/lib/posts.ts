import type { ComponentType } from "react";

export interface PostFrontmatter {
	title: string;
	description: string;
	pubDate: string;
	updatedDate?: string;
	heroImage?: string;
	heroImageAlt?: string;
}

interface PostModule {
	default: ComponentType;
	frontmatter: PostFrontmatter;
}

export interface Post {
	slug: string;
	frontmatter: PostFrontmatter;
	Component: ComponentType;
}

// Eagerly bundle every post. Vite inlines these at build → no runtime fetch.
const modules = import.meta.glob<PostModule>("../content/blog/*.{md,mdx}", {
	eager: true,
});

export const posts: Post[] = Object.entries(modules)
	.map(([path, mod]) => ({
		slug: path.split("/").pop()!.replace(/\.mdx?$/, ""),
		frontmatter: mod.frontmatter,
		Component: mod.default,
	}))
	.sort(
		(a, b) =>
			new Date(b.frontmatter.pubDate).valueOf() -
			new Date(a.frontmatter.pubDate).valueOf(),
	);

export function getPost(slug: string): Post | undefined {
	return posts.find((p) => p.slug === slug);
}
