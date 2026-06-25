import "./AboutStrip.css";

interface Props {
	name: string;
	tagline: string;
	buildingShort: string;
	countProjects: number;
	countLive: number;
}

export function AboutStrip({ name, tagline, buildingShort, countProjects, countLive }: Props) {
	return (
		<section className="about-strip">
			<div className="about-strip__avatar ed-shot">
				<span className="about-strip__monogram">VP</span>
			</div>
			<div className="about-strip__body">
				<div className="about-strip__heading">
					<h1 className="about-strip__name">{name}</h1>
					<span className="about-strip__pill">
						<span className="about-strip__dot" />
						{buildingShort}
					</span>
				</div>
				<p className="about-strip__tagline">{tagline}</p>
			</div>
			<div className="about-strip__stats">
				<div>
					<div className="about-strip__stat-num">{countProjects}</div>
					<div className="about-strip__stat-label">Projects</div>
				</div>
				<div>
					<div className="about-strip__stat-num">{countLive}</div>
					<div className="about-strip__stat-label">Live</div>
				</div>
			</div>
		</section>
	);
}
