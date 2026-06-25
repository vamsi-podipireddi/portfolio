import { type ChangeEvent, useMemo, useState } from "react";
import { AboutStrip } from "../components/AboutStrip";
import { BuildingNow } from "../components/BuildingNow";
import { CategoryPills } from "../components/CategoryPills";
import { FeaturedHero } from "../components/FeaturedHero";
import { Header } from "../components/Header";
import { ProjectDetail } from "../components/ProjectDetail";
import { ResultsGrid } from "../components/ResultsGrid";
import { Shelf } from "../components/Shelf";
import { TopCharts } from "../components/TopCharts";
import {
	CATEGORIES,
	PROFILE,
	PROJECTS,
	SITE_DESCRIPTION,
	SITE_TITLE,
} from "../lib/consts";
import { seo } from "../lib/seo";
import { type ProjectVM, toVM } from "../lib/vm";
import "./home.css";

export function meta() {
	return seo({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" });
}

// Curated editorial shelves (ids reference PROJECTS).
const SHELVES = [
	{ title: "New & Notable", sub: "fresh", ids: ["scroll", "lekha", "statusline", "oldphoto"] },
	{ title: "AI / ML", sub: "intelligence", ids: ["lekha", "oldphoto"] },
	{ title: "Arcade", sub: "coming soon", ids: ["hextris", "g2048", "hexgl", "darkroom"] },
];

export default function Home() {
	const [query, setQuery] = useState("");
	const [cat, setCat] = useState<string>("all");
	const [view, setView] = useState<"browse" | "detail">("browse");
	const [sel, setSel] = useState<string | null>(null);

	const vms = useMemo(() => PROJECTS.map(toVM), []);
	const byId = useMemo(() => {
		const m: Record<string, ProjectVM> = {};
		for (const v of vms) m[v.id] = v;
		return m;
	}, [vms]);

	const openDetail = (id: string) => {
		setSel(id);
		setView("detail");
		if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	};
	const closeDetail = () => setView("browse");
	const onSearch = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
	const selectCat = (id: string) => {
		setCat(id);
		setQuery("");
	};

	const q = query.trim().toLowerCase();
	const matches = (p: ProjectVM) =>
		(cat === "all" || p.cat === cat) &&
		(!q ||
			`${p.name} ${p.pitch} ${p.desc} ${p.tags.join(" ")}`.toLowerCase().includes(q));
	const filtered = vms.filter(matches);
	const showResults = !!q || cat !== "all";

	const cats = CATEGORIES.map((c) => ({
		id: c.id,
		label: c.label,
		count: c.id === "all" ? vms.length : vms.filter((p) => p.cat === c.id).length,
		active: c.id === cat,
	}));

	const shelves = SHELVES.map((s) => ({
		title: s.title,
		sub: s.sub,
		items: s.ids.map((id) => byId[id]).filter(Boolean) as ProjectVM[],
	}));

	const topCharts = vms
		.filter((p) => p.cat !== "games" && p.stars != null)
		.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
		.map((p, i) => ({ ...p, rankTxt: String(i + 1).padStart(2, "0") }));

	const countProjects = vms.filter((p) => p.cat !== "games").length;
	const countLive = vms.filter((p) => p.status === "live").length;

	const activeCatLabel = CATEGORIES.find((c) => c.id === cat)?.label ?? "All";
	const n = filtered.length;
	const resultLabel = q
		? `${n} result${n === 1 ? "" : "s"} for “${query.trim()}”`
		: `${n} in ${activeCatLabel}`;

	const hero = byId.scroll ?? vms[0];
	const selected = (sel ? byId[sel] : undefined) ?? vms[0];

	if (view === "detail") {
		return (
			<div className="store">
				<ProjectDetail vm={selected} onBack={closeDetail} />
			</div>
		);
	}

	return (
		<div className="store">
			<Header
				name={PROFILE.name}
				query={query}
				onSearch={onSearch}
				github={PROFILE.github}
			/>
			<AboutStrip
				name={PROFILE.name}
				tagline={PROFILE.tagline}
				buildingShort={PROFILE.buildingShort}
				countProjects={countProjects}
				countLive={countLive}
			/>
			<CategoryPills cats={cats} onSelect={selectCat} />

			{showResults ? (
				<ResultsGrid
					resultLabel={resultLabel}
					items={filtered}
					query={query.trim()}
					onOpen={openDetail}
				/>
			) : (
				<>
					<FeaturedHero vm={hero} onOpen={openDetail} />
					{shelves.map((s) => (
						<Shelf
							key={s.title}
							title={s.title}
							sub={s.sub}
							items={s.items}
							onOpen={openDetail}
						/>
					))}
					<TopCharts items={topCharts} onOpen={openDetail} />
					<BuildingNow building={PROFILE.building} />
				</>
			)}

			<footer className="store-footer">
				<span>© 2026 — {PROFILE.name}</span>
				<span className="store-footer-links">
					<a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
						GitHub ↗
					</a>
					<a href={PROFILE.site} target="_blank" rel="noopener noreferrer">
						Live site ↗
					</a>
				</span>
			</footer>
		</div>
	);
}
