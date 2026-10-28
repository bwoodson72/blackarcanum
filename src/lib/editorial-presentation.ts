import type { CollectionEntry } from "astro:content";
import { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";
import type { EditorialSection } from "./editorial-qa";

/**
 * A small, source-independent view model. Card templates never ingest raw
 * MDX/frontmatter or guess the public URL of an unpublished entry.
 */
export interface PublishedArticleView {
  id: string;
  collection: EditorialSection;
  title: string;
  href: string;
  excerpt?: string;
  publishedAt?: Date;
  /** Temporary layout content, never presented as finished scholarship. */
  preview?: boolean;
  updatedAt?: Date;
  /** Explicit registered editorial image for a hero and its archive card. */
  mediaId?: string;
  image?: {
    src: string;
    /** Real editorial alt text, not a title invented by the card. */
    alt: string;
  };
}

type EditorialEntry =
  | { collection: "library"; entry: CollectionEntry<"library"> }
  | { collection: "grimoire"; entry: CollectionEntry<"grimoire"> };

export function articlePath(collection: EditorialSection, id: string): string {
  if (!EDITORIAL_SLUG_PATTERN.test(id)) {
    throw new Error(`Invalid ${collection} article ID "${id}".`);
  }
  return `/${collection}/${id}/`;
}

/**
 * Returns undefined for drafts/review; callers should use published-only
 * helpers first, with this check as an extra fail-closed presentation gate.
 */
export function toPublishedArticle({ collection, entry }: EditorialEntry): PublishedArticleView | undefined {
  const { data } = entry;
  if (data.status !== "published" ||
      !(data.publishedAt instanceof Date) ||
      Number.isNaN(data.publishedAt.valueOf())) {
    return undefined;
  }

  return {
    id: entry.id,
    collection,
    title: data.title,
    href: articlePath(collection, entry.id),
    excerpt: data.description,
    publishedAt: data.publishedAt,
    ...(data.preview === true ? { preview: true } : {}),
    ...(data.updatedAt instanceof Date && !Number.isNaN(data.updatedAt.valueOf())
      ? { updatedAt: data.updatedAt }
      : {}),
    ...(data.featuredMediaId ? { mediaId: data.featuredMediaId } : {}),
    ...(data.hero ? { image: { src: data.hero.src, alt: data.hero.alt } } : {}),
  };
}
