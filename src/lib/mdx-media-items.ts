import { media } from "../data/media.ts";
import { getMediaRecord } from "./media-registry.ts";

/** Ordered, registry-backed image choices in MDX. Never accept raw image URLs. */
export interface MdxMediaItem {
  id: string;
  /** Only editorial artwork can have a contextual caption override. */
  caption?: string;
  /** Optional for reference images; defaults off and preserves no-JS reading. */
  lightbox?: boolean;
}

export interface MdxComparisonItem extends MdxMediaItem {
  label: string;
}

export function resolveMdxMediaItem(item: MdxMediaItem): MdxMediaItem & { kind: "article" | "reference" } {
  if (!item || typeof item.id !== "string") {
    throw new Error("MDX multi-image items require a registered media ID.");
  }
  const record = getMediaRecord(item.id, media);
  if (record.role === "decorative") {
    throw new Error("Decorative media cannot be presented as an editorial figure.");
  }
  if (item.caption !== undefined &&
      (typeof item.caption !== "string" || !item.caption.trim() || record.role === "reference")) {
    throw new Error("Only editorial artwork accepts a nonempty contextual caption.");
  }
  if (item.lightbox !== undefined && typeof item.lightbox !== "boolean") {
    throw new Error("MDX lightbox must be boolean when specified.");
  }
  if (item.lightbox && record.role !== "reference") {
    throw new Error("Only approved reference figures can enable a lightbox.");
  }
  return { ...item, kind: record.role === "reference" ? "reference" : "article" };
}
