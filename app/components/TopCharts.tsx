import { Star } from "lucide-react";
import type { ProjectVM } from "../lib/vm";
import "./TopCharts.css";

interface Props {
	items: (ProjectVM & { rankTxt: string })[];
	onOpen: (id: string) => void;
}

export function TopCharts({ items, onOpen }: Props) {
	return (
		<section className="tc">
			<div className="tc-head">
				<h3 className="tc-title">Top Charts</h3>
				<span className="tc-sub">most starred</span>
			</div>
			<div className="tc-grid">
				{items.map((p) => {
					const Icon = p.icon;
					return (
						<button
							key={p.id}
							type="button"
							className="tc-row"
							onClick={() => onOpen(p.id)}
						>
							<span className="tc-rank">{p.rankTxt}</span>
							<span
								className="tc-tile"
								style={{ background: p.tileBg, borderColor: p.tileBorder }}
							>
								<Icon size={22} color={p.glyph} aria-hidden="true" />
							</span>
							<span className="tc-id">
								<span className="tc-name">{p.name}</span>
								<span className="tc-cat">{p.catLabel}</span>
							</span>
							<span className="tc-stars">
								<Star size={13} aria-hidden="true" />
								{p.starsTxt}
							</span>
						</button>
					);
				})}
			</div>
		</section>
	);
}
