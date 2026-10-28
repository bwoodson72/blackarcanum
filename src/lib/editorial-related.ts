import type { CollectionEntry } from "astro:content";
import type { EditorialSection } from "./editorial-qa";
import { toPublishedArticle } from "./editorial-presentation.ts";
import type { PublishedArticleView } from "./editorial-presentation";

/** Author-selected IDs are always explicit collection:slug pairs. */
export interface RelatedArticleRequest {
  collection: EditorialSection;
  id: string;
  relatedIds?: readonly string[];
}

export type RelatedCandidate =
  | { collection: "library"; entry: CollectionEntry<"library"> }
  | { collection: "grimoire"; entry: CollectionEntry<"grimoire"> };

const RELATED_ID_PATTERN = /^(library|grimoire):([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function parseRelatedArticleId(value: string): {
  collection: EditorialSection;
  id: string;
} {
  const match = RELATED_ID_PATTERN.exec(value);
  if (!match) {
    throw new Error(`Invalid related article ID "${value}"; use library:slug or grimoire:slug.`);
  }
  return { collection: match[1] as EditorialSection, id: match[2]! };
}

/**
 * Resolves only explicit editorial selections; never infers topic matches.
 * Unknown, unpublished, invalid-date and self-links fail closed, while
 * repeated selected IDs are deduplicated without changing author order.
 */
export function resolveRelatedArticles(
  request: RelatedArticleRequest,
  candidates: readonly RelatedCandidate[],
): PublishedArticleView[] {
  if (!request.relatedIds?.length) return [];

  const byKey = new Map<string, RelatedCandidate>();
  for (const candidate of candidates) {
    const key = `${candidate.collection}:${candidate.entry.id}`;
    if (byKey.has(key)) {
      throw new Error(`Duplicate article entry "${key}" in the related-reading lookup.`);
    }
    byKey.set(key, candidate);
  }

  const selected = new Set<string>();
  const resolved: PublishedArticleView[] = [];
  const origin = `${request.collection}:${request.id}`;

  for (const key of request.relatedIds) {
    const { collection, id } = parseRelatedArticleId(key);
    if (key === origin) {
      throw new Error(`Article "${origin}" cannot link to itself as related reading.`);
    }
    if (selected.has(key)) continue;
    selected.add(key);

    const candidate = byKey.get(key);
    if (!candidate) {
      throw new Error(`Article "${origin}" links to missing related article "${key}".`);
    }

    // Also verifies the publication date and constructs an approved local URL.
    const article = toPublishedArticle(candidate);
    if (!article) {
      throw new Error(`Article "${origin}" links to unpublished related article "${key}".`);
    }

    if (article.collection !== collection || article.id !== id) {
      throw new Error(`Related article "${key}" did not resolve to the requested entry.`);
    }
    resolved.push(article);
  }

  return resolved;
}
