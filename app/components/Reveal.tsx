import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	/** stagger delay in ms */
	delay?: number;
	className?: string;
}

/**
 * Fade + slide-up on viewport entry (Framer-style scroll reveal).
 * Progressive enhancement: the hidden initial state lives behind the `.js`
 * gate in global.css, so without JS the content renders fully visible.
 */
export function Reveal({ children, delay = 0, className = "" }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		if (reduce || typeof IntersectionObserver === "undefined") {
			el.classList.add("is-visible");
			return;
		}

		const io = new IntersectionObserver(
			(entries, obs) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add("is-visible");
						obs.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`reveal ${className}`.trim()}
			style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
		>
			{children}
		</div>
	);
}
