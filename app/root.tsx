import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	type LinksFunction,
} from "react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SITE_TITLE } from "./lib/consts";
import "./styles/global.css";

export const links: LinksFunction = () => [
	{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
	},
	{ rel: "alternate", type: "application/rss+xml", title: SITE_TITLE, href: "/rss.xml" },
	{ rel: "sitemap", href: "/sitemap.xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<meta name="theme-color" content="#07070d" />
				<Meta />
				<Links />
			</head>
			<body>
				<a href="#main" className="skip-link">
					Skip to content
				</a>
				<div className="bg-decor" aria-hidden="true">
					<span className="blob a" />
					<span className="blob b" />
				</div>
				<Header />
				<main id="main">{children}</main>
				<Footer />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
	const title = isRouteErrorResponse(error)
		? `${error.status} — ${error.statusText}`
		: "Something went wrong";
	return (
		<section className="section container" style={{ maxWidth: 760 }}>
			<p className="eyebrow">Error</p>
			<h1>{title}</h1>
			<p className="lead">
				That page could not be found.{" "}
				<a href="/" style={{ textDecoration: "underline" }}>
					Back home
				</a>
				.
			</p>
		</section>
	);
}
