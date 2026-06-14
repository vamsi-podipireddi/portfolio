import { Link } from "react-router";
import { FormattedDate } from "../components/FormattedDate";
import { Icon } from "../components/Icon";
import { posts } from "../lib/posts";
import { seo } from "../lib/seo";
import "./blog.css";

export function meta() {
	return seo({
		title: "Blog · Vamsi Krishna Podipireddi",
		description: "Notes on systems, local AI, and developer tooling.",
		path: "/blog",
	});
}

export default function BlogIndex() {
	return (
		<section className="section container blog-page">
			<header className="blog-head">
				<p className="eyebrow">Notes</p>
				<h1>Blog</h1>
				<p className="lead">
					Occasional notes on the things I build — systems, local AI, and developer tooling.
				</p>
			</header>

			{posts.length === 0 ? (
				<p className="lead">No posts yet. Check back soon.</p>
			) : (
				<ul className="posts">
					{posts.map((post) => (
						<li key={post.slug}>
							<Link to={`/blog/${post.slug}`} className="post-card glass">
								<div className="post-card-meta">
									<FormattedDate date={post.frontmatter.pubDate} />
								</div>
								<h2 className="post-card-title">{post.frontmatter.title}</h2>
								<p className="post-card-desc">{post.frontmatter.description}</p>
								<span className="read">
									Read <Icon name="arrow" size={15} />
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
