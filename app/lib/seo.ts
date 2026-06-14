import type { MetaDescriptor } from "react-router";
import { AUTHOR, SITE, SITE_TITLE } from "./consts";

interface SeoArgs {
	title: string;
	description: string;
	/** Route path, e.g. "/about" or "/blog/hello". */
	path: string;
	/** Absolute URL or site-relative path. Defaults to /og.png. */
	image?: string;
	type?: "website" | "article";
	pubDate?: string;
	updatedDate?: string;
}

// Build a React Router meta descriptor array mirroring the old BaseHead.astro.
export function seo({
	title,
	description,
	path,
	image = "/og.png",
	type = "website",
	pubDate,
	updatedDate,
}: SeoArgs) {
	const url = SITE + path;
	const img = image.startsWith("http") ? image : SITE + image;

	const tags: MetaDescriptor[] = [
		{ title },
		{ name: "description", content: description },
		{ tagName: "link", rel: "canonical", href: url },

		{ property: "og:type", content: type },
		{ property: "og:url", content: url },
		{ property: "og:site_name", content: SITE_TITLE },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image", content: img },

		{ property: "twitter:card", content: "summary_large_image" },
		{ property: "twitter:url", content: url },
		{ property: "twitter:title", content: title },
		{ property: "twitter:description", content: description },
		{ property: "twitter:image", content: img },
	];

	if (type === "article" && pubDate) {
		tags.push({
			property: "article:published_time",
			content: new Date(pubDate).toISOString(),
		});
	}
	if (type === "article" && updatedDate) {
		tags.push({
			property: "article:modified_time",
			content: new Date(updatedDate).toISOString(),
		});
	}
	if (type === "article") {
		tags.push({ property: "article:author", content: AUTHOR.name });
	}

	return tags;
}
