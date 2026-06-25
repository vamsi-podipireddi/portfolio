// Central site data. Edit here to update the whole portfolio.

import { Cpu, Gamepad2, Image as ImageIcon, Inbox, SquareTerminal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// Any icon component: lucide-react icons and our inline brand icons both satisfy this.
export type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export const SITE = "https://vamsikrishnapodipireddi.in";

export const SITE_TITLE = "Vamsi Podipireddi — Projects";
export const SITE_DESCRIPTION =
	"An app-store of the small, sharp tools and learning experiences I build.";

// ---- profile ------------------------------------------------------------
export const PROFILE = {
	name: "Vamsi Podipireddi",
	tagline:
		"I build small, sharp tools and learning experiences — things you can poke at, break, and actually understand.",
	github: "https://github.com/vamsi-podipireddi",
	site: SITE,
	building: "A browser games arcade — first titles landing soon.",
	buildingShort: "Building an arcade",
};

// ---- taxonomy -----------------------------------------------------------
export type CategoryId = "all" | "apps" | "aiml" | "tools" | "games";

export interface Category {
	id: CategoryId;
	label: string;
	/** oklch hue used for per-category accent tiles. */
	hue: number;
}

export const CATEGORIES: Category[] = [
	{ id: "all", label: "All", hue: 0 },
	{ id: "apps", label: "Apps", hue: 250 },
	{ id: "aiml", label: "AI / ML", hue: 300 },
	{ id: "tools", label: "Tools", hue: 150 },
	{ id: "games", label: "Games", hue: 60 },
];

export type StatusId = "live" | "wip" | "soon" | "archived";

export interface Status {
	label: string;
	color: string;
}

export const STATUS: Record<StatusId, Status> = {
	live: { label: "Live", color: "oklch(0.74 0.15 150)" },
	wip: { label: "WIP", color: "oklch(0.8 0.14 85)" },
	soon: { label: "Coming soon", color: "oklch(0.72 0.13 255)" },
	archived: { label: "Archived", color: "#6a6f77" },
};

// ---- projects -----------------------------------------------------------
export interface Project {
	id: string;
	name: string;
	cat: Exclude<CategoryId, "all">;
	/** oklch hue for the accent tile (mirrors the category hue). */
	hue: number;
	/** Icon shown in the card badge — a lucide-react (or brand) icon component. */
	icon: IconType;
	status: StatusId;
	featured?: boolean;
	isNew?: boolean;
	/** One-line hook. */
	pitch: string;
	/** Longer description for the detail view. */
	desc: string;
	tags: string[];
	lang?: string;
	stars?: number;
	updated?: string;
	live?: string;
	code?: string;
	/** Reference link (e.g. a stand-in arcade title). */
	link?: string;
	/** Number of screenshot slots in the gallery. */
	shots: number;
}

export const PROJECTS: Project[] = [
	{
		id: "scroll",
		name: "Scroll",
		cat: "apps",
		hue: 250,
		icon: Cpu,
		status: "live",
		featured: true,
		isNew: true,
		pitch: "Learn systems concepts by breaking them.",
		desc: "Scroll turns abstract systems ideas into things you can poke at. Trip a failure, tune a knob, and watch the trade-offs play out in real time — the kind of intuition that usually only comes from breaking production.",
		tags: ["React", "TypeScript", "Vite"],
		lang: "TypeScript",
		stars: 48,
		updated: "2w",
		live: "https://scroll.vamsikrishnapodipireddi.in",
		code: "https://github.com/vamsi-podipireddi/brillant",
		shots: 3,
	},
	{
		id: "lekha",
		name: "Lekha",
		cat: "aiml",
		hue: 300,
		icon: Inbox,
		status: "wip",
		isNew: true,
		pitch: "Your inbox, in writing.",
		desc: "Lekha reads your inbox with a fully local model and writes back clean, plain-language summaries. No cloud, no data leaving your machine — just your mail, distilled.",
		tags: ["Python", "FastAPI", "Local LLM"],
		lang: "Python",
		stars: 31,
		updated: "5d",
		code: "https://github.com/vamsi-podipireddi/Lekha",
		shots: 3,
	},
	{
		id: "oldphoto",
		name: "Old-Photo Restoration",
		cat: "aiml",
		hue: 300,
		icon: ImageIcon,
		status: "live",
		isNew: true,
		pitch: "Fully offline restoration on AMD ROCm.",
		desc: "An offline pipeline that de-noises, upscales, and repairs old photographs end to end on AMD ROCm. No internet, no uploads — your memories never leave the room.",
		tags: ["PyTorch", "ROCm", "Computer Vision"],
		lang: "Python",
		stars: 22,
		updated: "1mo",
		code: "https://github.com/vamsi-podipireddi/image-enhancement",
		shots: 3,
	},
	{
		id: "statusline",
		name: "Claude Code Statusline",
		cat: "tools",
		hue: 150,
		icon: SquareTerminal,
		status: "live",
		isNew: true,
		pitch: "Everything at a glance, in one line.",
		desc: "A configurable status line for Claude Code that surfaces model, token usage, cost, and git state in a single tidy row — so you always know where a session stands.",
		tags: ["Bash", "CLI", "Claude Code"],
		lang: "Shell",
		stars: 64,
		updated: "1w",
		code: "https://github.com/vamsi-podipireddi/claude-code-statusline",
		shots: 2,
	},
	{
		id: "hextris",
		name: "Hextris",
		cat: "games",
		hue: 60,
		icon: Gamepad2,
		status: "soon",
		pitch: "Fast, hexagonal puzzle action.",
		desc: "A reference build queued up for the arcade — a frantic spin on falling-block puzzles around a central hexagon. Stand-in link for now; my own take is on the way.",
		tags: ["Puzzle", "WebGL"],
		lang: "Puzzle",
		link: "https://hextris.io/",
		shots: 2,
	},
	{
		id: "g2048",
		name: "2048",
		cat: "games",
		hue: 60,
		icon: Gamepad2,
		status: "soon",
		pitch: "Slide, merge, chase the tile.",
		desc: "A reference build queued up for the arcade — the classic sliding-tile number game. Stand-in link for now; my own take is on the way.",
		tags: ["Puzzle", "Web"],
		lang: "Puzzle",
		link: "https://play2048.co/",
		shots: 2,
	},
	{
		id: "hexgl",
		name: "HexGL",
		cat: "games",
		hue: 60,
		icon: Gamepad2,
		status: "soon",
		pitch: "Futuristic WebGL racing.",
		desc: "A reference build queued up for the arcade — a fast, neon WebGL racer built on three.js. Stand-in link for now; my own take is on the way.",
		tags: ["Racing", "WebGL", "three.js"],
		lang: "Racing",
		link: "https://hexgl.bkcore.com/",
		shots: 2,
	},
	{
		id: "darkroom",
		name: "A Dark Room",
		cat: "games",
		hue: 60,
		icon: Gamepad2,
		status: "soon",
		pitch: "A minimalist text adventure.",
		desc: "A reference build queued up for the arcade — a quiet, text-first survival game that slowly unfolds. Stand-in link for now; my own take is on the way.",
		tags: ["Text", "Incremental"],
		lang: "Text",
		link: "https://adarkroom.doublespeakgames.com/",
		shots: 2,
	},
];
