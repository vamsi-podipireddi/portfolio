import type { ProjectVM } from "../lib/vm";
import { ProjectCard } from "./ProjectCard";
import "./Shelf.css";

interface Props {
	title: string;
	sub: string;
	items: ProjectVM[];
	onOpen: (id: string) => void;
	onSeeAll?: () => void;
}

/**
 * Horizontal "shelf" row: serif title + mono sub + "See all" action, with a
 * scroll-snapping track of shared ProjectCards.
 */
export function Shelf({ title, sub, items, onOpen, onSeeAll }: Props) {
	return (
		<section className="shelf">
			<div className="shelf-head">
				<div className="shelf-titles">
					<h3 className="shelf-title">{title}</h3>
					<span className="shelf-sub">{sub}</span>
				</div>
				<button type="button" className="shelf-seeall" onClick={onSeeAll}>
					See all →
				</button>
			</div>
			<div className="ed-scroll shelf-track">
				{items.map((p) => (
					<ProjectCard
						vm={p}
						onOpen={onOpen}
						className="shelf-card"
						key={p.id}
					/>
				))}
			</div>
		</section>
	);
}
