import { ExternalLink } from "lucide-react";
import type { Project } from "../lib/consts";
import { GithubIcon } from "./GithubIcon";
import "./ProjectCard.css";

interface Props {
	project: Project;
}

export function ProjectCard({ project }: Props) {
	const { name, subtitle, tagline, github, live, icon: ProjectIcon, featured } = project;

	return (
		<article className="project">
			<div className="project-head">
				<span className="glyph">
					<ProjectIcon className="glyph-icon" size={22} aria-hidden="true" />
				</span>
				{featured && <span className="badge">Featured</span>}
			</div>

			<h3 className="project-title">
				{name}
				{subtitle && <span className="subtitle"> {subtitle}</span>}
			</h3>
			<p className="project-tagline">{tagline}</p>

			<div className="project-links">
				{live && (
					<a
						className="btn btn-primary btn-sm"
						href={live}
						target="_blank"
						rel="noopener noreferrer"
					>
						Live <ExternalLink size={15} />
					</a>
				)}
				{github && (
					<a className="btn btn-sm" href={github} target="_blank" rel="noopener noreferrer">
						<GithubIcon size={15} /> Code
					</a>
				)}
			</div>
		</article>
	);
}
