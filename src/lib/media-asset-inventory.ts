/**
 * Actual Astro/Vite asset inventory used during static build QA.
 * Keys are discovered at compile time without importing/decoding images;
 * an empty src/assets/media tree is valid.
 *
 * Masters are kept OUTSIDE this import-glob, under media-originals/, so the
 * website will never accidentally optimize or publish archival masters.
 */
const assets = import.meta.glob("../assets/media/**/*.{jpg,jpeg,png,webp,avif,svg}");

export const mediaAssetFiles: readonly string[] = Object.keys(assets)
  .map((key) => key.replace(/^\.\.\/assets\//, "src/assets/"));
