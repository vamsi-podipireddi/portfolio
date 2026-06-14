// Central site data. Edit here to update the whole site.

export const SITE = "https://vamsikrishnapodipireddi.in";

export const SITE_TITLE = "Vamsi Krishna Podipireddi";
export const SITE_DESCRIPTION =
	"Engineer and builder. I make systems-y things — local AI, developer tooling, and interactive learning. Selected projects, with source and live links.";

export const AUTHOR = {
	name: "Vamsi Krishna Podipireddi",
	shortName: "Vamsi Krishna",
	role: "Engineer · Builder",
	// One-liner shown in the hero.
	tagline:
		"I build systems-y things — local AI, developer tooling, and interactive learning.",
	// Longer blurb for the About section.
	bio: [
		"I like building tools that make hard things tangible: an operating-systems playground you can poke until a race condition fires, a local-LLM pipeline that reads your inbox without anything leaving your machine, and small CLI niceties I use every day.",
		"Most of my work leans toward systems, local-first AI, and developer experience. Everything below ships with source — and a live link where it makes sense to click around.",
	],
	domain: "vamsikrishnapodipireddi.in",
	email: "podipireddivamsikrishna2001@gmail.com",
	github: "https://github.com/vamsi-podipireddi",
} as const;

export const SOCIALS = [
	{ name: "GitHub", href: AUTHOR.github, icon: "github" as const },
	{ name: "Email", href: `mailto:${AUTHOR.email}`, icon: "mail" as const },
];

export interface Project {
	name: string;
	/** Optional smaller word/script shown next to the name. */
	subtitle?: string;
	tagline: string;
	description: string;
	tags: string[];
	github?: string;
	live?: string;
	/** Emoji or short glyph for the card badge. */
	glyph: string;
	/** Two CSS colors used for the card's accent gradient. */
	accent: [string, string];
	featured?: boolean;
}

export const PROJECTS: Project[] = [
	{
		name: "OS Academy",
		tagline: "Learn operating systems by breaking them",
		description:
			"An interactive site for OS fundamentals — not a wall of text. You drive the algorithms: schedule processes, watch page faults happen, and trigger a race condition on purpose. Built as the hands-on companion to the “dinosaur book” and OSTEP.",
		tags: ["React", "TypeScript", "Vite", "Education"],
		github: "https://github.com/vamsi-podipireddi/brillant",
		live: "https://learn.vamsikrishnapodipireddi.in",
		glyph: "🖥️",
		accent: ["#7c5cff", "#22d3ee"],
		featured: true,
	},
	{
		name: "Lekha",
		subtitle: "लेखा",
		tagline: "Your inbox, in writing",
		description:
			"A personal productivity and financial-intelligence tool. It connects to Gmail and extracts structured insights — transactions, subscriptions, travel, events — with a local LLM (Ollama + Qwen 2.5). Push-based sync, privacy-first, self-hosted at near-zero cloud cost.",
		tags: ["Python", "FastAPI", "Local LLM", "Gmail API"],
		github: "https://github.com/vamsi-podipireddi/Lekha",
		glyph: "✉️",
		accent: ["#e879f9", "#7c5cff"],
		featured: true,
	},
	{
		name: "Old-Photo Restoration",
		tagline: "Fully offline restoration on AMD ROCm",
		description:
			"Private, 100% local old-photo restoration — no cloud, no external API. Face restore (GFPGAN / CodeFormer), upscale (Real-ESRGAN), colorize (DDColor), and de-scratch (LaMa), each isolated in its own venv, all running on a Radeon GPU via ROCm.",
		tags: ["Python", "PyTorch", "ROCm", "Computer Vision"],
		github: "https://github.com/vamsi-podipireddi/image-enhancement",
		glyph: "🖼️",
		accent: ["#22d3ee", "#34d399"],
	},
	{
		name: "Claude Code Statusline",
		tagline: "Everything at a glance, in one line",
		description:
			"A single-file, dependency-light statusline for Claude Code: model and effort, a two-tone context-window bar, and the same claude.ai plan-usage percentages with reset countdowns. Every segment degrades gracefully when its data is absent.",
		tags: ["Bash", "CLI", "Claude Code"],
		github: "https://github.com/vamsi-podipireddi/claude-code-statusline",
		glyph: "▍",
		accent: ["#f59e0b", "#e879f9"],
	},
];
