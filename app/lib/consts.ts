// Central site data. Edit here to update the whole launcher.

import { Cpu, Image as ImageIcon, Inbox, SquareTerminal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// Any icon component: lucide-react icons and our inline brand icons both satisfy this.
export type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export const SITE = "https://vamsikrishnapodipireddi.in";

export const SITE_TITLE = "Projects";
export const SITE_DESCRIPTION = "Launcher for my projects — live apps and source.";

export interface Project {
	name: string;
	/** Optional smaller word/script shown next to the name. */
	subtitle?: string;
	tagline: string;
	tags: string[];
	github?: string;
	live?: string;
	/** Icon shown in the card badge — a lucide-react (or brand) icon component. */
	icon: IconType;
	/** Two CSS colors used for the card's accent gradient. */
	accent: [string, string];
	featured?: boolean;
}

export const PROJECTS: Project[] = [
	{
		name: "Scroll",
		tagline: "Learn systems concepts by breaking them",
		tags: ["React", "TypeScript", "Vite", "Education"],
		github: "https://github.com/vamsi-podipireddi/brillant",
		live: "https://scroll.vamsikrishnapodipireddi.in",
		icon: Cpu,
		accent: ["#7c5cff", "#22d3ee"],
		featured: true,
	},
	{
		name: "Lekha",
		subtitle: "लेखा",
		tagline: "Your inbox, in writing",
		tags: ["Python", "FastAPI", "Local LLM", "Gmail API"],
		github: "https://github.com/vamsi-podipireddi/Lekha",
		icon: Inbox,
		accent: ["#e879f9", "#7c5cff"],
		featured: true,
	},
	{
		name: "Old-Photo Restoration",
		tagline: "Fully offline restoration on AMD ROCm",
		tags: ["Python", "PyTorch", "ROCm", "Computer Vision"],
		github: "https://github.com/vamsi-podipireddi/image-enhancement",
		icon: ImageIcon,
		accent: ["#22d3ee", "#34d399"],
	},
	{
		name: "Claude Code Statusline",
		tagline: "Everything at a glance, in one line",
		tags: ["Bash", "CLI", "Claude Code"],
		github: "https://github.com/vamsi-podipireddi/claude-code-statusline",
		icon: SquareTerminal,
		accent: ["#f59e0b", "#e879f9"],
	},
];
