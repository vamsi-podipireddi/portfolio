import { ChevronLeft, ExternalLink } from "lucide-react";
import type { ProjectVM } from "../lib/vm";
import { GithubIcon } from "./GithubIcon";
import "./ProjectDetail.css";

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

	return (
		<>
			<div className="pd-bar">
				<button type="button" className="pd-back" onClick={onBack}>
					<ChevronLeft size={16} aria-hidden="true" />
					Back to store
				</button>
			</div>

			<section className="pd-section">
				<div className="ed-shot pd-hero">
					<span className="pd-hero-label">
						drop hero screenshot · {vm.name}
					</span>
				</div>

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
				<div className="ed-scroll pd-gallery">
					{vm.shotsArr.map((s) => (
						<div key={s.key} className="ed-shot pd-shot">
							<span className="pd-shot-label">{s.label}</span>
						</div>
					))}
				</div>

				<div className="pd-spacer" />
			</section>
		</>
	);
}
