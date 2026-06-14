import type { ComponentType } from "react";

interface PostFrontmatter {
	title: string;
	description: string;
	pubDate: string;
	updatedDate?: string;
	heroImage?: string;
	heroImageAlt?: string;
}

declare module "*.mdx" {
	export const frontmatter: PostFrontmatter;
	const Component: ComponentType;
	export default Component;
}

declare module "*.md" {
	export const frontmatter: PostFrontmatter;
	const Component: ComponentType;
	export default Component;
}
