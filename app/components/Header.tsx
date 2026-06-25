import "./Header.css";
import { Search } from "lucide-react";
import type { ChangeEvent } from "react";
import { GithubIcon } from "./GithubIcon";

interface Props {
	name: string;
	query: string;
	onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
	github: string;
}

export function Header({ name, query, onSearch, github }: Props) {
	return (
		<header className="hd">
			<div className="hd-brand">
				<span className="hd-mono">VA</span>
				<span className="hd-name">{name}</span>
			</div>
			<div className="hd-search">
				<span className="hd-search-icon" aria-hidden="true">
					<Search size={16} />
				</span>
				<input
					value={query}
					onChange={onSearch}
					placeholder="Search projects, tags, tech…"
					className="hd-input"
				/>
			</div>
			<a
				href={github}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				className="hd-gh"
			>
				<GithubIcon size={17} />
			</a>
		</header>
	);
}
