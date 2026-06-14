// Minimal inline-SVG icon set. Usage: <Icon name="github" />
export type IconName =
	| "github"
	| "mail"
	| "external"
	| "arrow"
	| "arrowUpRight"
	| "blog"
	| "spark"
	| "menu";

interface Props {
	name: IconName;
	size?: number;
	className?: string;
}

const paths: Record<IconName, string> = {
	github:
		'<path fill="currentColor" d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"/>',
	mail: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 6.5h18v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm0 .8 9 6 9-6"/>',
	external:
		'<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 13.5v4.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5"/>',
	arrow:
		'<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/>',
	arrowUpRight:
		'<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9"/>',
	blog: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/>',
	spark:
		'<path fill="currentColor" d="M12 2c.4 4.6 2.4 6.6 7 7-4.6.4-6.6 2.4-7 7-.4-4.6-2.4-6.6-7-7 4.6-.4 6.6-2.4 7-7Z"/>',
	menu: '<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/>',
};

export function Icon({ name, size = 18, className }: Props) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			className={className}
			aria-hidden="true"
			focusable="false"
			dangerouslySetInnerHTML={{ __html: paths[name] }}
		/>
	);
}
