import type { CSSProperties } from "react";
import type { Project } from "../lib/consts";
import { Icon } from "./Icon";
import "./ProjectCard.css";

interface Props {
	project: Project;
}

export function ProjectCard({ project }: Props) {
	const { name, subtitle, tagline, description, tags, github, live, glyph, accent, featured } =
		project;
	const style = { "--c1": accent[0], "--c2": accent[1] } as CSSProperties;

	return (
		<article
			className={["project", "glass", featured && "featured"].filter(Boolean).join(" ")}
			style={style}
		>
			<div className="glow" aria-hidden="true" />
			<div className="project-head">
				<span className="glyph" aria-hidden="true">
					{glyph}
				</span>
				{featured && <span className="badge">Featured</span>}
			</div>

			<h3 className="project-title">
				{name}
				{subtitle && <span className="subtitle"> {subtitle}</span>}
			</h3>
			<p className="project-tagline">{tagline}</p>
			<p className="project-desc">{description}</p>

			<ul className="tags" aria-label="Tech stack">
				{tags.map((t) => (
					<li className="tag" key={t}>
						{t}
					</li>
				))}
			</ul>

			<div className="project-links">
				{live && (
					<a
						className="btn btn-primary btn-sm"
						href={live}
						target="_blank"
						rel="noopener noreferrer"
					>
						Live <Icon name="external" size={15} />
					</a>
				)}
				{github && (
					<a className="btn btn-sm" href={github} target="_blank" rel="noopener noreferrer">
						<Icon name="github" size={15} /> Code
					</a>
				)}
			</div>
		</article>
	);
}
