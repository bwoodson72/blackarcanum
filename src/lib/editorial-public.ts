import { getCollection, getEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";

/** Layout previews must never become public routes, regardless of noindex. */
export function canPublishEditorialEntry(
  entry: CollectionEntry<"library"> | CollectionEntry<"grimoire">,
): boolean {
  return entry.data.status === "published" &&
    entry.data.preview !== true &&
    entry.data.publishedAt instanceof Date &&
    Number.isFinite(entry.data.publishedAt.valueOf());
}

/**
 * Use ONLY these gated accessors when building public editorial routes,
 * indexes, related-reading sections or future search indexes.
 *
 * A validated date is mandatory even here, as a defense against accidental
 * publication if schema or loader behavior changes later.
 */
export async function getPublishedLibraryEntries() {
  const entries = await getCollection("library");
  return entries.filter(canPublishEditorialEntry);
}

export async function getPublishedGrimoireEntries() {
  const entries = await getCollection("grimoire");
  return entries.filter(canPublishEditorialEntry);
}

export async function getPublishedLibraryEntry(id: string) {
  const entry = await getEntry("library", id);
  return entry && canPublishEditorialEntry(entry) ? entry : undefined;
}

export async function getPublishedGrimoireEntry(id: string) {
  const entry = await getEntry("grimoire", id);
  return entry && canPublishEditorialEntry(entry) ? entry : undefined;
}
