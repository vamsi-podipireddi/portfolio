import { NavLink } from "react-router";
import { AUTHOR } from "../lib/consts";
import { SocialLinks } from "./SocialLinks";
import "./Header.css";

function navClass({ isActive }: { isActive: boolean }) {
	return isActive ? "nav-link active" : "nav-link";
}

export function Header() {
	return (
		<header className="site-header">
			<nav className="container" aria-label="Primary">
				<a href="/" className="brand" aria-label="Home">
					<span className="brand-mark">V</span>
					<span className="brand-name">{AUTHOR.shortName}</span>
				</a>

				<div className="nav-links">
					<NavLink to="/" end className={navClass}>
						Home
					</NavLink>
					<NavLink to="/#projects" className="nav-link">
						Projects
					</NavLink>
					<NavLink to="/blog" className={navClass}>
						Blog
					</NavLink>
					<NavLink to="/about" className={navClass}>
						About
					</NavLink>
				</div>

				<SocialLinks className="header-socials" />
			</nav>
		</header>
	);
}
