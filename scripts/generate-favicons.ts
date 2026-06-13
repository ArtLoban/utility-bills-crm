/**
 * Regenerates the raster favicons from the master `app/icon.svg`.
 *
 * `app/icon.svg` is the single source of truth for the brand mark. The browser
 * tab uses the SVG directly; this script derives the raster fallbacks that
 * SVG cannot cover:
 *   - `apple-icon.png` — iOS home-screen icon (no SVG support there).
 *   - `favicon.ico`    — legacy browsers and direct `/favicon.ico` requests.
 *
 * Run after editing the SVG: `npm run icons:generate`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const APP_DIR = resolve(import.meta.dirname, "..", "app");
const SOURCE_SVG = resolve(APP_DIR, "icon.svg");

const APPLE_ICON_SIZE = 180;
const FAVICON_SIZES = [16, 32, 48];

const renderPng = (svg: Buffer, size: number): Promise<Buffer> =>
  sharp(svg).resize(size, size).png().toBuffer();

const generate = async (): Promise<void> => {
  const svg = await readFile(SOURCE_SVG);

  const applePng = await renderPng(svg, APPLE_ICON_SIZE);
  await writeFile(resolve(APP_DIR, "apple-icon.png"), applePng);

  const faviconPngs = await Promise.all(FAVICON_SIZES.map((size) => renderPng(svg, size)));
  const ico = await pngToIco(faviconPngs);
  await writeFile(resolve(APP_DIR, "favicon.ico"), ico);

  console.log(
    `Generated apple-icon.png (${APPLE_ICON_SIZE}px) and favicon.ico (${FAVICON_SIZES.join("/")}px) from icon.svg`,
  );
};

generate().catch((error: unknown) => {
  console.error("Favicon generation failed:", error);
  process.exit(1);
});
