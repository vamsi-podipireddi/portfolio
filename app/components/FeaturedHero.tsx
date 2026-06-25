import "./FeaturedHero.css";

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ProjectVM } from "../lib/vm";
import { TRAILERS } from "./trailers";

interface Props {
	vms: ProjectVM[];
	onOpen: (id: string) => void;
}

// Slide duration — must match the CSS transform transition.
const SLIDE_MS = 420;

interface Slide {
	from: number; // resting index sliding out
	dir: 1 | -1; // 1 = forward (new enters from right), -1 = back (from left)
	run: boolean; // false = incoming parked off-screen (heavy mount happens here)
	//              true  = transitioning to centre (compositor-only)
}

/**
 * Featured rotator. Shows one project's hero card and slides to the next:
 * each trailer plays a full loop, then its `onDone` advances forward; prev/next
 * arrows and the dot rail drive it manually, direction-aware.
 *
 * The slide is two-phase so a heavy incoming trailer can't eat the motion: the
 * new card is first mounted *parked* off-screen (run:false) — the expensive
 * mount happens while nothing is moving — then, on the next painted frame, it
 * transitions to centre (run:true) via a transform-only CSS transition the main
 * thread can't jank. The outgoing instance is preserved by key so its trailer
 * keeps playing as it leaves. Idle = one card, one rAF loop. Reduced motion
 * swaps instantly.
 */
export function FeaturedHero({ vms, onOpen }: Props) {
	const count = vms.length;
	const [idx, setIdx] = useState(0);
	const [slide, setSlide] = useState<Slide | null>(null);

	// idx in a ref so the stable callbacks read the live value without being
	// re-created (which would churn the trailer's onDone identity).
	const idxRef = useRef(0);
	idxRef.current = idx;
	const lockRef = useRef(false); // true while a slide is mid-flight
	const reduceRef = useRef(false);

	useEffect(() => {
		if (typeof matchMedia === "undefined") return;
		const mq = matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => {
			reduceRef.current = mq.matches;
		};
		sync();
		mq.addEventListener?.("change", sync);
		return () => mq.removeEventListener?.("change", sync);
	}, []);

	const go = useCallback(
		(target: number, dir: 1 | -1) => {
			// Ignore while a slide is running (lockRef) or nothing to rotate to.
			if (count < 2 || lockRef.current) return;
			const next = ((target % count) + count) % count;
			if (next === idxRef.current) return;
			if (reduceRef.current) {
				setIdx(next); // instant, no slide
				return;
			}
			lockRef.current = true;
			setSlide({ from: idxRef.current, dir, run: false }); // park incoming
			setIdx(next);
		},
		[count],
	);

	// Arm: once the parked frame has painted (incoming trailer now mounted),
	// flip to run on the next frame so the transform transition is clean even if
	// the mount janked the main thread. Double rAF = "after the parked paint".
	useEffect(() => {
		if (!slide || slide.run) return;
		let raf2 = 0;
		const raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => {
				setSlide((s) => (s && !s.run ? { ...s, run: true } : s));
			});
		});
		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
		};
	}, [slide]);

	// Drop the outgoing card once the slide has run its course.
	useEffect(() => {
		if (!slide || !slide.run) return;
		const t = setTimeout(() => {
			setSlide(null);
			lockRef.current = false;
		}, SLIDE_MS);
		return () => clearTimeout(t);
	}, [slide]);

	const onTrailerDone = useCallback(() => go(idxRef.current + 1, 1), [go]);
	const goPrev = useCallback(() => go(idxRef.current - 1, -1), [go]);
	const goNext = useCallback(() => go(idxRef.current + 1, 1), [go]);
	// Dot jump: slide along the shorter arc so the motion reads naturally.
	const goTo = useCallback(
		(target: number) => {
			const forward = (target - idxRef.current + count) % count;
			go(target, forward <= count - forward ? 1 : -1);
		},
		[go, count],
	);

	const vm = vms[idx];
	if (!vm) return null;
	const multi = count > 1;

	// Incoming card: parked on the entry side until run, then centred.
	const inClass =
		slide && !slide.run ? (slide.dir === 1 ? "fh-x-right" : "fh-x-left") : "";
	// Outgoing card: rests at centre until run, then exits the opposite side.
	const outClass =
		slide && slide.run ? (slide.dir === 1 ? "fh-x-left" : "fh-x-right") : "";

	return (
		<section
			className="fh"
			aria-roledescription="carousel"
			aria-label="Featured projects"
		>
			<div className="fh-top">
				<p className="fh-eyebrow">Featured</p>
				{multi && (
					<div className="fh-dots" role="tablist" aria-label="Featured projects">
						{vms.map((v, i) => (
							<button
								key={v.id}
								type="button"
								role="tab"
								aria-selected={i === idx}
								aria-label={v.name}
								className={`fh-dot ${i === idx ? "is-on" : ""}`}
								onClick={() => goTo(i)}
							/>
						))}
					</div>
				)}
			</div>

			<div className="fh-stack">
				{slide && (
					<FeaturedCard
						key={vms[slide.from].id}
						vm={vms[slide.from]}
						onOpen={onOpen}
						className={outClass}
						multi={multi}
						leaving
					/>
				)}
				<FeaturedCard
					key={vm.id}
					vm={vm}
					onOpen={onOpen}
					className={inClass}
					multi={multi}
					onDone={onTrailerDone}
					onPrev={goPrev}
					onNext={goNext}
				/>
			</div>
		</section>
	);
}

