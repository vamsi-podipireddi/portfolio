interface Props {
	date: string | Date;
}

export function FormattedDate({ date }: Props) {
	const d = typeof date === "string" ? new Date(date) : date;
	return (
		<time dateTime={d.toISOString()}>
			{d.toLocaleDateString("en-us", {
				year: "numeric",
				month: "short",
				day: "numeric",
				timeZone: "UTC",
			})}
		</time>
	);
}
