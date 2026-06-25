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
import "./TrumpTrailer.css";

/*
 * Trump brand trailer — a self-contained promotional animation for the Trump
 * card-game project. Built on the exact same scaffolding as ScrollTrailer: the
 * scene art is transcribed via createElement (so the hundreds of inline style
 * declarations stay untouched) and the only runtime is the tiny timeline shim
 * below (Easing / animate / clamp / Sprite + a requestAnimationFrame driver).
 * Decorative throughout — the canvas is aria-hidden and every fact it shows
 * (name, status, link) is also present as real markup in the surrounding hero.
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
const DUR = 20;

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
// Felt-and-gold casino identity, deliberately distinct from Scroll's violet.
// Neutrals are reused verbatim from ScrollTrailer so the frame/controls read as
// the same product. Brand hex is intentionally literal (this branch's tokens
// are monochrome; the brand colour lives here and in the consts brandTile).
const C = {
	bg: "#08090a",
	bgSoft: "#0d0e10",
	panel: "#141517",
	panel2: "#1b1d21",
	border: "rgba(255,255,255,.10)",
	borderSoft: "rgba(255,255,255,.06)",
	ink: "#f7f8f8",
	muted: "#8a8f98",
	faint: "#62666d",
	gold: "#e6b450", // primary — brand, counters, trump stamp, glow, wordmark
	goldHi: "#f2c869", // brighter gold — edges / glints / glow highlights
	goldLine: "rgba(230,180,80,.55)", // hairline rules
	goldFaint: "rgba(230,180,80,.10)", // lattice / fills
	emerald: "#2bb673", // secondary — LIVE dot, seat ring (You-side UI), PARTNER
	cyan: "#34d3c0", // cooler emerald-cyan — AI seat badges
	crimson: "#d8443c", // red suits on ivory faces
	charcoal: "#14110b", // black suits on ivory faces
	glass: "rgba(255,255,255,.05)",
};

// Three inline font stacks that fall back to the site's three loaded fonts so
// nothing is fetched — mirroring ScrollTrailer's IT / MO consts.
const SR = "'Newsreader',Georgia,'Times New Roman',serif"; // wordmark, titles, numerals, ranks
const MO = "'Geist Mono',ui-monospace,SFMono-Regular,monospace"; // eyebrows, chips, labels
const SN = "'Inter',system-ui,-apple-system,sans-serif"; // body, tagline

type Suit = "spade" | "heart" | "diamond" | "club";

// SUIT PIPS on a 24×24 viewBox — one set scales everywhere (corner index →
// centre pip → trump stamp). Club is three circles + a stem; the rest are paths.
const SUIT_PATHS: Record<Exclude<Suit, "club">, string> = {
	diamond: "M12 2 L21 12 L12 22 L3 12 Z",
	heart: "M12 21 C3 14 3 6 8.5 6 C11 6 12 8 12 9 C12 8 13 6 15.5 6 C21 6 21 14 12 21 Z",
	spade:
		"M12 3 C12 9 21 11 21 16 C21 19 17 20 14.5 18 C15 20.5 16 21 17 22 L7 22 C8 21 9 20.5 9.5 18 C7 20 3 19 3 16 C3 11 12 9 12 3 Z",
};

// crimson for heart/diamond, charcoal for spade/club on ivory faces; standalone
// glyphs on dark are coloured gold by the caller (Pip `color` prop).
const suitColor = (suit: Suit) =>
	suit === "heart" || suit === "diamond" ? C.crimson : C.charcoal;

// ── shared pieces ────────────────────────────────────────────────────────────
const Pip = ({ suit, size, color }: { suit: Suit; size: number; color: string }) =>
	h(
		"svg",
		{
			width: size,
			height: size,
			viewBox: "0 0 24 24",
			fill: "currentColor",
			"aria-hidden": "true",
			style: { color, display: "block" },
		},
		suit === "club"
			? h(
					Fragment,
					null,
					h("circle", { cx: 12, cy: 7, r: 4 }),
					h("circle", { cx: 7, cy: 13, r: 4 }),
					h("circle", { cx: 17, cy: 13, r: 4 }),
					h("path", { d: "M11 13 q1 6 -2.5 9 h7 q-3.5 -3 -2.5 -9 Z" }),
				)
			: h("path", { d: SUIT_PATHS[suit] }),
	);

// Corner index — Newsreader rank with a small pip beneath; the bottom-right copy
// is the same node inside a rotate(180deg) wrapper.
const corner = (rank: string, suit: Suit, col: string, tl: boolean) =>
	h(
		"div",
		{
			key: tl ? "tl" : "br",
			style: {
				position: "absolute",
				...(tl ? { top: 7, left: 8 } : { bottom: 7, right: 8, transform: "rotate(180deg)" }),
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				lineHeight: 1,
			},
		},
		h("div", { style: { fontFamily: SR, fontSize: 18, fontWeight: 600, color: col } }, rank),
		h("div", { style: { marginTop: 1 } }, h(Pip, { suit, size: 10, color: col })),
	);

// CARD FACE — warm ivory gradient (never pure white) so it glows against #08090a
// without clipping. box-shadow is driven by `lift`/`glow` for the trick beats.
const CardFace = ({
	rank,
	suit,
	w = 116,
	ht = 162,
	glow = 0,
	rim = false,
	reveal = false,
}: {
	rank: string;
	suit: Suit;
	w?: number;
	ht?: number;
	glow?: number;
	rim?: boolean;
	reveal?: boolean;
}) => {
	const col = suitColor(suit);
	const isFace = rank === "J" || rank === "Q" || rank === "K";
	const base = `0 10px 22px -10px rgba(0,0,0,.7)`;
	const glowShadow = glow > 0 ? `, 0 0 ${Math.round(46 * glow)}px rgba(242,200,105,${0.6 * glow})` : "";
	const revealRing = reveal ? `, inset 0 0 0 2px rgba(43,182,115,.75)` : "";
	return h(
		"div",
		{
			style: {
				position: "relative",
				width: w,
				height: ht,
				borderRadius: 10,
				background: "linear-gradient(160deg,#faf6ec,#ece4d2)",
				border: `1px solid ${rim || glow > 0 ? "rgba(242,200,105,.85)" : "rgba(20,17,11,.14)"}`,
				boxShadow: base + glowShadow + revealRing,
			},
		},
		corner(rank, suit, col, true),
		corner(rank, suit, col, false),
		h(
			"div",
			{
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				},
			},
			isFace
				? h(
						"div",
						{ style: { fontFamily: SR, fontSize: Math.round(ht * 0.34), fontWeight: 600, color: col, lineHeight: 1 } },
						rank,
					)
				: h(Pip, { suit, size: Math.round(ht * 0.27), color: col }),
		),
	);
};

// CARD BACK — gold-on-felt with a 2px inset gold border, a ±45° gold diamond
// lattice, and a single centred gold spade monogram.
const CardBack = ({ w = 116, ht = 162 }: { w?: number; ht?: number }) =>
	h(
		"div",
		{
			style: {
				position: "relative",
				width: w,
				height: ht,
				borderRadius: Math.max(5, w * 0.09),
				background: "linear-gradient(135deg,#3a2a10,#1a1206)",
				boxShadow: "inset 0 0 0 2px rgba(230,180,80,.55), 0 8px 16px -10px rgba(0,0,0,.85)",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			},
		},
		h("div", {
			style: {
				position: "absolute",
				inset: 4,
				borderRadius: Math.max(3, w * 0.06),
				backgroundImage:
					"repeating-linear-gradient(45deg, rgba(230,180,80,.10) 0 1px, transparent 1px 10px)," +
					"repeating-linear-gradient(-45deg, rgba(230,180,80,.10) 0 1px, transparent 1px 10px)",
			},
		}),
		h(Pip, { suit: "spade", size: Math.round(w * 0.34), color: C.gold }),
	);

// SEAT MARKER — 40px circle, 1.5px ring (gold for You, emerald-cyan for AI),
// holding a lucide-style person (head circle + shoulders arc). Never an avatar.
const personSvg = (size: number, color: string) =>
	h(
		"svg",
		{
			width: size,
			height: size,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 2,
			strokeLinecap: "round",
			strokeLinejoin: "round",
			"aria-hidden": "true",
			style: { color },
		},
		h("circle", { cx: 12, cy: 8, r: 3.4 }),
		h("path", { d: "M5.5 20a6.5 6.5 0 0 1 13 0" }),
	);

const Seat = ({
	x,
	y,
	ai,
	name,
	markerOp = 1,
	chipOp = 1,
}: {
	x: number;
	y: number;
	ai: boolean;
	name: string;
	markerOp?: number;
	chipOp?: number;
}) => {
	const ring = ai ? C.cyan : C.gold;
	return h(
		"div",
		{
			style: {
				position: "absolute",
				left: x,
				top: y,
				transform: "translate(-50%,-50%)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 8,
			},
		},
		h(
			"div",
			{
				style: {
					width: 40,
					height: 40,
					borderRadius: "50%",
					border: `1.5px solid ${ring}`,
					background: "rgba(8,9,10,.72)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					opacity: markerOp,
					boxShadow: `0 0 14px ${ai ? "rgba(52,211,192,.28)" : "rgba(230,180,80,.3)"}`,
				},
			},
			personSvg(20, ring),
		),
		h(
			"div",
			{ style: { display: "flex", alignItems: "center", gap: 6, opacity: chipOp } },
			h("span", { style: { fontFamily: MO, fontSize: 11, letterSpacing: ".06em", color: C.muted } }, name),
			ai
				? h(
						"span",
						{
							style: {
								fontFamily: MO,
								fontSize: 9,
								letterSpacing: ".12em",
								color: C.cyan,
								border: `1px solid ${C.cyan}`,
								borderRadius: 5,
								padding: "1px 4px",
							},
						},
						"AI",
					)
				: null,
		),
	);
};

// Glass ROOM-CODE chip with a pulsing emerald LIVE dot (the pulse is supplied by
// the caller as `dotOp`). Reused, dimmed, as the faint chip in the final lockup.
const RoomChip = ({ dotOp = 1, faint = false }: { dotOp?: number; faint?: boolean }) =>
	h(
		"div",
		{
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: 9,
				padding: "7px 13px",
				borderRadius: 999,
				background: C.glass,
				border: `1px solid ${C.border}`,
				backdropFilter: "blur(14px)",
				WebkitBackdropFilter: "blur(14px)",
				fontFamily: MO,
				fontSize: 11,
				letterSpacing: ".16em",
				color: faint ? C.faint : C.muted,
			},
		},
		h("span", {
			style: {
				width: 7,
				height: 7,
				borderRadius: "50%",
				background: C.emerald,
				opacity: dotOp,
				boxShadow: `0 0 9px rgba(43,182,115,${0.7 * dotOp})`,
			},
		}),
		h("span", null, "ROOM · 4K7Q"),
	);

const eyebrowEl = (txt: string) =>
	h(
		"div",
		{
			style: {
				fontFamily: MO,
				fontSize: 11,
				letterSpacing: ".24em",
				textTransform: "uppercase",
				color: C.muted,
				marginBottom: 10,
			},
		},
		txt,
	);

// Two short gold hairline rules flanking the eyebrow, wiped open via scaleX.
const goldRule = (sx: number, wRule = 26) =>
	h("span", {
		style: {
			width: wRule,
			height: 1,
			background: C.goldLine,
			display: "inline-block",
			transform: `scaleX(${sx})`,
			transformOrigin: "center",
		},
	});

const checkSvg = (s: number) =>
	h(
		"svg",
		{
			width: 13,
			height: 13,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 3,
			strokeLinecap: "round",
			strokeLinejoin: "round",
			"aria-hidden": "true",
			style: { transform: `scale(${s})` },
		},
		h("path", { d: "M20 6 9 17l-5-5" }),
	);

// Felt radial (table scenes only) + the faint gold top-centre vignette (all scenes).
const Felt = () =>
	h("div", {
		style: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
			background: "radial-gradient(60% 50% at 50% 56%, rgba(14,61,44,.55), transparent 72%)",
		},
	});

const GoldVignette = () =>
	h("div", {
		style: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
			background: "radial-gradient(62% 42% at 50% -6%, rgba(230,180,80,.10), transparent 72%)",
		},
	});

// ── Scene 1: The Deal (0–5.5s) ───────────────────────────────────────────────
const DECK = { x: 640, y: 432 };
const SEATS = [
	{ x: 640, y: 656, ai: false, name: "You", hx: 640, hy: 556 },
	{ x: 1072, y: 432, ai: true, name: "Nova", hx: 944, hy: 432 },
	{ x: 640, y: 232, ai: true, name: "Atlas", hx: 640, hy: 332 },
	{ x: 208, y: 432, ai: true, name: "Echo", hx: 336, hy: 432 },
];

const DealScene = () => {
	const t = useTime();
	const sIn = Easing.easeOutCubic(clamp(t / 0.4, 0, 1));
	const sOut = t > 5.0 ? clamp((t - 5.0) / 0.5, 0, 1) : 0;
	const op = sIn * (1 - sOut);

	const deckS = animate({ from: 0.9, to: 1, start: 0, end: 0.7, ease: Easing.easeOutBack })(t);

	const titleOp = animate({ from: 0, to: 1, start: 0.5, end: 0.9, ease: Easing.easeOutCubic })(t);
	const titleY = animate({ from: 22, to: 0, start: 0.5, end: 0.9, ease: Easing.easeOutCubic })(t);
	const ruleS = animate({ from: 0, to: 1, start: 0.5, end: 0.9, ease: Easing.easeOutCubic })(t);

	// LIVE dot — a ping-pong of animate() on opacity over a 1.2s sawtooth.
	const ph = t > 0.7 ? ((t - 0.7) % 1.2) / 1.2 : 0;
	const dotOp =
		ph < 0.5
			? animate({ from: 0.45, to: 1, start: 0, end: 0.5 })(ph)
			: animate({ from: 1, to: 0.45, start: 0.5, end: 1 })(ph);

	const chipsOp = animate({ from: 0, to: 1, start: 3.8, end: 4.4, ease: Easing.easeOutCubic })(t);

	// 16 card-backs fly from the deck to the four seats in a staggered fan.
	const cards: ReactElement[] = [];
	for (let i = 0; i < 16; i++) {
		const seat = SEATS[i % 4];
		const k = Math.floor(i / 4); // 0..3 within a seat
		const spread = k - 1.5;
		const delay = 0.9 + i * 0.09;
		if (t < delay) continue;
		const pp = animate({ from: 0, to: 1, start: delay, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
		const ss = animate({ from: 0.7, to: 1, start: delay, end: delay + 0.55, ease: Easing.easeOutBack })(t);
		const cop = clamp((t - delay) / 0.12, 0, 1);
		const tx = seat.hx + spread * 24;
		const ty = seat.hy;
		const rot = spread * 5; // −7.5..+7.5deg seat angle
		const x = DECK.x + (tx - DECK.x) * pp;
		const y = DECK.y + (ty - DECK.y) * pp;
		cards.push(
			h(
				"div",
				{
					key: i,
					style: {
						position: "absolute",
						left: x,
						top: y,
						zIndex: 6 + k,
						transform: `translate(-50%,-50%) rotate(${rot * pp}deg) scale(${ss})`,
						opacity: cop,
						filter: "drop-shadow(0 6px 8px rgba(0,0,0,.5))",
					},
				},
				h(CardBack, { w: 46, ht: 64 }),
			),
		);
	}

	return h(
		"div",
		{ style: { position: "absolute", inset: 0, background: C.bg, opacity: op } },
		h(Felt, null),
		h(GoldVignette, null),
		// deck — a small stack of backs with a 2px shadow drop
		h(
			"div",
			{
				style: {
					position: "absolute",
					left: DECK.x,
					top: DECK.y,
					transform: `translate(-50%,-50%) scale(${deckS})`,
				},
			},
			h(
				"div",
				{ style: { position: "relative", width: 46, height: 64 } },
				[0, 1, 2, 3].map((d) =>
					h(
						"div",
						{
							key: d,
							style: {
								position: "absolute",
								left: d * 1.5,
								top: -d * 1.5,
								filter: "drop-shadow(0 4px 6px rgba(0,0,0,.55))",
							},
						},
						h(CardBack, { w: 46, ht: 64 }),
					),
				),
			),
		),
		// seats (gold You + three emerald-cyan AI) with mono name chips
		SEATS.map((s, i) =>
			h(Seat, { key: i, x: s.x, y: s.y, ai: s.ai, name: s.name, markerOp: op, chipOp: chipsOp }),
		),
		// ROOM-code chip + pulsing LIVE dot, top-right
		h("div", { style: { position: "absolute", top: 30, right: 34, opacity: chipsOp } }, h(RoomChip, { dotOp })),
		// title block, top-centre
		h(
			"div",
			{
				style: {
					position: "absolute",
					top: 60,
					left: 0,
					right: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					opacity: titleOp,
					transform: `translateY(${titleY}px)`,
				},
			},
			h(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 12,
						fontFamily: MO,
						fontSize: 11,
						letterSpacing: ".22em",
						textTransform: "uppercase",
						color: C.muted,
						marginBottom: 12,
					},
				},
				goldRule(ruleS),
				"Trick-Taking Card Game",
				goldRule(ruleS),
			),
			h(
				"div",
				{ style: { fontFamily: SR, fontSize: 84, fontWeight: 600, letterSpacing: "-.02em", color: C.ink, lineHeight: 1 } },
				"Trump",
			),
		),
		cards,
	);
};

// ── Scene 2: Bid to 250 & Name the Trump (5–10.5s) ───────────────────────────
const HAND: { rank: string; suit: Suit }[] = [
	{ rank: "A", suit: "spade" },
	{ rank: "K", suit: "heart" },
	{ rank: "10", suit: "spade" },
	{ rank: "Q", suit: "club" },
	{ rank: "9", suit: "diamond" },
	{ rank: "J", suit: "spade" },
];

const BidScene = () => {
	const t = useTime();
	const sIn = animate({ from: 0, to: 1, start: 4.9, end: 5.4, ease: Easing.easeOutCubic })(t);
	const sOut = t > 10.1 ? animate({ from: 1, to: 0, start: 10.1, end: 10.6 })(t) : 1;
	const op = sIn * sOut;

	// player's hand fans face-up across the bottom
	const hand = HAND.map((c, i) => {
		const delay = 5.0 + i * 0.06;
		const p = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
		const cop = clamp((t - delay) / 0.15, 0, 1);
		const frac = i / (HAND.length - 1);
		const ang = (-18 + frac * 36) * p;
		const x = 640 + (i - 2.5) * 96;
		const yBase = 664 + Math.pow(Math.abs(i - 2.5), 2) * 4.5;
		const y = yBase + (1 - p) * 40;
		return h(
			"div",
			{
				key: i,
				style: {
					position: "absolute",
					left: x,
					top: y,
					zIndex: 20 + i,
					transform: `translate(-50%,-50%) rotate(${ang}deg)`,
					opacity: cop,
				},
			},
			h(CardFace, { rank: c.rank, suit: c.suit }),
		);
	});

	// kinetic "250 points in the deck" count-up
	const cnt = Math.round(animate({ from: 0, to: 250, start: 5.2, end: 6.0, ease: Easing.easeOutCubic })(t));
	const cntS = animate({ from: 0.92, to: 1, start: 5.2, end: 6.0, ease: Easing.easeOutBack })(t);
	const cntOp =
		animate({ from: 0, to: 1, start: 5.2, end: 5.5 })(t) *
		(t < 6.2 ? 1 : animate({ from: 1, to: 0, start: 6.2, end: 6.6 })(t));
	const cntY = t > 6.2 ? animate({ from: 0, to: -34, start: 6.2, end: 6.6, ease: Easing.easeOutCubic })(t) : 0;
	const underS = animate({ from: 0, to: 1, start: 6.0, end: 6.45, ease: Easing.easeOutCubic })(t);

	// live BID readout inside a thin gold ring meter filling toward 250
	const bidOp =
		animate({ from: 0, to: 1, start: 6.4, end: 6.9 })(t) *
		(t < 8.5 ? 1 : animate({ from: 1, to: 0, start: 8.5, end: 8.9 })(t));
	const bidVal = Math.round(animate({ from: 130, to: 185, start: 6.6, end: 8.4, ease: Easing.easeOutCubic })(t) / 5) * 5;
	const bidMeter = animate({ from: 130, to: 185, start: 6.6, end: 8.4, ease: Easing.easeInOutCubic })(t);
	const R = 92;
	const CIRC = 2 * Math.PI * R;
	const frac = bidMeter / 250;
	const rawStep = animate({ from: 130, to: 185, start: 6.6, end: 8.4, ease: Easing.easeOutCubic })(t) / 5;
	const bidPulse = t > 6.6 && t < 8.4 ? 1 + 0.06 * Math.abs(Math.sin(rawStep * Math.PI)) : 1;

	// TRUMP reveal — a giant gold spade slams down with one stroke-only shockwave
	const trumpOp = animate({ from: 0, to: 1, start: 8.4, end: 8.75 })(t);
	const spS = animate({ from: 0, to: 1, start: 8.4, end: 9.0, ease: Easing.easeOutBack })(t);
	const spRot = animate({ from: -10, to: 0, start: 8.4, end: 9.0, ease: Easing.easeOutBack })(t);
	const breathe = t > 9.6 ? 1 + 0.03 * Easing.easeInOutCubic(clamp((t - 9.6) / 0.9, 0, 1)) : 1;
	const spScale = spS * breathe;
	const shockS = animate({ from: 0.6, to: 2.2, start: 8.4, end: 9.25, ease: Easing.easeOutCubic })(t);
	const shockOp = animate({ from: 0.5, to: 0, start: 8.4, end: 9.25 })(t);
	const wash =
		t < 8.4
			? 0
			: t < 8.55
				? animate({ from: 0, to: 0.18, start: 8.4, end: 8.55 })(t)
				: t < 8.72
					? animate({ from: 0.18, to: 0, start: 8.55, end: 8.72 })(t)
					: 0;
	const labelOp = animate({ from: 0, to: 1, start: 9.0, end: 9.6, ease: Easing.easeOutCubic })(t);
	const labelY = animate({ from: 18, to: 0, start: 9.0, end: 9.6, ease: Easing.easeOutCubic })(t);

	const CX = 640;
	const CY = 300;

	return h(
		"div",
		{ style: { position: "absolute", inset: 0, background: C.bg, opacity: op } },
		h(GoldVignette, null),
		// 120ms gold wash flash on the slam
		h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", background: C.gold, opacity: wash } }),
		hand,
		// count-up
		cntOp > 0.01
			? h(
					"div",
					{
						style: {
							position: "absolute",
							left: CX,
							top: CY,
							transform: `translate(-50%,-50%) translateY(${cntY}px) scale(${cntS})`,
							opacity: cntOp,
							textAlign: "center",
						},
					},
					eyebrowEl("Points in the Deck"),
					h(
						"div",
						{ style: { fontFamily: SR, fontSize: 150, fontWeight: 600, color: C.gold, lineHeight: 1, textShadow: "0 0 40px rgba(230,180,80,.35)" } },
						String(cnt),
					),
					h("div", {
						style: { height: 3, width: 180, margin: "14px auto 0", background: C.gold, transform: `scaleX(${underS})`, transformOrigin: "center", borderRadius: 2 },
					}),
				)
			: null,
		// bid ring meter
		bidOp > 0.01
			? h(
					"div",
					{
						style: {
							position: "absolute",
							left: CX,
							top: CY,
							transform: "translate(-50%,-50%)",
							opacity: bidOp,
							width: 230,
							height: 230,
						},
					},
					h(
						"svg",
						{ width: 230, height: 230, style: { position: "absolute", inset: 0, transform: "rotate(-90deg)" } },
						h("circle", { cx: 115, cy: 115, r: R, fill: "none", stroke: "rgba(230,180,80,.16)", strokeWidth: 6 }),
						h("circle", {
							cx: 115,
							cy: 115,
							r: R,
							fill: "none",
							stroke: C.gold,
							strokeWidth: 6,
							strokeLinecap: "round",
							strokeDasharray: CIRC,
							strokeDashoffset: CIRC * (1 - frac),
						}),
					),
					h(
						"div",
						{ style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } },
						eyebrowEl("Bid"),
						h(
							"div",
							{ style: { fontFamily: SR, fontSize: 78, fontWeight: 600, color: C.ink, lineHeight: 1, transform: `scale(${bidPulse})` } },
							String(bidVal),
						),
						h("div", { style: { fontFamily: MO, fontSize: 12, color: C.faint, marginTop: 6 } }, "/ 250"),
					),
				)
			: null,
		// trump spade stamp + shockwave + labels
		trumpOp > 0.01
			? h(
					"div",
					{
						style: {
							position: "absolute",
							left: CX,
							top: CY,
							transform: "translate(-50%,-50%)",
							opacity: trumpOp,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						},
					},
					h(
						"div",
						{ style: { position: "relative", width: 240, height: 240, display: "flex", alignItems: "center", justifyContent: "center" } },
						h(
							"svg",
							{ width: 240, height: 240, style: { position: "absolute", inset: 0, transform: `scale(${shockS})`, opacity: shockOp } },
							h("circle", { cx: 120, cy: 120, r: 96, fill: "none", stroke: C.goldHi, strokeWidth: 3 }),
						),
						h(
							"div",
							{ style: { transform: `rotate(${spRot}deg) scale(${spScale})`, filter: "drop-shadow(0 0 34px rgba(230,180,80,.5))" } },
							h(Pip, { suit: "spade", size: 220, color: C.gold }),
						),
					),
					h(
						"div",
						{ style: { textAlign: "center", opacity: labelOp, transform: `translateY(${labelY}px)`, marginTop: 6 } },
						h("div", { style: { fontFamily: MO, fontSize: 13, letterSpacing: ".34em", color: C.muted } }, "TRUMP"),
						h("div", { style: { fontFamily: SR, fontSize: 40, fontWeight: 600, color: C.gold, marginTop: 4 } }, "Spades"),
					),
				)
			: null,
	);
};

// ── Scene 3: Secret Partner & the Trump Trick (10.3–15.8s) ───────────────────
const TRICK: {
	fromX: number;
	fromY: number;
	cx: number;
	cy: number;
	rank: string;
	suit: Suit;
	rot: number;
	partner: boolean;
	winner: boolean;
}[] = [
	{ fromX: 640, fromY: 232, cx: 606, cy: 352, rank: "9", suit: "heart", rot: -12, partner: false, winner: false },
	{ fromX: 1072, fromY: 432, cx: 676, cy: 372, rank: "K", suit: "diamond", rot: 9, partner: true, winner: false },
	{ fromX: 208, fromY: 432, cx: 624, cy: 336, rank: "Q", suit: "club", rot: 7, partner: false, winner: false },
	{ fromX: 640, fromY: 656, cx: 640, cy: 392, rank: "A", suit: "spade", rot: -4, partner: false, winner: true },
];

const TrickScene = () => {
	const t = useTime();
	const sIn = animate({ from: 0, to: 1, start: 10.2, end: 10.8, ease: Easing.easeOutCubic })(t);
	const sOut = t > 15.4 ? animate({ from: 1, to: 0, start: 15.4, end: 15.8 })(t) : 1;
	const op = sIn * sOut;

	const cards: (ReactElement | null)[] = TRICK.map((c, i) => {
		const start = 10.3 + i * 0.32;
		if (t < start) return null;
		const p = animate({ from: 0, to: 1, start, end: start + 0.55, ease: Easing.easeOutCubic })(t);
		const cop = clamp((t - start) / 0.12, 0, 1);
		const sc = 0.8 + 0.2 * p;
		let rot = c.rot * p;
		let extraY = 0;
		let sMul = 1;
		let glow = 0;
		let z = 20 + i;

		// partner card flips (scaleX 1→0→1) and reveals the emerald ring at the midpoint
		let flipX = 1;
		let reveal = false;
		if (c.partner && t >= 12.2) {
			const f = clamp((t - 12.2) / 0.5, 0, 1);
			flipX = f < 0.5 ? 1 - f * 2 : (f - 0.5) * 2;
			reveal = t >= 12.45;
		}

		// the winning trump spade lifts off the pile and glows gold
		if (c.winner && t > 12.9) {
			z = 45;
			rot = animate({ from: c.rot, to: 0, start: 12.9, end: 13.8, ease: Easing.easeOutBack })(t);
			extraY = animate({ from: 0, to: -46, start: 12.9, end: 13.8, ease: Easing.easeOutBack })(t);
			const ls = animate({ from: 1, to: 1.12, start: 12.9, end: 13.8, ease: Easing.easeOutBack })(t);
			const wb = t > 14.4 ? 1 + 0.018 * Easing.easeInOutCubic(clamp((t - 14.4) / 1.0, 0, 1)) : 1;
			sMul = ls * wb;
			glow = animate({ from: 0, to: 1, start: 12.9, end: 13.8 })(t);
		}

		const x = c.fromX + (c.cx - c.fromX) * p;
		const y = c.fromY + (c.cy - c.fromY) * p;
		return h(
			"div",
			{
				key: i,
				style: {
					position: "absolute",
					left: x,
					top: y,
					zIndex: z,
					transform: `translate(-50%,-50%) translateY(${extraY}px) rotate(${rot}deg) scaleX(${flipX}) scale(${sc * sMul})`,
					opacity: cop,
				},
			},
			h(CardFace, { rank: c.rank, suit: c.suit, glow, rim: glow > 0.3, reveal }),
		);
	});

	// emerald PARTNER tag — rendered outside the flipping card so it isn't mirrored
	const partner = TRICK[1];
	const ptagS = animate({ from: 0, to: 1, start: 12.5, end: 12.9, ease: Easing.easeOutBack })(t);
	const ptag =
		t >= 12.5
			? h(
					"div",
					{
						style: {
							position: "absolute",
							left: partner.cx,
							top: partner.cy - 104,
							transform: `translate(-50%,-50%) scale(${ptagS})`,
							zIndex: 46,
							fontFamily: MO,
							fontSize: 11,
							letterSpacing: ".16em",
							color: "#08120e",
							background: C.emerald,
							borderRadius: 7,
							padding: "4px 10px",
							fontWeight: 700,
							boxShadow: "0 4px 14px rgba(43,182,115,.4)",
						},
					},
					"PARTNER",
				)
			: null;

	// running tally + mini meter, top-centre
	const pts = Math.round(animate({ from: 185, to: 215, start: 13.6, end: 14.4, ease: Easing.easeOutCubic })(t));
	const ptsFrac = pts / 250;
	const tally = h(
		"div",
		{
			style: {
				position: "absolute",
				top: 42,
				left: "50%",
				transform: "translateX(-50%)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 8,
			},
		},
		h(
			"div",
			{ style: { fontFamily: MO, fontSize: 12, letterSpacing: ".18em", color: C.muted } },
			"POINTS  ",
			h("span", { style: { color: C.gold, fontWeight: 600 } }, String(pts)),
			" / 250",
		),
		h(
			"div",
			{ style: { width: 220, height: 6, borderRadius: 6, background: "rgba(255,255,255,.08)", overflow: "hidden" } },
			h("div", { style: { height: "100%", width: `${ptsFrac * 100}%`, background: `linear-gradient(90deg,${C.gold},${C.goldHi})` } }),
		),
	);

	// '+30' gold chip rises from the winning card to the tally
	const chipP = animate({ from: 0, to: 1, start: 13.6, end: 14.4, ease: Easing.easeOutCubic })(t);
	const chipOp =
		animate({ from: 0, to: 1, start: 13.6, end: 13.85 })(t) *
		(t < 14.15 ? 1 : animate({ from: 1, to: 0, start: 14.15, end: 14.5 })(t));
	const chip =
		t >= 13.6
			? h(
					"div",
					{
						style: {
							position: "absolute",
							left: 640,
							top: 320 + (86 - 320) * chipP,
							transform: "translate(-50%,-50%)",
							opacity: chipOp,
							zIndex: 50,
							fontFamily: MO,
							fontSize: 18,
							fontWeight: 700,
							color: "#08120e",
							background: `linear-gradient(160deg,${C.goldHi},${C.gold})`,
							borderRadius: 999,
							padding: "6px 14px",
							boxShadow: "0 6px 18px rgba(230,180,80,.45)",
						},
					},
					"+30",
				)
			: null;

	return h(
		"div",
		{ style: { position: "absolute", inset: 0, background: C.bg, opacity: op } },
		h(Felt, null),
		h(GoldVignette, null),
		// soft contact shadow under the pile
		h("div", {
			style: {
				position: "absolute",
				left: 640,
				top: 410,
				width: 240,
				height: 44,
				transform: "translate(-50%,-50%)",
				borderRadius: "50%",
				background: "radial-gradient(closest-side, rgba(0,0,0,.55), transparent)",
			},
		}),
		cards,
		ptag,
		tally,
		chip,
	);
};

// ── Scene 4: First to 5 — Lockup (15.6–20s) ──────────────────────────────────
const LETTERS = ["T", "r", "u", "m", "p"];
const SUITS: Suit[] = ["spade", "heart", "club", "diamond"];

const LockupScene = () => {
	const t = useTime();
	const sIn = animate({ from: 0, to: 1, start: 15.6, end: 16.4, ease: Easing.easeOutCubic })(t);
	const breathe = t > 19.6 ? 1 + 0.02 * Easing.easeInOutCubic(clamp((t - 19.6) / 0.4, 0, 1)) : 1;

	// the spade mark settles next to the wordmark
	const markS = animate({ from: 1.7, to: 1, start: 15.6, end: 16.4, ease: Easing.easeInOutCubic })(t);
	const underS = animate({ from: 0, to: 1, start: 16.3, end: 17.1, ease: Easing.easeOutCubic })(t);

	const tagOp = animate({ from: 0, to: 1, start: 17.4, end: 18.1, ease: Easing.easeOutCubic })(t);
	const tagY = animate({ from: 14, to: 0, start: 17.4, end: 18.1, ease: Easing.easeOutCubic })(t);

	// scoreboard bar crosses the contract line and flips gold with a check
	const barW = animate({ from: 0, to: 80, start: 18.0, end: 18.7, ease: Easing.easeInOutCubic })(t);
	const made = t >= 18.62;
	const checkS = animate({ from: 0, to: 1, start: 18.62, end: 19.0, ease: Easing.easeOutBack })(t);
	const firstToOp = animate({ from: 0, to: 1, start: 18.7, end: 19.3, ease: Easing.easeOutCubic })(t);

	const statOp = animate({ from: 0, to: 1, start: 19.2, end: 19.6, ease: Easing.easeOutCubic })(t);

	return h(
		"div",
		{ style: { position: "absolute", inset: 0, background: C.bg, opacity: sIn } },
		h(GoldVignette, null),
		h(
			"div",
			{
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					transform: `scale(${breathe})`,
				},
			},
			// lockup row — gold spade mark + staggered 'Trump' wordmark
			h(
				"div",
				{ style: { display: "flex", alignItems: "center", gap: 18, marginBottom: 10 } },
				h(
					"div",
					{ style: { transform: `scale(${markS})`, filter: "drop-shadow(0 0 22px rgba(230,180,80,.45))", display: "flex" } },
					h(Pip, { suit: "spade", size: 64, color: C.gold }),
				),
				h(
					"div",
					{ style: { display: "flex" } },
					LETTERS.map((ch, i) => {
						const delay = 16.3 + i * 0.06;
						const lop = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
						const ly = animate({ from: 26, to: 0, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
						const ls = animate({ from: 0.96, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
						return h(
							"span",
							{
								key: i,
								style: {
									fontFamily: SR,
									fontSize: 72,
									fontWeight: 600,
									letterSpacing: "-.01em",
									color: C.ink,
									opacity: lop,
									transform: `translateY(${ly}px) scale(${ls})`,
									display: "inline-block",
								},
							},
							ch,
						);
					}),
				),
			),
			// gold underline wiping in
			h("div", {
				style: {
					height: 3,
					width: 260,
					background: C.gold,
					transform: `scaleX(${underS})`,
					transformOrigin: "center",
					borderRadius: 2,
					marginBottom: 22,
					boxShadow: "0 0 16px rgba(230,180,80,.4)",
				},
			}),
			// four-suit pip row, fading in left→right
			h(
				"div",
				{ style: { display: "flex", gap: 18, marginBottom: 18 } },
				SUITS.map((s, i) => {
					const pop = animate({ from: 0, to: 1, start: 17.0 + i * 0.12, end: 17.0 + i * 0.12 + 0.4, ease: Easing.easeOutCubic })(t);
					return h("div", { key: s, style: { opacity: pop } }, h(Pip, { suit: s, size: 26, color: C.gold }));
				}),
			),
			// tagline
			h(
				"div",
				{ style: { fontFamily: SN, fontSize: 18, color: C.muted, opacity: tagOp, transform: `translateY(${tagY}px)`, marginBottom: 26 } },
				"Bid bold. Name the trump. Take the table.",
			),
			// scoreboard — captured-points bar + contract line + check
			h(
				"div",
				{ style: { width: 420, marginBottom: 22 } },
				h(
					"div",
					{
						style: {
							display: "flex",
							justifyContent: "space-between",
							fontFamily: MO,
							fontSize: 10.5,
							letterSpacing: ".14em",
							textTransform: "uppercase",
							color: C.faint,
							marginBottom: 7,
						},
					},
					h("span", null, "Captured"),
					made
						? h(
								"span",
								{ style: { color: C.gold, display: "inline-flex", alignItems: "center", gap: 5 } },
								checkSvg(checkS),
								"Contract made",
							)
						: h("span", null, "Contract line"),
				),
				h(
					"div",
					{ style: { position: "relative", height: 9, borderRadius: 6, background: "rgba(255,255,255,.07)", overflow: "visible" } },
					h("div", {
						style: {
							position: "absolute",
							top: 0,
							bottom: 0,
							left: 0,
							width: `${barW}%`,
							borderRadius: 6,
							background: made ? `linear-gradient(90deg,${C.gold},${C.goldHi})` : C.emerald,
						},
					}),
					// the contract line itself, at 72%
					h("div", { style: { position: "absolute", top: -4, bottom: -4, left: "72%", width: 2, background: C.goldLine } }),
				),
			),
			// five deal-win pips (the 5th ignites gold) toward "first to 5 deals"
			h(
				"div",
				{ style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 8 } },
				[0, 1, 2, 3, 4].map((i) => {
					const delay = 18.6 + i * 0.12;
					const pop = animate({ from: 0, to: 1, start: delay, end: delay + 0.35, ease: Easing.easeOutBack })(t);
					const last = i === 4;
					const ignite = last ? animate({ from: 0, to: 1, start: 19.2, end: 19.6, ease: Easing.easeOutCubic })(t) : 1;
					return h("div", {
						key: i,
						style: {
							width: last ? 22 : 16,
							height: last ? 22 : 16,
							borderRadius: "50%",
							transform: `scale(${pop})`,
							background: last ? `rgba(230,180,80,${0.2 + 0.8 * ignite})` : "rgba(230,180,80,.5)",
							border: `1.5px solid ${C.gold}`,
							boxShadow: last && ignite > 0.3 ? `0 0 ${Math.round(18 * ignite)}px rgba(242,200,105,${0.7 * ignite})` : "none",
						},
					});
				}),
			),
			h(
				"div",
				{
					style: {
						fontFamily: MO,
						fontSize: 10.5,
						letterSpacing: ".16em",
						textTransform: "uppercase",
						color: C.faint,
						opacity: firstToOp,
					},
				},
				"First to 5 deals",
			),
		),
		// mono stat line + faint room-code chip anchor the bottom
		h(
			"div",
			{
				style: {
					position: "absolute",
					bottom: 44,
					left: 0,
					right: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 14,
					opacity: statOp,
				},
			},
			h(
				"div",
				{ style: { fontFamily: MO, fontSize: 11.5, letterSpacing: ".12em", color: C.muted } },
				"2-4 players · bid 130-250 · highest trump wins · first to 5 deals",
			),
			h(RoomChip, { dotOp: 0.5, faint: true }),
		),
	);
};

function Scenes() {
	return h(
		Fragment,
		null,
		h("div", { style: { position: "absolute", inset: 0, background: "#08090a" } }),
		h(Sprite, { start: 0, end: 5.7 }, h(DealScene, null)),
		h(Sprite, { start: 4.8, end: 10.7 }, h(BidScene, null)),
		h(Sprite, { start: 10.1, end: 16.0 }, h(TrickScene, null)),
		h(Sprite, { start: 15.4, end: 20.0 }, h(LockupScene, null)),
	);
}

/**
 * Decorative Trump trailer. Plays a 20s looping promo built on a fixed
 * 1280×720 design surface, scaled to fit its container. Its scene art is
 * `aria-hidden` — every fact it shows (name, status, live link) is also present
 * as real markup in the surrounding hero, so the trailer carries no unique
 * semantics. Autoplays for everyone; the Play/Pause control is the WCAG 2.2.2
 * accommodation for the auto-playing loop (and the keyboard-reachable way to
 * stop motion). Mirrors ScrollTrailer's machinery exactly.
 */
