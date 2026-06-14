import { Link } from "react-router";
import { seo } from "../lib/seo";

export function meta() {
	return seo({
		title: "404 — Page not found",
		description: "That page could not be found.",
		path: "/404",
	});
}

export default function NotFound() {
	return (
		<section className="section container" style={{ maxWidth: 760 }}>
			<p className="eyebrow">404</p>
			<h1>Page not found</h1>
			<p className="lead">
				That page doesn't exist.{" "}
				<Link to="/" style={{ textDecoration: "underline" }}>
					Back home
				</Link>
				.
			</p>
		</section>
	);
}
