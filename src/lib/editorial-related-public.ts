import { getCollection } from "astro:content";
import { resolveRelatedArticles } from "./editorial-related";
import { canPublishEditorialEntry } from "./editorial-public";
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
    ...library.filter(canPublishEditorialEntry).map((entry) => ({ collection: "library" as const, entry })),
    ...grimoire.filter(canPublishEditorialEntry).map((entry) => ({ collection: "grimoire" as const, entry })),
  ];

  return resolveRelatedArticles(request, candidates);
}
