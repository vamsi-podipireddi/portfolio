import { Icon } from "../components/Icon";
import { AUTHOR, PROJECTS } from "../lib/consts";
import { seo } from "../lib/seo";
import "./about.css";

const stack = [
	"Python",
	"TypeScript",
	"React",
	"FastAPI",
	"Bash",
	"Local LLMs (Ollama)",
	"PyTorch / ROCm",
	"Cloudflare Pages",
	"React Router",
	"Docker",
];

export function meta() {
	return seo({
		title: `About · ${AUTHOR.name}`,
		description:
			"Engineer and builder focused on systems, local-first AI, and developer experience — operating-systems playgrounds, local-LLM tools, and small CLI niceties.",
		path: "/about",
	});
}

export default function About() {
	return (
		<section className="section container about-page">
			<p className="eyebrow">About</p>
			<h1>{AUTHOR.name}</h1>
			<p className="role">{AUTHOR.role}</p>

			<div className="about-grid">
				<div className="prose-col">
					{AUTHOR.bio.map((para) => (
						<p className="lead" key={para.slice(0, 24)}>
							{para}
						</p>
					))}

					<h2>What I work with</h2>
					<ul className="stack">
						{stack.map((s) => (
							<li className="tag" key={s}>
								{s}
							</li>
						))}
					</ul>

					<h2>Find me</h2>
					<div className="contact-actions">
						<a className="btn" href={AUTHOR.github} target="_blank" rel="noopener noreferrer">
							<Icon name="github" size={16} /> GitHub
						</a>
						<a className="btn" href={`mailto:${AUTHOR.email}`}>
							<Icon name="mail" size={16} /> Email
						</a>
					</div>
				</div>

				<aside className="side glass">
					<h3>Highlights</h3>
					<ul className="highlights">
						{PROJECTS.map((p) => (
							<li key={p.name}>
								<span className="hl-glyph" aria-hidden="true">
									{p.glyph}
								</span>
								<div>
									<a href={p.live ?? p.github} target="_blank" rel="noopener noreferrer">
										{p.name}
									</a>
									<span className="hl-tag">{p.tagline}</span>
								</div>
							</li>
						))}
					</ul>
				</aside>
			</div>
		</section>
	);
}
