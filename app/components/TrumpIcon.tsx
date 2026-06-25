import type { SVGProps } from "react";

// Trump's app mark — a playing card with a spade pip. Kept inline (mirrors
// ScrollIcon / GithubIcon) so it lives beside the project data; API matches a
// lucide icon (`size` prop, inherits color via currentColor, stroke-based).
export function TrumpIcon({
	size = 24,
	...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			{...props}
		>
			<rect x="5" y="3" width="14" height="18" rx="2.5" />
			<path d="M12 7c0 3 3.5 3.5 3.5 6 0 1.6-1.8 2-2.9 1 .2 1.2.6 1.6 1.2 2h-3.6c.6-.4 1-.8 1.2-2-1.1 1-2.9.6-2.9-1C8.5 10 12 10 12 7Z" />
		</svg>
	);
}
