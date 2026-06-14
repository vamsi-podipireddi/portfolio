import { AUTHOR } from "../lib/consts";
import { SocialLinks } from "./SocialLinks";
import "./Footer.css";

export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="site-footer">
			<div className="container foot-inner">
				<div className="foot-cta glass">
					<div>
						<p className="eyebrow">Get in touch</p>
						<h3>Let's build something.</h3>
						<p className="lead">
							Open to interesting problems in systems, local AI, and tooling.
						</p>
					</div>
					<a className="btn btn-primary" href={`mailto:${AUTHOR.email}`}>
						Say hello →
					</a>
				</div>
				<div className="foot-bottom">
					<span>
						© {year} {AUTHOR.name}
					</span>
					<SocialLinks />
					<span className="foot-built">Built with React Router · on Cloudflare</span>
				</div>
			</div>
		</footer>
	);
}
