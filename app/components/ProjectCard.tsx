import type { CSSProperties, KeyboardEvent } from "react";
import type { ProjectVM } from "../lib/vm";
import "./ProjectCard.css";

interface Props {
	vm: ProjectVM;
	onOpen: (id: string) => void;
	/** Extra class merged onto the card (e.g. shelf fixed-width). */
	className?: string;
	style?: CSSProperties;
}

/**
 * App-store style project card: striped screenshot slot with a status badge,
 * accent icon tile, name + category, pitch, and a meta footer. Acts as a link
 * to the detail view (click or Enter/Space).
 */
export function ProjectCard({ vm, onOpen, className = "", style }: Props) {
	const open = () => onOpen(vm.id);
	const onKey = (e: KeyboardEvent<HTMLElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			open();
		}
	};
	const Icon = vm.icon;

	return (
		<article
			className={`pcard ${className}`.trim()}
			style={style}
			role="link"
			tabIndex={0}
			aria-label={`${vm.name} — ${vm.catLabel}`}
			onClick={open}
			onKeyDown={onKey}
		>
			<div className="pcard-shot" style={{ background: vm.shotBg }}>
				<span className="pcard-status">
					<span className="pcard-dot" style={{ background: vm.stColor }} />
					{vm.stLabel}
				</span>
			</div>

			<div className="pcard-body">
				<div className="pcard-head">
					<span
						className="pcard-tile"
						style={{ background: vm.tileBg, borderColor: vm.tileBorder }}
					>
						<Icon size={20} color={vm.glyph} aria-hidden="true" />
					</span>
					<div className="pcard-id">
						<h4 className="pcard-name">{vm.name}</h4>
						<span className="pcard-cat">{vm.catLabel}</span>
					</div>
				</div>

				<p className="pcard-pitch">{vm.pitch}</p>

				<div className="pcard-meta">
					<span>{vm.langTxt}</span>
					<span className="pcard-upd">{vm.updTxt}</span>
				</div>
			</div>
		</article>
	);
}
