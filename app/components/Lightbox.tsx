import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import "./Lightbox.css";

interface Shot {
	src: string;
	alt: string;
}

interface Props {
	shots: Shot[];
	index: number;
	onClose: () => void;
	onNavigate: (i: number) => void;
}

/**
 * Full-viewport screenshot viewer. Opened from the ProjectDetail gallery; shows
 * one image centered over a dark backdrop with prev/next + close controls and a
 * caption. Keyboard: Escape closes, arrows navigate. Locks body scroll and traps
 * focus within its controls while open.
 */
export function Lightbox({ shots, index, onClose, onNavigate }: Props) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);

	const canPrev = index > 0;
	const canNext = index < shots.length - 1;
	const shot = shots[index];

	const goPrev = useCallback(() => {
		if (index > 0) onNavigate(index - 1);
	}, [index, onNavigate]);

	const goNext = useCallback(() => {
		if (index < shots.length - 1) onNavigate(index + 1);
	}, [index, shots.length, onNavigate]);

	// Keyboard: Escape closes, arrows navigate, Tab is trapped within controls.
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
				return;
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				goPrev();
				return;
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				goNext();
				return;
			}
			if (e.key === "Tab") {
				const root = overlayRef.current;
				if (!root) return;
				const focusable = root.querySelectorAll<HTMLElement>(
					"button:not([disabled])",
				);
				if (focusable.length === 0) return;
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				const active = document.activeElement;
				if (e.shiftKey) {
					if (active === first || !root.contains(active)) {
						e.preventDefault();
						last.focus();
					}
				} else if (active === last || !root.contains(active)) {
					e.preventDefault();
					first.focus();
				}
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onClose, goPrev, goNext]);

	// Lock body scroll while the viewer is open.
	useEffect(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);

	// Move focus into the dialog on open.
	useEffect(() => {
		closeRef.current?.focus();
	}, []);

	if (!shot) return null;

	return (
		<div
			ref={overlayRef}
			className="lb-overlay"
			role="dialog"
			aria-modal="true"
			aria-label="Screenshot viewer"
			onClick={onClose}
		>
			<button
				ref={closeRef}
				type="button"
				className="lb-close"
				aria-label="Close"
				onClick={onClose}
			>
				<X size={20} aria-hidden="true" />
			</button>

			<button
				type="button"
				className="lb-nav lb-nav--prev"
				aria-label="Previous screenshot"
				disabled={!canPrev}
				onClick={(e) => {
					e.stopPropagation();
					goPrev();
				}}
			>
				<ChevronLeft size={22} aria-hidden="true" />
			</button>

			<figure
				className="lb-figure"
				onClick={(e) => e.stopPropagation()}
			>
				<img
					className="lb-img"
					src={shot.src}
					alt={shot.alt}
					decoding="async"
				/>
				<figcaption className="lb-caption">{shot.alt}</figcaption>
			</figure>

			<button
				type="button"
				className="lb-nav lb-nav--next"
				aria-label="Next screenshot"
				disabled={!canNext}
				onClick={(e) => {
					e.stopPropagation();
					goNext();
				}}
			>
				<ChevronRight size={22} aria-hidden="true" />
			</button>
		</div>
	);
}