interface CardProps {
	vm: ProjectVM;
	onOpen: (id: string) => void;
	className?: string;
	multi: boolean;
	leaving?: boolean;
	onDone?: () => void;
	onPrev?: () => void;
	onNext?: () => void;
}

/** One featured hero card: trailer slot + meta + actions. */
function FeaturedCard({
	vm,
	onOpen,
	className = "",
	multi,
	leaving = false,
	onDone,
	onPrev,
	onNext,
}: CardProps) {
	const Icon = vm.icon;
	const Trailer = TRAILERS[vm.id];

	return (
		<div className={`fh-card ${className}`.trim()} inert={leaving}>
			<div className={`fh-shot ${Trailer ? "fh-shot-live" : "ed-shot"}`}>
				{Trailer ? (
					<Trailer onDone={onDone} />
				) : (
					<span className="fh-shot-label">drop hero screenshot · {vm.name}</span>
				)}
				<span className="fh-badge">
					<span className="fh-badge-dot" style={{ background: vm.stColor }} />
					{vm.stLabel}
				</span>
				{multi && !leaving && (
					<>
						<button
							type="button"
							className="fh-nav fh-nav--prev"
							aria-label="Previous featured project"
							onClick={onPrev}
						>
							<ChevronLeft size={20} aria-hidden="true" />
						</button>
						<button
							type="button"
							className="fh-nav fh-nav--next"
							aria-label="Next featured project"
							onClick={onNext}
						>
							<ChevronRight size={20} aria-hidden="true" />
						</button>
					</>
				)}
			</div>
			<div className="fh-body">
				<div className="fh-main">
					<div className="fh-head">
						<span
							className="fh-tile"
							style={{ background: vm.tileBg, borderColor: vm.tileBorder }}
						>
							<Icon size={24} color={vm.glyph} aria-hidden="true" />
						</span>
						<h2 className="fh-name">{vm.name}</h2>
					</div>
					<p className="fh-pitch">{vm.pitch}</p>
					<div className="fh-tags">
						{vm.tags.map((t) => (
							<span key={t} className="fh-tag">
								{t}
							</span>
						))}
					</div>
				</div>
				<div className="fh-actions">
					<button
						type="button"
						className="fh-details"
						onClick={() => onOpen(vm.id)}
					>
						View details
					</button>
					{vm.hasLive && (
						<a
							className="fh-live"
							href={vm.live}
							target="_blank"
							rel="noopener noreferrer"
						>
							Live
							<ExternalLink size={15} aria-hidden="true" />
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
