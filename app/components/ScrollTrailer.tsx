import { Maximize, Minimize, Pause, Play } from "lucide-react";
import {
	createContext,
	createElement,
	Fragment,
	type ReactElement,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import "./ScrollTrailer.css";

/*
 * Scroll brand trailer — a self-contained promotional animation for the Scroll
 * project, ported from a Claude Design `.dc.html` (dc-runtime) into a native
 * React component. The scene code is transcribed verbatim via createElement to
 * preserve the original motion exactly; only the dc-runtime dependency is
 * replaced with the tiny timeline shim below (Easing / animate / clamp / Sprite
 * + a requestAnimationFrame driver). Decorative throughout — see ScrollTrailer.
 *
 * `h` is createElement loosened to `any` props: the scenes carry hundreds of
 * inline style declarations whose exact shape we want to keep untouched, so we
 * opt this one ported-art module out of per-style typing rather than annotate
 * each literal. Confined to this file.
 */
const h = createElement as (
	type: unknown,
	props?: unknown,
	...children: unknown[]
) => ReactElement;

const W = 1280;
const H = 720;
const DUR = 24;

// ── timeline shim (replaces the dc-runtime globals) ─────────────────────────
const TimeCtx = createContext(0);
const useTime = () => useContext(TimeCtx);

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const Easing = {
	easeOutCubic: (t: number) => {
		const u = t - 1;
		return u * u * u + 1;
	},
	easeOutBack: (t: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
	},
	easeInOutCubic: (t: number) =>
		t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

function animate({
	from = 0,
	to = 1,
	start = 0,
	end = 1,
	ease = Easing.easeInOutCubic,
}: {
	from?: number;
	to?: number;
	start?: number;
	end?: number;
	ease?: (t: number) => number;
}) {
	return (t: number) => {
		if (t <= start) return from;
		if (t >= end) return to;
		return from + (to - from) * ease((t - start) / (end - start));
	};
}

/** Renders its child only while the playhead is inside [start, end]. */
function Sprite({
	start,
	end,
	children,
}: {
	start: number;
	end: number;
	children: ReactNode;
}) {
	const t = useTime();
	if (t < start || t > end) return null;
	return h(Fragment, null, children);
}

// ── palette / type / data ───────────────────────────────────────────────────
const C = {
	bg: "#08090a",
	bgSoft: "#0d0e10",
	panel: "#141517",
	panel2: "#1b1d21",
	border: "rgba(255,255,255,.10)",
	borderSoft: "rgba(255,255,255,.06)",
	text: "#f7f8f8",
	muted: "#8a8f98",
	faint: "#62666d",
	accent: "#5e6ad2",
	accentHi: "#6b76e0",
};
// Inter Tight / JetBrains Mono fall back to the site's loaded Inter / Geist Mono.
const IT = "'Inter Tight',Inter,system-ui,sans-serif";
const MO = "'JetBrains Mono','Geist Mono',ui-monospace,monospace";

const BOOKS = [
	{ short: "OS Concepts", accent: "#8b6fde", rgb: "139,111,222", h: 244 },
	{ short: "DDIA", accent: "#e87c3a", rgb: "232,124,58", h: 284 },
	{ short: "DB Internals", accent: "#2dd4bf", rgb: "45,212,191", h: 264 },
	{ short: "LLD", accent: "#4b8ef8", rgb: "75,142,248", h: 224 },
	{ short: "OOP C++", accent: "#d87ee5", rgb: "216,126,229", h: 204 },
	{ short: "System Design", accent: "#34d3a0", rgb: "52,211,160", h: 254 },
	{ short: "Backend Eng", accent: "#f5a623", rgb: "245,166,35", h: 238 },
];

// Per-book spine glyph (matches the updated design). Lucide-style inline SVGs
// kept verbatim from the source art so the spine icons read identically.
const spineIcon = (i: number) => {
	const s = {
		width: 18,
		height: 18,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
	};
	const icons = [
		h("svg", s, h("rect", { x: 2, y: 3, width: 20, height: 14, rx: 2 }), h("path", { d: "M8 21h8M12 17v4" })),
		h(
			"svg",
			s,
			h("ellipse", { cx: 12, cy: 5, rx: 9, ry: 3 }),
			h("path", { d: "M21 5v14c0 1.66-4.03 3-9 3S3 20.66 3 19V5" }),
			h("path", { d: "M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" }),
		),
		h(
			"svg",
			s,
			h("circle", { cx: 12, cy: 12, r: 3 }),
			h("path", {
				d: "M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83",
			}),
		),
		h(
			"svg",
			s,
			h("path", { d: "M12 2L2 7l10 5 10-5-10-5z" }),
			h("path", { d: "M2 17l10 5 10-5M2 12l10 5 10-5" }),
		),
		h("svg", s, h("polyline", { points: "16 18 22 12 16 6" }), h("polyline", { points: "8 6 2 12 8 18" })),
		h(
			"svg",
			s,
			h("circle", { cx: 18, cy: 5, r: 3 }),
			h("circle", { cx: 6, cy: 12, r: 3 }),
			h("circle", { cx: 18, cy: 19, r: 3 }),
			h("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
			h("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" }),
		),
		h(
			"svg",
			s,
			h("rect", { x: 2, y: 2, width: 20, height: 8, rx: 2 }),
			h("rect", { x: 2, y: 14, width: 20, height: 8, rx: 2 }),
			h("circle", { cx: 6, cy: 6, r: 1 }),
			h("circle", { cx: 6, cy: 18, r: 1 }),
		),
	];
	return icons[i % icons.length];
};

// ── shared pieces ────────────────────────────────────────────────────────────
const BookSvg = (sz: number) =>
	h(
		"svg",
		{
			width: sz,
			height: sz,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 2,
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		h("path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }),
		h("path", {
			d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
		}),
	);

const Logo = ({ sz, glow }: { sz: number; glow?: boolean }) =>
	h(
		"div",
		{
			style: {
				width: sz,
				height: sz,
				borderRadius: sz * 0.29,
				background:
					"radial-gradient(125% 110% at 72% 6%,rgba(94,106,210,.5),transparent 60%),linear-gradient(165deg,#23284a,#0c0e16)",
				border: "1px solid rgba(94,106,210,.45)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#aab2f6",
				boxShadow: glow ? `0 3px ${Math.round(sz * 0.55)}px rgba(94,106,210,.42)` : "none",
			},
		},
		BookSvg(sz * 0.54),
	);

const Glow = () =>
	h("div", {
		style: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
			background:
				"radial-gradient(60% 50% at 82% -5%,rgba(94,106,210,.12),transparent 70%),radial-gradient(50% 45% at -5% 100%,rgba(94,106,210,.07),transparent 70%)",
		},
	});

const TopBar = () =>
	h(
		"div",
		{
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: 56,
				zIndex: 10,
				background: "rgba(8,9,10,.88)",
				backdropFilter: "blur(16px)",
				WebkitBackdropFilter: "blur(16px)",
				borderBottom: `1px solid ${C.borderSoft}`,
				display: "flex",
				alignItems: "center",
				padding: "0 28px",
				gap: 16,
			},
		},
		h(
			"div",
			{ style: { display: "flex", alignItems: "center", gap: 10 } },
			h(Logo, { sz: 31, glow: false }),
			h(
				"div",
				{ style: { lineHeight: 1 } },
				h(
					"div",
					{
						style: {
							fontFamily: IT,
							fontSize: 17,
							fontWeight: 800,
							letterSpacing: "-.02em",
							color: C.text,
						},
					},
					"Scroll",
				),
				h(
					"div",
					{
						style: {
							fontFamily: MO,
							fontSize: 9.5,
							letterSpacing: ".16em",
							textTransform: "uppercase",
							color: C.faint,
							marginTop: 3,
						},
					},
					"interactive library",
				),
			),
		),
		h(
			"div",
			{
				style: {
					flex: "0 1 280px",
					marginLeft: 8,
					background: C.bgSoft,
					border: "1px solid rgba(255,255,255,.08)",
					borderRadius: 9,
					padding: "8px 12px 8px 34px",
					fontFamily: "Inter",
					fontSize: 13,
					color: C.faint,
					position: "relative",
				},
			},
			h(
				"span",
				{
					style: {
						position: "absolute",
						left: 11,
						top: "50%",
						transform: "translateY(-50%)",
						color: C.faint,
					},
				},
				h(
					"svg",
					{ width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 },
					h("circle", { cx: 11, cy: 11, r: 8 }),
					h("path", { d: "m21 21-4.3-4.3" }),
				),
			),
			"Search the library…",
		),
		h("div", { style: { flex: 1 } }),
		h(
			"div",
			{ style: { display: "flex", alignItems: "center", gap: 10 } },
			h(
				"div",
				{ style: { width: 110, height: 6, borderRadius: 6, background: C.panel2, overflow: "hidden" } },
				h("div", {
					style: { height: "100%", width: "12%", background: `linear-gradient(90deg,${C.accent},${C.accentHi})` },
				}),
			),
			h(
				"span",
				{ style: { fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: C.muted } },
				"23 / 185",
			),
		),
		h(
			"div",
			{
				style: {
					display: "inline-flex",
					gap: 4,
					padding: 4,
					background: C.bgSoft,
					border: `1px solid ${C.borderSoft}`,
					borderRadius: 10,
				},
			},
			h(
				"div",
				{
					style: {
						fontFamily: "Inter",
						fontSize: 13,
						fontWeight: 600,
						padding: "7px 13px",
						borderRadius: 7,
						background: C.panel2,
						color: C.text,
						boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)",
					},
				},
				"Stacks",
			),
			h(
				"div",
				{
					style: {
						fontFamily: "Inter",
						fontSize: 13,
						fontWeight: 600,
						padding: "7px 13px",
						borderRadius: 7,
						background: "transparent",
						color: C.muted,
					},
				},
				"Grid",
			),
		),
	);

const BNode = ({
	label,
	cx,
	cy,
	op,
	hl,
}: {
	label: string;
	cx: number;
	cy: number;
	op: number;
	hl?: number;
}) =>
	h(
		"div",
		{
			style: {
				position: "absolute",
				left: cx,
				top: cy,
				zIndex: 2,
				transform: `translate(-50%,-50%) scale(${0.55 + op * 0.45})`,
				opacity: op,
				width: 72,
				height: 40,
				borderRadius: 8,
				background: (hl || 0) > 0.1 ? `rgba(94,106,210,${0.12 + (hl || 0) * 0.2})` : C.panel2,
				border: `1.5px solid ${(hl || 0) > 0.1 ? `rgba(94,106,210,${0.5 + (hl || 0) * 0.5})` : "rgba(255,255,255,.12)"}`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: MO,
				fontSize: 15,
				fontWeight: 700,
				color: (hl || 0) > 0.1 ? "#aab2f6" : C.text,
				boxShadow: (hl || 0) > 0.1 ? `0 0 0 3px rgba(94,106,210,${(hl || 0) * 0.22})` : "none",
			},
		},
		label,
	);

// ── Scene 1: Title (0–4.5s) ──────────────────────────────────────────────────
const TitleScene = () => {
	const t = useTime();
	const eIn = Easing.easeOutCubic(clamp(t / 0.9, 0, 1));
	const eOut = t > 3.5 ? clamp((t - 3.5) / 0.55, 0, 1) : 0;
	const logoS = Easing.easeOutBack(clamp(t / 0.75, 0, 1));
	return h(
		"div",
		{
			style: {
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				opacity: eIn * (1 - eOut),
				transform: `translateY(${(1 - eIn) * 22}px)`,
			},
		},
		h("div", {
			style: {
				position: "absolute",
				inset: 0,
				background: "radial-gradient(44% 44% at 50% 50%,rgba(94,106,210,.11),transparent)",
				pointerEvents: "none",
			},
		}),
		h("div", { style: { transform: `scale(${logoS})`, marginBottom: 22 } }, h(Logo, { sz: 58, glow: true })),
		h(
			"div",
			{ style: { fontFamily: IT, fontSize: 80, fontWeight: 800, letterSpacing: "-.04em", color: C.text, lineHeight: 1 } },
			"Scroll",
		),
		h(
			"div",
			{
				style: {
					marginTop: 18,
					fontFamily: MO,
					fontSize: 12,
					letterSpacing: ".22em",
					textTransform: "uppercase",
					color: C.muted,
					display: "flex",
					alignItems: "center",
					gap: 14,
				},
			},
			h("span", { style: { width: 20, height: 1, background: C.accent, display: "inline-block" } }),
			"Interactive Computer Science",
			h("span", { style: { width: 20, height: 1, background: C.accent, display: "inline-block" } }),
		),
	);
};

// ── Scene 2: Library Stacks (3.8–13.5s) ──────────────────────────────────────
const LibraryScene = () => {
	const t = useTime();
	const mIn = Easing.easeOutCubic(clamp((t - 4) / 1.0, 0, 1));
	const mOut = t > 12.3 ? clamp((t - 12.3) / 0.8, 0, 1) : 0;
	const barOp = clamp((t - 4) / 0.8, 0, 1);
	const headOp = Easing.easeOutCubic(clamp((t - 4.3) / 1.0, 0, 1));
	const ddiaLift = animate({ from: 0, to: 1, start: 10.0, end: 11.0, ease: Easing.easeOutBack })(t);
	const cOp =
		animate({ from: 0, to: 1, start: 8.8, end: 9.3 })(t) *
		(t < 12 ? 1 : animate({ from: 1, to: 0, start: 12, end: 12.6 })(t));
	const cX = animate({ from: 900, to: 220, start: 9.2, end: 10.4, ease: Easing.easeInOutCubic })(t);
	const cY = animate({ from: 620, to: 420, start: 9.2, end: 10.4, ease: Easing.easeInOutCubic })(t);

	const spines = BOOKS.map((bk, i) => {
		const p = Easing.easeOutCubic(clamp((t - (4.8 + i * 0.13)) / 0.65, 0, 1));
		const isDDIA = i === 1;
		const lift = isDDIA ? ddiaLift * -26 : 0;
		const shad =
			isDDIA && ddiaLift > 0.05
				? `0 ${16 + ddiaLift * 28}px ${28 + ddiaLift * 28}px -12px rgba(0,0,0,.9),inset -5px 0 9px rgba(0,0,0,.34),inset 4px 0 5px rgba(255,255,255,.13),0 0 0 1px rgba(255,255,255,.16)`
				: "0 16px 26px -14px rgba(0,0,0,.8),inset -5px 0 9px rgba(0,0,0,.34),inset 4px 0 5px rgba(255,255,255,.10)";
		return h(
			"div",
			{
				key: i,
				style: {
					flex: "none",
					width: 62,
					height: bk.h,
					borderRadius: "3px 4px 3px 2px",
					background: `linear-gradient(180deg,rgba(${bk.rgb},.28) 0%,rgba(${bk.rgb},.08) 52%,rgba(0,0,0,0) 100%),#09090d`,
					boxShadow: shad,
					cursor: "pointer",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "14px 0 14px",
					opacity: p,
					transform: `translateY(${(1 - p) * 52 + lift}px)`,
				},
			},
			h(
				"div",
				{
					style: {
						width: 34,
						height: 34,
						borderRadius: 9,
						background: `rgba(${bk.rgb},.13)`,
						border: `1px solid rgba(${bk.rgb},.38)`,
						boxShadow: `0 0 16px rgba(${bk.rgb},.26),inset 0 1px 0 rgba(255,255,255,.07)`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: bk.accent,
						flexShrink: 0,
					},
				},
				spineIcon(i),
			),
			h(
				"div",
				{
					style: {
						writingMode: "vertical-rl",
						transform: "rotate(180deg)",
						fontFamily: IT,
						fontSize: 14,
						fontWeight: 700,
						letterSpacing: "-.01em",
						color: "#f7f8f8",
						flex: 1,
						textAlign: "center",
						padding: "10px 0",
						maxHeight: 180,
						overflow: "hidden",
						textShadow: "0 1px 3px rgba(0,0,0,.5)",
					},
				},
				bk.short,
			),
			h(
				"div",
				{ style: { width: 28, height: 4, borderRadius: 4, background: "rgba(255,255,255,.1)", overflow: "hidden" } },
				h("div", { style: { height: "100%", width: `${7 + i * 9}%`, background: bk.accent } }),
			),
		);
	});

	return h(
		"div",
		{ style: { position: "absolute", inset: 0, background: C.bg, opacity: mIn * (1 - mOut) } },
		h(Glow, null),
		h("div", { style: { opacity: barOp } }, h(TopBar, null)),
		h(
			"div",
			{
				style: {
					position: "absolute",
					top: 76,
					left: 48,
					opacity: headOp,
					transform: `translateY(${(1 - headOp) * 14}px)`,
				},
			},
			h(
				"div",
				{
					style: {
						fontFamily: MO,
						fontSize: 11,
						letterSpacing: ".18em",
						textTransform: "uppercase",
						color: C.muted,
						display: "flex",
						alignItems: "center",
						gap: 9,
						marginBottom: 12,
					},
				},
				h("span", { style: { width: 16, height: 1, background: C.accent, display: "inline-block" } }),
				"The Shelf",
			),
			h(
				"div",
				{
					style: {
						fontFamily: IT,
						fontSize: 36,
						fontWeight: 800,
						letterSpacing: "-.033em",
						color: C.text,
						lineHeight: 1.08,
					},
				},
				"Don't read the classics — ",
				h("span", { style: { color: C.accent } }, "drive"),
				" them.",
			),
		),
		h(
			"div",
			{ style: { position: "absolute", bottom: 60, left: 0, right: 0, padding: "0 90px" } },
			h("div", { style: { display: "flex", alignItems: "flex-end", gap: 26, paddingLeft: 10 } }, ...spines),
			h("div", {
				style: {
					height: 15,
					borderRadius: 3,
					background: "linear-gradient(#22242a,#15171a)",
					boxShadow: "0 16px 30px -16px rgba(0,0,0,.95),inset 0 1px 0 rgba(255,255,255,.06)",
				},
			}),
			h("div", {
				style: {
					height: 20,
					borderRadius: "0 0 10px 10px",
					background: "linear-gradient(rgba(0,0,0,.4),transparent)",
					margin: "0 16px",
				},
			}),
		),
		h(
			"div",
			{
				style: {
					position: "absolute",
					left: cX,
					top: cY,
					opacity: cOp,
					pointerEvents: "none",
					zIndex: 20,
					filter: "drop-shadow(0 2px 5px rgba(0,0,0,.7))",
				},
			},
			h(
				"svg",
				{ width: 26, height: 26, viewBox: "0 0 26 26" },
				h("path", {
					d: "M6 2l14 10-7 1-4 8z",
					fill: "white",
					stroke: "rgba(0,0,0,.22)",
					strokeWidth: "1.5",
					strokeLinejoin: "round",
				}),
			),
		),
	);
};

// ── Scene 3: Chapter + B-tree (12.5–20.2s) ───────────────────────────────────
const ChapterScene = () => {
	const t = useTime();
	const eIn = animate({ from: 0, to: 1, start: 13.0, end: 14.0 })(t);
	const eOut = t > 19.0 ? animate({ from: 1, to: 0, start: 19.0, end: 19.8 })(t) : 1;
	const rootOp = animate({ from: 0, to: 1, start: 14.0, end: 14.6, ease: Easing.easeOutBack })(t);
	const leftOp = animate({ from: 0, to: 1, start: 14.9, end: 15.5, ease: Easing.easeOutBack })(t);
	const rightOp = animate({ from: 0, to: 1, start: 15.5, end: 16.1, ease: Easing.easeOutBack })(t);
	const insOp = animate({ from: 0, to: 1, start: 16.2, end: 16.8, ease: Easing.easeOutBack })(t);
	const insY = animate({ from: -44, to: 0, start: 16.2, end: 16.8, ease: Easing.easeOutCubic })(t);
	const rootHl =
		t > 16.7
			? animate({ from: 0, to: 1, start: 16.7, end: 17.3 })(t) *
				(t < 18.1 ? 1 : animate({ from: 1, to: 0, start: 18.1, end: 18.5 })(t))
			: 0;
	const btnDone = t > 18.5;
	const btnP = animate({ from: 0, to: 1, start: 18.5, end: 19.0, ease: Easing.easeOutBack })(t);
	const progW = animate({ from: 8, to: 16, start: 18.6, end: 19.2 })(t);
	const CX = 480;
	const NY = 58;

	return h(
		"div",
		{ style: { position: "absolute", inset: 0, background: C.bg, opacity: eIn * eOut } },
		h(Glow, null),
		h(TopBar, null),
		h(
			"div",
			{
				style: {
					position: "absolute",
					top: 56,
					bottom: 0,
					left: 0,
					width: 228,
					background: C.bgSoft,
					borderRight: `1px solid ${C.borderSoft}`,
					padding: "20px 12px",
				},
			},
			h(
				"div",
				{
					style: {
						fontFamily: MO,
						fontSize: 10,
						letterSpacing: ".12em",
						textTransform: "uppercase",
						color: C.faint,
						paddingLeft: 10,
						marginBottom: 10,
					},
				},
				"DDIA",
			),
			...["Intro", "Data Models", "Storage & Retrieval", "Encoding", "Replication", "Partitioning"].map((ch, i) =>
				h(
					"div",
					{
						key: ch,
						style: {
							padding: "8px 10px",
							borderRadius: 7,
							marginBottom: 2,
							background: i === 2 ? C.panel2 : "transparent",
							color: i === 2 ? C.text : C.muted,
							fontFamily: "Inter",
							fontSize: 13,
							fontWeight: i === 2 ? 700 : 500,
							border: `1px solid ${i === 2 ? C.border : "transparent"}`,
						},
					},
					ch,
				),
			),
		),
		h(
			"div",
			{ style: { position: "absolute", top: 56, bottom: 0, left: 228, right: 0, padding: "28px 40px" } },
			h(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 8,
						marginBottom: 18,
						fontFamily: "Inter",
						fontSize: 12.5,
						fontWeight: 600,
						color: C.faint,
					},
				},
				h("span", null, "Scroll"),
				h("span", null, "/"),
				h("span", null, "DDIA"),
				h("span", null, "/"),
				h("span", { style: { color: C.accent } }, "B-Trees"),
			),
			h(
				"div",
				{ style: { marginBottom: 22 } },
				h(
					"div",
					{
						style: {
							fontFamily: MO,
							fontSize: 10.5,
							letterSpacing: ".2em",
							textTransform: "uppercase",
							color: C.muted,
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginBottom: 10,
						},
					},
					h("span", { style: { width: 14, height: 1, background: C.accent, display: "inline-block" } }),
					"Chapter 3",
				),
				h(
					"h1",
					{
						style: {
							fontFamily: IT,
							fontSize: 30,
							fontWeight: 800,
							letterSpacing: "-.03em",
							color: C.text,
							margin: "0 0 8px",
						},
					},
					"B-Tree Node Split",
				),
				h(
					"p",
					{ style: { fontFamily: "Inter", fontSize: 15, color: C.muted, margin: 0 } },
					"Insert a key and watch how the node splits and propagates up the tree.",
				),
			),
			h(
				"div",
				{
					style: {
						background: C.panel,
						border: `1px solid ${C.borderSoft}`,
						borderRadius: 18,
						padding: "20px 24px",
						height: 228,
						position: "relative",
						boxShadow: "0 18px 50px -22px rgba(0,0,0,.85)",
						overflow: "hidden",
					},
				},
				h(
					"div",
					{
						style: {
							fontFamily: MO,
							fontSize: 10,
							letterSpacing: ".14em",
							textTransform: "uppercase",
							color: C.faint,
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginBottom: 8,
						},
					},
					h("div", { style: { width: 8, height: 8, borderRadius: "50%", background: C.accent } }),
					"B-Tree Visualizer",
					h(
						"span",
						{
							style: {
								marginLeft: "auto",
								color: C.accent,
								display: "flex",
								alignItems: "center",
								gap: 5,
								fontSize: 10,
							},
						},
						h("span", { style: { width: 5, height: 5, borderRadius: "50%", background: C.accent, display: "inline-block" } }),
						"LIVE",
					),
				),
				h(
					"div",
					{ style: { position: "relative", height: 162 } },
					h(
						"svg",
						{
							style: { position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" },
						},
						leftOp > 0.1
							? h("line", { x1: CX, y1: NY, x2: CX - 120, y2: NY + 85, stroke: "rgba(255,255,255,.14)", strokeWidth: 1.5, opacity: leftOp })
							: null,
						rightOp > 0.1
							? h("line", { x1: CX, y1: NY, x2: CX + 120, y2: NY + 85, stroke: "rgba(255,255,255,.14)", strokeWidth: 1.5, opacity: rightOp })
							: null,
					),
					h(BNode, { label: "50", cx: CX, cy: NY, op: rootOp, hl: rootHl }),
					leftOp > 0 ? h(BNode, { label: "25", cx: CX - 120, cy: NY + 85, op: leftOp }) : null,
					rightOp > 0 ? h(BNode, { label: "75", cx: CX + 120, cy: NY + 85, op: rightOp }) : null,
					insOp > 0
						? h(
								"div",
								{
									style: {
										position: "absolute",
										left: CX - 120,
										top: NY + 85 + insY - 52,
										transform: "translate(-50%,-50%)",
										opacity: insOp,
										zIndex: 3,
										width: 100,
										height: 40,
										borderRadius: 8,
										background: "rgba(94,106,210,.18)",
										border: "1.5px solid rgba(94,106,210,.85)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontFamily: MO,
										fontSize: 12,
										fontWeight: 700,
										color: "#aab2f6",
										boxShadow: "0 0 0 3px rgba(94,106,210,.15),0 0 22px rgba(94,106,210,.28)",
									},
								},
								"insert(30)",
							)
						: null,
				),
			),
			h(
				"div",
				{ style: { marginTop: 18, display: "flex", alignItems: "center", gap: 18 } },
				h(
					"div",
					{
						style: {
							display: "inline-flex",
							alignItems: "center",
							gap: 9,
							fontFamily: "Inter",
							fontSize: 14,
							fontWeight: 650,
							padding: "9px 16px",
							borderRadius: 8,
							border: `1px solid ${btnDone ? "rgba(76,195,138,.5)" : C.border}`,
							background: btnDone ? "rgba(76,195,138,.1)" : C.panel2,
							color: btnDone ? "#4cc38a" : C.text,
							transform: `scale(${1 + btnP * (1 - btnP) * 0.07})`,
						},
					},
					h(
						"div",
						{
							style: {
								width: 18,
								height: 18,
								borderRadius: 5,
								border: "1.5px solid currentColor",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 11,
							},
						},
						btnDone
							? h(
									"svg",
									{
										width: 11,
										height: 11,
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 3,
										strokeLinecap: "round",
										strokeLinejoin: "round",
									},
									h("path", { d: "M20 6 9 17l-5-5" }),
								)
							: null,
					),
					btnDone ? "Chapter complete!" : "Mark as complete",
				),
				h(
					"div",
					{ style: { display: "flex", alignItems: "center", gap: 9 } },
					h(
						"div",
						{ style: { width: 150, height: 6, borderRadius: 6, background: C.panel2, overflow: "hidden" } },
						h("div", {
							style: { height: "100%", width: `${progW}%`, background: `linear-gradient(90deg,${C.accent},${C.accentHi})` },
						}),
					),
					h(
						"span",
						{ style: { fontFamily: "Inter", fontSize: 12, fontWeight: 600, color: C.muted } },
						`${Math.round(progW)}%`,
					),
				),
			),
		),
	);
};

