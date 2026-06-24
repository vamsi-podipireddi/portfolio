import type { MetaDescriptor } from "react-router";
import { SITE, SITE_TITLE } from "./consts";

interface SeoArgs {
	title: string;
	description: string;
	/** Route path, e.g. "/" or "/404". */
	path: string;
}

// Build a React Router meta descriptor array. Private launcher → noindex.
export function seo({ title, description, path }: SeoArgs): MetaDescriptor[] {
	const url = SITE + path;
	return [
		{ title },
		{ name: "description", content: description },
		{ name: "robots", content: "noindex, nofollow" },
		{ tagName: "link", rel: "canonical", href: url },

		{ property: "og:type", content: "website" },
		{ property: "og:url", content: url },
		{ property: "og:site_name", content: SITE_TITLE },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
	];
}
