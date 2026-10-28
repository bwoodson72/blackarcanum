import { getCollection } from "astro:content";
import { resolveRelatedArticles } from "./editorial-related";
import type { RelatedArticleRequest, RelatedCandidate } from "./editorial-related";

/**
 * Content-layer adapter used by BOTH article routes. No collection reads
 * (and no visible related section) when the editor selected no related IDs.
 */
export async function getPublishedRelatedArticles(request: RelatedArticleRequest) {
  if (!request.relatedIds?.length) return [];

  const [library, grimoire] = await Promise.all([
    getCollection("library"),
    getCollection("grimoire"),
  ]);
  const candidates: RelatedCandidate[] = [
    ...library.map((entry) => ({ collection: "library" as const, entry })),
    ...grimoire.map((entry) => ({ collection: "grimoire" as const, entry })),
  ];

  return resolveRelatedArticles(request, candidates);
}
