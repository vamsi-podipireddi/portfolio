import { type ChangeEvent, useMemo, useState } from "react";
import { BuildingNow } from "../components/BuildingNow";
import { CategoryPills } from "../components/CategoryPills";
import { FeaturedHero } from "../components/FeaturedHero";
import { Header } from "../components/Header";
import { ProjectDetail } from "../components/ProjectDetail";
import { ResultsGrid } from "../components/ResultsGrid";
import { Shelf } from "../components/Shelf";
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
	{ title: "New & Notable", sub: "fresh", ids: ["scroll", "trump", "statusline"] },
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

	// Dedup across shelves (first shelf wins) so no card repeats down the page;
	// drop any shelf left empty.
	const shelves = (() => {
		const seen = new Set<string>();
		return SHELVES.map((s) => {
			const items = s.ids
				.map((id) => byId[id])
				.filter((v): v is ProjectVM => !!v && !seen.has(v.id));
			for (const v of items) seen.add(v.id);
			return { title: s.title, sub: s.sub, items };
		}).filter((s) => s.items.length > 0);
	})();

	const activeCatLabel = CATEGORIES.find((c) => c.id === cat)?.label ?? "All";
	const n = filtered.length;
	const resultLabel = q
		? `${n} result${n === 1 ? "" : "s"} for “${query.trim()}”`
		: `${n} in ${activeCatLabel}`;

	// Featured rotator: trailer-backed projects cross-dissolve in this order.
	const featured = ["scroll", "trump"]
		.map((id) => byId[id])
		.filter((v): v is ProjectVM => !!v);
	const heroVms = featured.length > 0 ? featured : [vms[0]];
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
				name={SITE_TITLE}
				query={query}
				onSearch={onSearch}
				github={PROFILE.github}
			/>
			<FeaturedHero vms={heroVms} onOpen={openDetail} />
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
					{shelves.map((s) => (
						<Shelf
							key={s.title}
							title={s.title}
							sub={s.sub}
							items={s.items}
							onOpen={openDetail}
						/>
					))}
					<BuildingNow building={PROFILE.building} />
				</>
			)}
		</div>
	);
}
