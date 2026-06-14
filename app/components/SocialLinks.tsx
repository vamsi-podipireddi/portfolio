import { SOCIALS } from "../lib/consts";
import { Icon } from "./Icon";
import "./SocialLinks.css";

interface Props {
	className?: string;
}

export function SocialLinks({ className }: Props) {
	return (
		<div className={["social-links", className].filter(Boolean).join(" ")}>
			{SOCIALS.map((s) => {
				const external = s.href.startsWith("http");
				return (
					<a
						key={s.name}
						href={s.href}
						target={external ? "_blank" : undefined}
						rel={external ? "noopener noreferrer" : undefined}
						aria-label={s.name}
						title={s.name}
					>
						<Icon name={s.icon} size={19} />
					</a>
				);
			})}
		</div>
	);
}