export function TrumpTrailer({
	className = "",
	onDone,
}: { className?: string; onDone?: () => void }) {
	const [time, setTime] = useState(0);
	const [playing, setPlaying] = useState(true);
	const [isFull, setIsFull] = useState(false);
	const frameRef = useRef<HTMLDivElement>(null);
	const visibleRef = useRef(true);
	const timeRef = useRef(0);
	const onDoneRef = useRef(onDone);
	const toggle = () => setPlaying((p) => !p);

	// Keep the latest onDone in a ref so the rAF loop can call it without
	// re-subscribing the driver effect or re-rendering the heavy scene tree.
	useEffect(() => {
		onDoneRef.current = onDone;
	}, [onDone]);

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

	// Scale the fixed-size design surface to the frame's measured box.
	useEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		const measure = () =>
			frame.style.setProperty(
				"--tt-scale",
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
			(entries) => {
				visibleRef.current = entries[0]?.isIntersecting ?? true;
			},
			{ threshold: 0.05 },
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
			let next = timeRef.current + dt;
			if (next >= DUR) {
				// Full play-through: wrap and signal completion (the featured
				// carousel uses this to advance to the next trailer).
				next %= DUR;
				onDoneRef.current?.();
			}
			timeRef.current = next;
			setTime(next);
			raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [playing]);

	return h(
		"div",
		{ ref: frameRef, className: `tt ${className}`.trim() },
		h(
			"div",
			{ className: "tt-canvas", "aria-hidden": "true" },
			h(TimeCtx.Provider, { value: time }, h(Scenes, null)),
		),
		h(
			"div",
			{ className: "tt-controls" },
			h(
				"button",
				{
					type: "button",
					className: "tt-ctl",
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
					className: "tt-ctl",
					onClick: toggleFull,
					"aria-label": isFull ? "Exit fullscreen" : "Enter fullscreen",
					"aria-pressed": isFull,
				},
				h(isFull ? Minimize : Maximize, { size: 14, "aria-hidden": "true" }),
			),
		),
	);
}
