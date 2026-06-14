import { Link, useParams } from "react-router";
import { FormattedDate } from "../components/FormattedDate";
import { Icon } from "../components/Icon";
import { getPost } from "../lib/posts";
import { seo } from "../lib/seo";
import "./post.css";

export function meta({ params }: { params: { slug?: string } }) {
	const post = getPost(params.slug ?? "");
	if (!post) {
		return seo({
			title: "Post not found",
			description: "That post could not be found.",
			path: `/blog/${params.slug ?? ""}`,
		});
	}
	const fm = post.frontmatter;
	return seo({
		title: fm.title,
		description: fm.description,
		path: `/blog/${post.slug}`,
		image: fm.heroImage,
		type: "article",
		pubDate: fm.pubDate,
		updatedDate: fm.updatedDate,
	});
}

export default function BlogPost() {
	const { slug } = useParams();
	const post = getPost(slug ?? "");

	if (!post) {
		return (
			<section className="section container" style={{ maxWidth: 760 }}>
				<p className="eyebrow">Not found</p>
				<h1>Post not found</h1>
				<p className="lead">
					<Link to="/blog" style={{ textDecoration: "underline" }}>
						Back to blog
					</Link>
				</p>
			</section>
		);
	}

	const { title, description, pubDate, updatedDate, heroImage, heroImageAlt } = post.frontmatter;
	const Content = post.Component;

	return (
		<article className="post container">
			<Link to="/blog" className="back">
				<Icon name="arrow" size={15} className="flip" /> Back to blog
			</Link>

			<header className="post-header">
				<div className="post-date">
					<FormattedDate date={pubDate} />
					{updatedDate && (
						<span className="updated">
							{" "}
							· updated <FormattedDate date={updatedDate} />
						</span>
					)}
				</div>
				<h1>{title}</h1>
				{description && <p className="lead post-desc">{description}</p>}
			</header>

			{heroImage && (
				<div className="hero-image">
					<img width={1020} height={510} src={heroImage} alt={heroImageAlt ?? ""} />
				</div>
			)}

			<div className="prose">
				<Content />
			</div>
		</article>
	);
}
