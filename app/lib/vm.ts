// Project view-model: derives all display values (accent tile colors, status,
// category label, meta rows, screenshot slots) from a Project. Components stay
// presentational and read straight off the VM.

import { CATEGORIES, type IconType, type Project, STATUS } from "./consts";

export interface ProjectVM extends Project {
	/** Accent tile fill (per-category oklch). */
	tileBg: string;
	tileBorder: string;
	/** Icon glyph color. */
	glyph: string;
	stColor: string;
	stLabel: string;
	catLabel: string;
	/** Games have no star/lang stats. */
	isGame: boolean;
	showStars: boolean;
	starsTxt: string;
	langTxt: string;
	updTxt: string;
	hasLive: boolean;
	hasCode: boolean;
	hasLink: boolean;
	metaRows: { k: string; v: string }[];
	shotsArr: { key: number; label: string }[];
}

const catLabelOf = (id: string) =>
	CATEGORIES.find((c) => c.id === id)?.label ?? id;

/** Normalize a Project into its display view-model. */
export function toVM(p: Project): ProjectVM {
	const st = STATUS[p.status] ?? STATUS.live;
	const isGame = p.cat === "games";
	const catLabel = catLabelOf(p.cat);

	return {
		...p,
		tileBg: `oklch(0.62 0.14 ${p.hue} / 0.15)`,
		tileBorder: `oklch(0.66 0.14 ${p.hue} / 0.34)`,
		glyph: `oklch(0.78 0.13 ${p.hue})`,
		stColor: st.color,
		stLabel: st.label,
		catLabel,
		isGame,
		showStars: !isGame && p.stars != null,
		starsTxt: p.stars != null ? String(p.stars) : "",
		langTxt: p.lang ?? "",
		updTxt: isGame ? "Coming soon" : `Updated ${p.updated ?? ""}`,
		hasLive: !!p.live,
		hasCode: !!p.code,
		hasLink: !!p.link,
		metaRows: [
			{ k: "Category", v: catLabel },
			{ k: "Language", v: p.lang ?? "—" },
			{ k: "Stars", v: p.stars != null ? `★ ${p.stars}` : "—" },
			{
				k: isGame ? "Status" : "Updated",
				v: isGame ? "Coming soon" : (p.updated ?? "—"),
			},
		],
		shotsArr: Array.from({ length: p.shots || 3 }, (_, i) => ({
			key: i,
			label: `screen ${i + 1}`,
		})),
	};
}

/** Convenience: re-export the icon component type for tile renderers. */
export type { IconType };
