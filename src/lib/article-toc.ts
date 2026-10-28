/**
 * The Astro MDX renderer owns heading text and unique, deterministic IDs.
 * Use those exact IDs; never re-slug Markdown or maintain parallel contents data.
 */
export interface ArticleHeading {
  depth: number;
  slug: string;
  text: string;
}

/** Two headings rarely justify navigation. Three useful sections do. */
export const MIN_TOC_HEADINGS = 3;

/** Preserve the original MDX order, including h3 children of h2 sections. */
export function getArticleTableOfContents(
  headings: readonly ArticleHeading[],
): ArticleHeading[] {
  const eligible = headings.filter(
    (heading) =>
      (heading.depth === 2 || heading.depth === 3) &&
      heading.slug.trim().length > 0 &&
      heading.text.trim().length > 0,
  );

  if (eligible.length < MIN_TOC_HEADINGS) return [];

  const ids = new Set<string>();
  for (const heading of eligible) {
    if (ids.has(heading.slug)) {
      throw new Error(`MDX generated a duplicate article heading ID "${heading.slug}".`);
    }
    ids.add(heading.slug);
  }

  return eligible;
}
