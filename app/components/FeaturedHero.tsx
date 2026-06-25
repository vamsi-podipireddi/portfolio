import "./FeaturedHero.css";

import { ExternalLink } from "lucide-react";

import type { ProjectVM } from "../lib/vm";
import { ScrollTrailer } from "./ScrollTrailer";

interface Props {
	vm: ProjectVM;
	onOpen: (id: string) => void;
}

export function FeaturedHero({ vm, onOpen }: Props) {
	const Icon = vm.icon;

	return (
		<section className="fh">
			<p className="fh-eyebrow">Featured</p>
			<div className="fh-card">
				<div className={`fh-shot ${vm.id === "scroll" ? "fh-shot-live" : "ed-shot"}`}>
					{vm.id === "scroll" ? (
						<ScrollTrailer />
					) : (
						<span className="fh-shot-label">
							drop hero screenshot · {vm.name}
						</span>
					)}
					<span className="fh-badge">
						<span
							className="fh-badge-dot"
							style={{ background: vm.stColor }}
						/>
						{vm.stLabel}
					</span>
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
		</section>
	);
}
