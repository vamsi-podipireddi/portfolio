import "./BuildingNow.css";
import { Sparkles } from "lucide-react";

interface Props {
	building: string;
}

export function BuildingNow({ building }: Props) {
	return (
		<section className="bn-section">
			<div className="bn-banner">
				<span className="bn-tile">
					<Sparkles size={24} aria-hidden="true" />
				</span>
				<div className="bn-body">
					<p className="bn-label">Building now</p>
					<p className="bn-text">{building}</p>
				</div>
			</div>
		</section>
	);
}