// ── Scene 4: Final (19.5–24s) ────────────────────────────────────────────────
const FinalScene = () => {
	const t = useTime();
	const bgOp = animate({ from: 0, to: 1, start: 20.0, end: 21.0, ease: Easing.easeOutCubic })(t);
	const lgOp = animate({ from: 0, to: 1, start: 20.1, end: 20.8, ease: Easing.easeOutBack })(t);
	const l1Op = animate({ from: 0, to: 1, start: 20.4, end: 21.1, ease: Easing.easeOutCubic })(t);
	const l2Op = animate({ from: 0, to: 1, start: 20.9, end: 21.7, ease: Easing.easeOutCubic })(t);
	const subOp = animate({ from: 0, to: 1, start: 21.5, end: 22.2, ease: Easing.easeOutCubic })(t);
	const sc = animate({ from: 0.97, to: 1.0, start: 20.0, end: 23.0 })(t);
	return h(
		"div",
		{
			style: {
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: C.bg,
				opacity: bgOp,
				transform: `scale(${sc})`,
			},
		},
		h("div", {
			style: {
				position: "absolute",
				inset: 0,
				background: "radial-gradient(52% 52% at 50% 50%,rgba(94,106,210,.12),transparent 70%)",
				pointerEvents: "none",
			},
		}),
		h("div", { style: { opacity: lgOp, transform: `scale(${0.5 + lgOp * 0.5})`, marginBottom: 32 } }, h(Logo, { sz: 52, glow: true })),
		h(
			"div",
			{
				style: {
					fontFamily: IT,
					fontSize: 62,
					fontWeight: 800,
					letterSpacing: "-.04em",
					color: C.text,
					lineHeight: 1.05,
					textAlign: "center",
					opacity: l1Op,
					transform: `translateY(${(1 - l1Op) * 16}px)`,
				},
			},
			"Don't read the classics —",
		),
		h(
			"div",
			{
				style: {
					fontFamily: IT,
					fontSize: 62,
					fontWeight: 800,
					letterSpacing: "-.04em",
					lineHeight: 1.05,
					textAlign: "center",
					opacity: l2Op,
					transform: `translateY(${(1 - l2Op) * 16}px)`,
				},
			},
			h("span", { style: { color: C.accent } }, "drive"),
			" them.",
		),
		h(
			"div",
			{
				style: {
					marginTop: 22,
					fontFamily: MO,
					fontSize: 12,
					letterSpacing: ".2em",
					textTransform: "uppercase",
					color: C.muted,
					opacity: subOp,
					display: "flex",
					alignItems: "center",
					gap: 14,
				},
			},
			h("span", { style: { width: 18, height: 1, background: C.accent, display: "inline-block" } }),
			"7 books · 185+ chapters · 500+ interactives",
			h("span", { style: { width: 18, height: 1, background: C.accent, display: "inline-block" } }),
		),
	);
};

