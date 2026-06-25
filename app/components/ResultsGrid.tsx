import type { ProjectVM } from "../lib/vm";
import { ProjectCard } from "./ProjectCard";
import "./ResultsGrid.css";

interface Props {
	resultLabel: string;
	items: ProjectVM[];
	query: string;
	onOpen: (id: string) => void;
}

/**
 * Category/search results section: a mono label over either a 3-column grid
 * of project cards or a centered empty state echoing the query.
 */
export function ResultsGrid({ resultLabel, items, query, onOpen }: Props) {
	return (
		<section className="rgrid">
			<p className="rgrid-label">{resultLabel}</p>
			{items.length > 0 ? (
				<div className="rgrid-grid">
					{items.map((p) => (
						<ProjectCard vm={p} onOpen={onOpen} key={p.id} />
					))}
				</div>
			) : (
				<div className="rgrid-empty">
					<p className="rgrid-empty-text">
						No projects match <span className="rgrid-q">“{query}”</span>.
					</p>
				</div>
			)}
		</section>
	);
}
