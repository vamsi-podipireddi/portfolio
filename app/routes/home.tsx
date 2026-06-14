import { Link } from "react-router";
import { FormattedDate } from "../components/FormattedDate";
import { Icon } from "../components/Icon";
import { ProjectCard } from "../components/ProjectCard";
import { AUTHOR, PROJECTS, SITE_DESCRIPTION } from "../lib/consts";
import { posts } from "../lib/posts";
import { seo } from "../lib/seo";
import "./home.css";

export function meta() {
	return seo({
		title: `${AUTHOR.name} — ${AUTHOR.role}`,
		description: SITE_DESCRIPTION,
		path: "/",
	});
}

export default function Home() {
	const recent = posts.slice(0, 3);

	return (
		<>
			{/* Hero */}
			<section className="hero container">
				<p className="eyebrow">{AUTHOR.role}</p>
				<h1 className="hero-title">
					Hi, I'm <span className="gradient-text">{AUTHOR.name}</span>.
				</h1>
				<p className="hero-tagline">{AUTHOR.tagline}</p>
				<div className="hero-actions">
					<a className="btn btn-primary" href="#projects">
						View projects <Icon name="arrow" size={16} />
					</a>
					<a className="btn" href={AUTHOR.github} target="_blank" rel="noopener noreferrer">
						<Icon name="github" size={16} /> GitHub
					</a>
					<a className="btn" href={`mailto:${AUTHOR.email}`}>
						<Icon name="mail" size={16} /> Email
					</a>
				</div>
				<div className="hero-meta">
					<span className="dot" /> Available for interesting work · {AUTHOR.domain}
				</div>
			</section>

			{/* Projects */}
			<section className="section container" id="projects">
				<header className="section-head">
					<div>
						<p className="eyebrow">Selected work</p>
						<h2>Projects</h2>
					</div>
					<p className="lead">
						Things I've built — each with source, and a live link where you can click around.
					</p>
				</header>
				<div className="projects-grid">
					{PROJECTS.map((p) => (
						<ProjectCard project={p} key={p.name} />
					))}
				</div>
			</section>

			{/* About teaser */}
			<section className="section container">
				<div className="about-card glass">
					<div className="about-body">
						<p className="eyebrow">About</p>
						<h2>A little about me</h2>
						<p className="lead">{AUTHOR.bio[0]}</p>
						<Link className="btn btn-sm" to="/about">
							More about me <Icon name="arrowUpRight" size={15} />
						</Link>
					</div>
					<div className="about-aside" aria-hidden="true">
						<div className="stat">
							<span className="num">{PROJECTS.length}</span>
							<span className="lbl">shipped projects</span>
						</div>
						<div className="stat">
							<span className="num">100%</span>
							<span className="lbl">local-first AI</span>
						</div>
						<div className="stat">
							<span className="num">∞</span>
							<span className="lbl">curiosity</span>
						</div>
					</div>
				</div>
			</section>

			{/* Writing */}
			{recent.length > 0 && (
				<section className="section container" id="writing">
					<header className="section-head">
						<div>
							<p className="eyebrow">Notes</p>
							<h2>Recent writing</h2>
						</div>
						<Link className="btn btn-sm" to="/blog">
							All posts <Icon name="arrow" size={15} />
						</Link>
					</header>
					<ul className="post-list">
						{recent.map((post) => (
							<li key={post.slug}>
								<Link to={`/blog/${post.slug}`} className="post-row glass">
									<div className="post-row-main">
										<h3 className="post-row-title">{post.frontmatter.title}</h3>
										<p className="post-row-desc">{post.frontmatter.description}</p>
									</div>
									<div className="post-row-meta">
										<FormattedDate date={post.frontmatter.pubDate} />
										<Icon name="arrowUpRight" size={16} />
									</div>
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}
		</>
	);
}
