// Central site data. Edit here to update the whole portfolio.

import { Flame, Gauge, Grid3x3, Hexagon, Image as ImageIcon, Inbox, SquareTerminal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { ScrollIcon } from "../components/ScrollIcon";
import { TrumpIcon } from "../components/TrumpIcon";

// Any icon component: lucide-react icons and our inline brand icons both satisfy this.
export type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export const SITE = "https://vamsikrishnapodipireddi.in";

export const SITE_TITLE = "Vamsi's Arcade";
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
	updated?: string;
	live?: string;
	code?: string;
	/** Reference link (e.g. a stand-in arcade title). */
	link?: string;
	/** Number of screenshot slots in the gallery (fallback placeholders). */
	shots: number;
	/** Real gallery screenshots, served from /public (e.g. "/shots/x.png"). */
	shotImgs?: string[];
	/** Alt text per screenshot, index-aligned with shotImgs. */
	shotAlts?: string[];
	/** Glossy brand app-icon tile override, built from design tokens. */
	brandTile?: { bg: string; border: string; glyph: string };
}

export const PROJECTS: Project[] = [
	{
		id: "scroll",
		name: "Scroll",
		cat: "apps",
		hue: 250,
		icon: ScrollIcon,
		status: "live",
		featured: true,
		isNew: true,
		pitch: "Learn systems concepts by breaking them.",
		desc: "Scroll turns abstract systems ideas into things you can poke at. Trip a failure, tune a knob, and watch the trade-offs play out in real time — the kind of intuition that usually only comes from breaking production.",
		tags: ["React", "TypeScript", "Vite"],
		lang: "TypeScript",
		updated: "2w",
		live: "https://scroll.vamsikrishnapodipireddi.in",
		code: "https://github.com/vamsi-podipireddi/brillant",
		shots: 3,
		shotImgs: [
			"/shots/scroll-1.png",
			"/shots/scroll-2.png",
			"/shots/scroll-3.png",
			"/shots/scroll-4.png",
		],
		shotAlts: [
			"Scroll — the library shelf, books grouped by topic",
			"Scroll — grid view of the full book library",
			"Scroll — chapter list for Operating System Concepts",
			"Scroll — an interactive chapter with live visualizations",
		],
		// Scroll's real app-logo palette (brand violet — the site tokens are
		// monochrome on this branch, so the brand color is intentionally literal,
		// matching the ScrollTrailer <Logo> and the app's actual icon).
		brandTile: {
			bg: "radial-gradient(120% 110% at 72% 6%, rgba(94,106,210,0.5), transparent 60%), linear-gradient(165deg, #23284a, #0c0e16)",
			border: "rgba(94,106,210,0.45)",
			glyph: "#aab2f6",
		},
	},
	{
		id: "trump",
		name: "Trump",
		cat: "games",
		hue: 60,
		icon: TrumpIcon,
		status: "live",
		isNew: true,
		pitch: "Bid, call a secret partner, take the tricks.",
		desc: "A real-time multiplayer trick-taking card game for 2-4 players -- AI fills any empty seats. Bid for points, name the trump suit, then call a card to reveal a secret partner; the first side to capture its bid across five deals takes the match. Jump in from anywhere with a room code.",
		tags: ["Cards", "Multiplayer", "WebSockets"],
		lang: "JavaScript",
		live: "https://game.trump.vamsikrishnapodipireddi.in",
		code: "https://github.com/vamsi-podipireddi/trump-multiplayer",
		shots: 2,
		// Trump's felt-and-gold app-icon look (a single gold spade on emerald felt
		// with a top-right gold sheen). Literal brand hex is intentional — this
		// branch's tokens are monochrome, so the brand colour lives here, matching
		// the TrumpTrailer palette and the app's actual icon.
		brandTile: {
			bg: "radial-gradient(125% 110% at 72% 6%, rgba(230,180,80,0.45), transparent 60%), linear-gradient(165deg, #0e3d2c, #08120e)",
			border: "rgba(230,180,80,0.45)",
			glyph: "#e6b450",
		},
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
		updated: "1w",
		code: "https://github.com/vamsi-podipireddi/claude-code-statusline",
		shots: 2,
	},
	{
		id: "hextris",
		name: "Hextris",
		cat: "games",
		hue: 60,
		icon: Hexagon,
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
		icon: Grid3x3,
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
		icon: Gauge,
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
		icon: Flame,
		status: "soon",
		pitch: "A minimalist text adventure.",
		desc: "A reference build queued up for the arcade — a quiet, text-first survival game that slowly unfolds. Stand-in link for now; my own take is on the way.",
		tags: ["Text", "Incremental"],
		lang: "Text",
		link: "https://adarkroom.doublespeakgames.com/",
		shots: 2,
	},
];
