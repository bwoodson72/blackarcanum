import { getCollection, getEntry } from "astro:content";

/**
 * Use ONLY these gated accessors when building public editorial routes,
 * indexes, related-reading sections or future search indexes.
 *
 * A validated date is mandatory even here, as a defense against accidental
 * publication if schema or loader behavior changes later.
 */
export async function getPublishedLibraryEntries() {
  const entries = await getCollection("library");
  return entries.filter(
    ({ data }) => data.status === "published" && data.publishedAt instanceof Date,
  );
}

export async function getPublishedGrimoireEntries() {
  const entries = await getCollection("grimoire");
  return entries.filter(
    ({ data }) => data.status === "published" && data.publishedAt instanceof Date,
  );
}

export async function getPublishedLibraryEntry(id: string) {
  const entry = await getEntry("library", id);
  return entry?.data.status === "published" && entry.data.publishedAt instanceof Date
    ? entry
    : undefined;
}

export async function getPublishedGrimoireEntry(id: string) {
  const entry = await getEntry("grimoire", id);
  return entry?.data.status === "published" && entry.data.publishedAt instanceof Date
    ? entry
    : undefined;
}
