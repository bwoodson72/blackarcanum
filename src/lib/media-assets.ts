import type { ImageMetadata } from "astro";
import type { MediaRecord } from "../data/media.ts";

/**
 * Vite imports only local, version-controlled Astro assets.
 * No URL/path from MDX is ever used as an arbitrary filesystem import.
 */
const assets = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/media/**/*.{jpg,jpeg,png,webp,avif,svg}",
  { eager: true },
);

export function resolveMediaAsset(record: MediaRecord): ImageMetadata {
  const path = record.sourceFile.replace(/^src\/assets\//, "../assets/");
  const asset = assets[path]?.default;
  if (!asset) {
    throw new Error(
      `Media "${record.id}": local image "${record.sourceFile}" is missing or could not be loaded by Astro.`,
    );
  }
  if (!Number.isFinite(asset.width) || asset.width <= 0 ||
      !Number.isFinite(asset.height) || asset.height <= 0) {
    throw new Error(`Media "${record.id}": image dimensions must be positive.`);
  }
  return asset;
}
