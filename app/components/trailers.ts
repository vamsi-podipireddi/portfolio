import type { ComponentType } from "react";
import { ScrollTrailer } from "./ScrollTrailer";
import { TrumpTrailer } from "./TrumpTrailer";

// Projects that ship a decorative hero trailer in place of a screenshot.
// Looked up by project id in FeaturedHero and ProjectDetail; add a project's
// trailer here once and both hero slots pick it up.
export const TRAILERS: Record<
	string,
	ComponentType<{ className?: string; onDone?: () => void }>
> = {
	scroll: ScrollTrailer,
	trump: TrumpTrailer,
};
