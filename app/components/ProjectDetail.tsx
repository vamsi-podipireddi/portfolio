import {
	ChevronLeft,
	ChevronRight,
	ExternalLink,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectVM } from "../lib/vm";
import { GithubIcon } from "./GithubIcon";
import { Lightbox } from "./Lightbox";
import { ScrollTrailer } from "./ScrollTrailer";
import "./ProjectDetail.css";

const SCROLL_AMOUNT = 300;

interface Props {
	vm: ProjectVM;
	onBack: () => void;
}

/**
 * Full project detail view (replaces the browse grid). Hero screenshot slot,
 * title row with accent tile + status meta, pitch, tags, an actions column,
 * an about + meta-table grid, and a horizontal screenshot gallery.
 */
export function ProjectDetail({ vm, onBack }: Props) {
	const Icon = vm.icon;

	// Image shots (those with a real src) drive both the click-to-expand
	// lightbox and the scroll arrows. Placeholder slots stay non-interactive.
	// imgIndexByKey maps each image tile's key to its position in imageShots so
	// a click opens the lightbox at the right slide regardless of placeholders.
	const imageShots: { src: string; alt: string }[] = [];
	const imgIndexByKey = new Map<number, number>();
	for (const s of vm.shotsArr) {
		if (s.src) {
			imgIndexByKey.set(s.key, imageShots.length);
			imageShots.push({ src: s.src, alt: s.alt ?? "" });
		}
	}
	const hasImageShots = imageShots.length > 0;

	const galleryRef = useRef<HTMLDivElement>(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(false);
	const [lightbox, setLightbox] = useState<number | null>(null);

	const updateEdges = useCallback(() => {
		const el = galleryRef.current;
		if (!el) return;
		setCanLeft(el.scrollLeft > 0);
		setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	// Recompute reachable edges on mount, when the project changes, and on resize.
	useEffect(() => {
		updateEdges();
		window.addEventListener("resize", updateEdges);
		return () => window.removeEventListener("resize", updateEdges);
	}, [updateEdges, vm.id]);

	const scrollByTiles = (dir: -1 | 1) => {
		galleryRef.current?.scrollBy({
			left: dir * SCROLL_AMOUNT,
			behavior: "smooth",
		});
	};

	return (
		<>
			<div className="pd-bar">
				<button type="button" className="pd-back" onClick={onBack}>
					<ChevronLeft size={16} aria-hidden="true" />
					Back to store
				</button>
			</div>

			<section className="pd-section">
				{vm.id === "scroll" ? (
					<div className="pd-hero pd-hero-live">
						<ScrollTrailer />
					</div>
				) : (
					<div className="ed-shot pd-hero">
						<span className="pd-hero-label">
							drop hero screenshot · {vm.name}
						</span>
					</div>
				)}

				<div className="pd-top">
					<div className="pd-top-main">
						<div className="pd-titlerow">
							<span
								className="pd-tile"
								style={{ background: vm.tileBg, borderColor: vm.tileBorder }}
							>
								<Icon size={28} color={vm.glyph} aria-hidden="true" />
							</span>
							<div>
								<h1 className="pd-name">{vm.name}</h1>
								<div className="pd-meta">
									<span className="pd-status">
										<span
											className="pd-dot"
											style={{ background: vm.stColor }}
										/>
										{vm.stLabel}
									</span>
									<span className="pd-cat">{vm.catLabel}</span>
								</div>
							</div>
						</div>

						<p className="pd-pitch">{vm.pitch}</p>

						<div className="pd-tags">
							{vm.tags.map((t) => (
								<span key={t} className="pd-tag">
									{t}
								</span>
							))}
						</div>
					</div>

					<div className="pd-actions">
						{vm.hasLive && (
							<a
								className="pd-btn pd-btn-primary"
								href={vm.live}
								target="_blank"
								rel="noopener noreferrer"
							>
								Open live
								<ExternalLink size={15} aria-hidden="true" />
							</a>
						)}
						{vm.hasLink && (
							<a
								className="pd-btn pd-btn-primary"
								href={vm.link}
								target="_blank"
								rel="noopener noreferrer"
							>
								Play reference
								<ExternalLink size={15} aria-hidden="true" />
							</a>
						)}
						{vm.hasCode && (
							<a
								className="pd-btn pd-btn-chip"
								href={vm.code}
								target="_blank"
								rel="noopener noreferrer"
							>
								<GithubIcon size={15} aria-hidden="true" />
								View code
							</a>
						)}
					</div>
				</div>

				<div className="pd-grid">
					<div>
						<h3 className="pd-label">About</h3>
						<p className="pd-desc">{vm.desc}</p>
					</div>
					<div className="pd-table">
						{vm.metaRows.map((row) => (
							<div key={row.k} className="pd-trow">
								<span className="pd-tk">{row.k}</span>
								<span className="pd-tv">{row.v}</span>
							</div>
						))}
					</div>
				</div>

				<h3 className="pd-label pd-shots-label">Screenshots</h3>
				<div className="pd-gallery-wrap">
					{hasImageShots && canLeft && (
						<button
							type="button"
							className="pd-arrow pd-arrow--left"
							aria-label="Scroll screenshots left"
							onClick={() => scrollByTiles(-1)}
						>
							<ChevronLeft size={18} aria-hidden="true" />
						</button>
					)}

					<div
						ref={galleryRef}
						className="ed-scroll pd-gallery"
						onScroll={updateEdges}
					>
						{vm.shotsArr.map((s) => {
							if (!s.src) {
								return (
									<div key={s.key} className="ed-shot pd-shot">
										<span className="pd-shot-label">{s.label}</span>
									</div>
								);
							}
							const imgIndex = imgIndexByKey.get(s.key) ?? 0;
							return (
								<button
									key={s.key}
									type="button"
									className="pd-shot pd-shot--img"
									aria-label={`View screenshot: ${s.alt}`}
									onClick={() => setLightbox(imgIndex)}
								>
									<img
										className="pd-shot-img"
										src={s.src}
										alt={s.alt}
										loading="lazy"
										decoding="async"
									/>
								</button>
							);
						})}
					</div>

					{hasImageShots && canRight && (
						<button
							type="button"
							className="pd-arrow pd-arrow--right"
							aria-label="Scroll screenshots right"
							onClick={() => scrollByTiles(1)}
						>
							<ChevronRight size={18} aria-hidden="true" />
						</button>
					)}
				</div>

				<div className="pd-spacer" />

				{lightbox !== null && (
					<Lightbox
						shots={imageShots}
						index={lightbox}
						onClose={() => setLightbox(null)}
						onNavigate={setLightbox}
					/>
				)}
			</section>
		</>
	);
}
