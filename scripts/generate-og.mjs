// Rasterize scripts/og.svg -> public/og.png (1200x630) for social share cards.
// Run: node scripts/generate-og.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const svg = await readFile(join(here, "og.svg"));
await sharp(svg, { density: 160 })
	.resize(1200, 630)
	.png()
	.toFile(join(here, "..", "public", "og.png"));
console.log("wrote public/og.png");
