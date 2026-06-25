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
	/** Games have no lang stats. */
	isGame: boolean;
	langTxt: string;
	updTxt: string;
	hasLive: boolean;
	hasCode: boolean;
	hasLink: boolean;
	metaRows: { k: string; v: string }[];
	shotsArr: { key: number; label: string; src?: string; alt?: string }[];
	/** Gradient backdrop for the card icon slot (brand tile, or hue-derived). */
	shotBg: string;
}

const catLabelOf = (id: string) =>
	CATEGORIES.find((c) => c.id === id)?.label ?? id;

/** Stable per-id seed so same-hue cards don't render identical gradients. */
const seedOf = (id: string) =>
	[...id].reduce((a, c) => a + c.charCodeAt(0), 0);

/** Hue-derived glossy tile gradient, jittered by seed (angle/glow pos/hue). */
const hueShot = (hue: number, seed: number) => {
	const ang = 150 + (seed % 50); // 150–199deg
	const px = 60 + (seed % 30); // glow x: 60–89%
	const py = 4 + (seed % 12); // glow y: 4–15%
	const h = hue + ((seed % 36) - 18); // ±18 hue jitter
	return `radial-gradient(120% 110% at ${px}% ${py}%, oklch(0.62 0.13 ${h} / 0.4), transparent 62%), linear-gradient(${ang}deg, oklch(0.27 0.06 ${h}), oklch(0.15 0.03 ${h}))`;
};

/** Normalize a Project into its display view-model. */
export function toVM(p: Project): ProjectVM {
	const st = STATUS[p.status] ?? STATUS.live;
	const isGame = p.cat === "games";
	const catLabel = catLabelOf(p.cat);

	return {
		...p,
		// A brand tile (set per project) wins over the hue-derived defaults so an
		// app can wear its real glossy app-icon look.
		tileBg: p.brandTile?.bg ?? `oklch(0.62 0.14 ${p.hue} / 0.15)`,
		tileBorder: p.brandTile?.border ?? `oklch(0.66 0.14 ${p.hue} / 0.34)`,
		glyph: p.brandTile?.glyph ?? `oklch(0.78 0.13 ${p.hue})`,
		// Card icon slot backdrop: a project's brand gradient when it has one, else
		// a hue-derived glow + deep wash mirroring the brandTile recipe. The seed
		// jitters angle/glow-position/hue per id so two same-category cards (e.g.
		// Lekha & Old-Photo, both hue 300) never read as identical twins.
		shotBg: p.brandTile?.bg ?? hueShot(p.hue, seedOf(p.id)),
		stColor: st.color,
		stLabel: st.label,
		catLabel,
		isGame,
		langTxt: p.lang ?? "",
		// Games surface their real status label (e.g. "Live" / "Coming soon")
		// instead of a hardcoded "Coming soon"; non-games still read "Updated …".
		updTxt: isGame ? st.label : `Updated ${p.updated ?? ""}`,
		hasLive: !!p.live,
		hasCode: !!p.code,
		hasLink: !!p.link,
		metaRows: [
			{ k: "Category", v: catLabel },
			{ k: "Language", v: p.lang ?? "—" },
			{
				k: isGame ? "Status" : "Updated",
				v: isGame ? st.label : (p.updated ?? "—"),
			},
		],
		// Prefer real screenshots when supplied; else fall back to placeholder slots.
		shotsArr: p.shotImgs?.length
			? p.shotImgs.map((img, i) => ({
					key: i,
					label: `screen ${i + 1}`,
					src: img,
					alt: p.shotAlts?.[i] ?? `screen ${i + 1}`,
				}))
			: Array.from({ length: p.shots || 3 }, (_, i) => ({
					key: i,
					label: `screen ${i + 1}`,
				})),
	};
}

/** Convenience: re-export the icon component type for tile renderers. */
export type { IconType };
