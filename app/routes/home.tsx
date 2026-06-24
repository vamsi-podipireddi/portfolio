import { ProjectCard } from "../components/ProjectCard";
import { Reveal } from "../components/Reveal";
import { PROJECTS, SITE_DESCRIPTION, SITE_TITLE } from "../lib/consts";
import { seo } from "../lib/seo";
import "./home.css";

export function meta() {
	return seo({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" });
}

export default function Home() {
	return (
		<section className="section container launcher">
			<Reveal>
				<header className="launcher-head">
					<h1>Projects</h1>
					<p className="lead">Live apps and source.</p>
				</header>
			</Reveal>
			<div className="projects-grid">
				{PROJECTS.map((p, i) => (
					<Reveal delay={i * 80} key={p.name}>
						<ProjectCard project={p} />
					</Reveal>
				))}
			</div>
		</section>
	);
}
