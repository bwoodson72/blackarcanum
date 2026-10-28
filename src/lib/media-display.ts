import type { ImageMetadata } from "astro";
import type { MediaRecord } from "../data/media.ts";

export type MediaDisplayVariant = "decorative" | "card" | "hero" | "reference";

export interface MediaDisplayPlan {
  widths: number[];
  sizes: string;
  displayWidth: number;
  /** The original, exact image height ratio (not a cropped target). */
  displayHeight: number;
  eager: boolean;
  preserveFullImage: boolean;
}

const TARGET_WIDTHS: Record<MediaDisplayVariant, readonly number[]> = {
  decorative: [160, 240, 360, 480, 640, 960],
  card: [320, 480, 640, 800, 960, 1200],
  hero: [360, 540, 720, 960, 1200, 1440, 1800],
  reference: [360, 540, 720, 960, 1440, 1920, 2400],
};

export const MEDIA_SIZES: Record<MediaDisplayVariant, string> = {
  decorative: "(min-width: 960px) 480px, calc(100vw - 40px)",
  card: "(min-width: 1280px) 400px, (min-width: 768px) 48vw, calc(100vw - 40px)",
  hero: "(min-width: 760px) 720px, calc(100vw - 40px)",
  reference: "(min-width: 760px) 720px, calc(100vw - 40px)",
};

function positivePixels(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

/** Role-specific presentation cannot turn research evidence into a cropped card. */
export function validateMediaVariant(record: MediaRecord, variant: MediaDisplayVariant): void {
  if (record.role === "reference" && variant !== "reference") {
    throw new Error(`Media "${record.id}": reference images must use the uncropped reference variant.`);
  }
  if (record.role === "decorative" && variant !== "decorative") {
    throw new Error(`Media "${record.id}": decorative images require the decorative variant.`);
  }
  if (record.role === "editorial" && variant !== "card" && variant !== "hero") {
    throw new Error(`Media "${record.id}": editorial images must use card or hero.`);
  }
}

/**
 * Avoid upscaling. Offer multiple width candidates up to the approved
 * display maximum, plus a small-source fallback when appropriate.
 */
export function getMediaDisplayPlan(
  source: Pick<ImageMetadata, "width" | "height">,
  variant: MediaDisplayVariant,
  priority = variant === "hero",
): MediaDisplayPlan {
  if (!positivePixels(source.width) || !positivePixels(source.height)) {
    throw new Error("Cannot render media with invalid intrinsic dimensions.");
  }
  if (priority && variant !== "hero") {
    throw new Error("Only a primary hero image may request high network priority.");
  }

  const maxWidth = TARGET_WIDTHS[variant].at(-1)!;
  const ceiling = Math.min(source.width, maxWidth);
  const widths = TARGET_WIDTHS[variant].filter((value) => value <= ceiling);
  if (!widths.includes(ceiling)) widths.push(ceiling);
  widths.sort((a, b) => a - b);

  const preferredWidth = variant === "card" ? 600 : variant === "decorative" ? 480 : 720;
  const displayWidth = Math.min(source.width, preferredWidth);

  return {
    widths,
    sizes: MEDIA_SIZES[variant],
    displayWidth,
    displayHeight: Math.max(1, Math.round(source.height * displayWidth / source.width)),
    eager: priority,
    preserveFullImage: variant !== "card",
  };
}
