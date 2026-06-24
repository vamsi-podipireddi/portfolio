import "./Header.css";

export function Header() {
	return (
		<header className="site-header">
			<nav className="container" aria-label="Primary">
				<a href="/" className="brand" aria-label="Home">
					<span className="brand-mark">P</span>
					<span className="brand-name">Projects</span>
				</a>
			</nav>
		</header>
	);
}
