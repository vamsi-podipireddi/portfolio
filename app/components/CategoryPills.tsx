import "./CategoryPills.css";

interface Cat {
	id: string;
	label: string;
	count: number;
	active: boolean;
}

interface Props {
	cats: Cat[];
	onSelect: (id: string) => void;
}

export function CategoryPills({ cats, onSelect }: Props) {
	return (
		<div className="cp-row ed-scroll">
			{cats.map((c) => (
				<button
					key={c.id}
					type="button"
					className={c.active ? "cp-pill active" : "cp-pill"}
					onClick={() => onSelect(c.id)}
				>
					{c.label}
					<span className="cp-count">{c.count}</span>
				</button>
			))}
		</div>
	);
}