function Scenes() {
	return h(
		Fragment,
		null,
		h("div", { style: { position: "absolute", inset: 0, background: "#08090a" } }),
		h(Sprite, { start: 0, end: 4.5 }, h(TitleScene, null)),
		h(Sprite, { start: 3.8, end: 13.5 }, h(LibraryScene, null)),
		h(Sprite, { start: 12.5, end: 20.2 }, h(ChapterScene, null)),
		h(Sprite, { start: 19.5, end: 24.0 }, h(FinalScene, null)),
	);
}

/**
 * Decorative Scroll trailer. Plays a 24s looping promo built on a fixed
 * 1280×720 design surface, scaled to fit its container. Its scene art is
 * `aria-hidden` — every fact it shows (name, status, live link) is also present
 * as real markup in the surrounding hero, so the trailer carries no unique
 * semantics. Autoplays for everyone; the Play/Pause control is the WCAG 2.2.2
 * accommodation for the auto-playing loop (and the keyboard-reachable way to
 * stop motion, replacing the old prefers-reduced-motion park-on-still).
 */
export function ScrollTrailer({ className = "" }: { className?: string }) {
	const [time, setTime] = useState(0);
	const [playing, setPlaying] = useState(true);
	const [isFull, setIsFull] = useState(false);
	const frameRef = useRef<HTMLDivElement>(null);
	const visibleRef = useRef(true);
	const toggle = () => setPlaying((p) => !p);

	// Toggle native fullscreen on the trailer frame (webkit-prefixed fallback
	// for Safari). The ResizeObserver re-fits the canvas to the new box.
	const toggleFull = () => {
		const frame = frameRef.current;
		if (!frame) return;
		const doc = document as Document & {
			webkitFullscreenElement?: Element;
			webkitExitFullscreen?: () => void;
		};
		const el = frame as HTMLDivElement & { webkitRequestFullscreen?: () => void };
		const action =
			doc.fullscreenElement || doc.webkitFullscreenElement
				? (doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc))
				: (el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el));
		Promise.resolve(action?.()).catch(() => {});
	};

	// Scale the fixed-size design surface to the frame's measured width.
	useEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		const measure = () =>
			frame.style.setProperty(
				"--st-scale",
				String(Math.min(frame.clientWidth / W, frame.clientHeight / H)),
			);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(frame);
		return () => ro.disconnect();
	}, []);

	// Track on-screen visibility so the rAF loop can skip the expensive scene
	// re-render while offscreen. SSR/old-browser safe; defaults to visible.
	useEffect(() => {
		const frame = frameRef.current;
		if (!frame || typeof IntersectionObserver === "undefined") return;
		const io = new IntersectionObserver(
			(entries) => { visibleRef.current = entries[0]?.isIntersecting ?? true; },
			{ threshold: 0.05 }
		);
		io.observe(frame);
		return () => io.disconnect();
	}, []);

	// Reflect native fullscreen state so the control icon flips.
	useEffect(() => {
		const onFs = () => {
			const doc = document as Document & { webkitFullscreenElement?: Element };
			setIsFull(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
		};
		document.addEventListener("fullscreenchange", onFs);
		document.addEventListener("webkitfullscreenchange", onFs);
		return () => {
			document.removeEventListener("fullscreenchange", onFs);
			document.removeEventListener("webkitfullscreenchange", onFs);
		};
	}, []);

	// Drive the playhead while playing; when paused, the loop is not started so
	// the trailer parks on the current frame (WCAG 2.2.2 — pausable autoplay).
	useEffect(() => {
		if (!playing) return; // parked on current frame, rAF not started
		let raf = 0;
		let last: number | null = null;
		const step = (ts: number) => {
			if (!visibleRef.current || (typeof document !== "undefined" && document.hidden)) {
				last = ts;
				raf = requestAnimationFrame(step);
				return;
			}
			if (last === null) last = ts;
			const dt = (ts - last) / 1000;
			last = ts;
			setTime((t) => {
				const next = t + dt;
				return next >= DUR ? next % DUR : next;
			});
			raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [playing]);

	return h(
		"div",
		{ ref: frameRef, className: `st ${className}`.trim() },
		h(
			"div",
			{ className: "st-canvas", "aria-hidden": "true" },
			h(TimeCtx.Provider, { value: time }, h(Scenes, null)),
		),
		h(
			"div",
			{ className: "st-controls" },
			h(
				"button",
				{
					type: "button",
					className: "st-ctl",
					onClick: toggle,
					"aria-label": playing ? "Pause animation" : "Play animation",
					"aria-pressed": !playing,
				},
				h(playing ? Pause : Play, { size: 14, "aria-hidden": "true" }),
			),
			h(
				"button",
				{
					type: "button",
					className: "st-ctl",
					onClick: toggleFull,
					"aria-label": isFull ? "Exit fullscreen" : "Enter fullscreen",
					"aria-pressed": isFull,
				},
				h(isFull ? Minimize : Maximize, { size: 14, "aria-hidden": "true" }),
			),
		),
	);
}
