# Mystagogia — Prompt 18: Curated Related Reading

## Purpose and editorial control

Both article routes now support a small **Related reading** section after the article's notes and bibliography, before the back-to-archive link. Articles do not acquire relationships automatically. The list appears **only** when an editor explicitly supplies qualified stable IDs in the article's existing `relatedIds` frontmatter field.

A Library source might include:

```yaml
relatedIds:
  - grimoire:reviewed-practice
  - library:historical-context
```

This example is syntax only; the named destination articles have to exist and be published before the build can succeed. Prefixes `library:` and `grimoire:` distinguish collections, so the same slug in two collections is never ambiguous. Values are sorted **only by their frontmatter order**; no automatic topic, tag, category, recent-post, affiliate, or relevance algorithm exists.

Duplicate related IDs in a given article are **displayed once**, retaining their first position. A relationship pointing back to the source article, to an unknown ID, to a draft/review entry, or to an entry without a valid publication date **fails closed**. The existing site-wide `validateEditorialIntegrity()` check continues to reject self/missing/unpublished links during the build. The route-level resolver independently validates destinations via `toPublishedArticle()`, including date validity, and constructs their safe URL through `articlePath()` rather than trusting arbitrary strings.

Links are one-way unless an editor explicitly adds a reciprocal ID on the other article. Display titles, descriptions, section labels, and preview badges are always taken from the target's **published editorial record**. No author identity, image, external URL, topic match, or other synthesized text is used.

## Components and responsive UI

- `src/lib/editorial-related.ts`: pure, testable ordered resolver and ID parser. It normalizes only explicitly selected published articles; it rejects missing or unsafe targets and deduplicates repeated selections.
- `src/lib/editorial-related-public.ts`: Astro content-layer adapter. It **does not fetch collections at all** if the current article has no `relatedIds`. When present, it loads both existing collections and passes their actual records to the resolver.
- `src/components/editorial/RelatedReading.astro`: one semantic related article, including a section-specific eyebrow, exact target title, optional true `preview` label, and canonical same-site link. The card variant displays the existing editorial description; the compact variant omits it.
- `src/components/editorial/RelatedArticles.astro`: conditional `<section aria-labelledby="related-reading-heading">`, ordered list, and `variant="compact" | "cards"` layouts. Empty lists produce **no heading, landmark, empty card, or placeholder**. All links are native keyboard-focusable anchors with visible focus states.
- Library article pages use the **compact text-list** presentation; Grimoire pages use the **editorial card** presentation. On mobile all entries stack in the existing `~720px` reading measure; cards become two columns only where width permits (≥768px). Both variants use the existing parchment/charcoal/sage/oxide/gold tokens. The existing optional wide right-context slot is unchanged and remains empty without authored content.

## Actual site content and review boundary

The three Greek-deity preview articles have **not** been assigned automatic or assumed related IDs. They retain their preview/noindex status. Links already written directly in their prose also remain untouched. The new section will be visible on a real published page **only when its editor supplies approved relationships**. This avoids turning a layout test into an unsupported editorial recommendation.

## Validation and acceptance

`npm run qa:content` now runs `npm run test:related` before the normal Astro production build. It verifies source-order preservation, duplicate suppression, cross-collection same-slug disambiguation, canonical URLs, previews, and rejection of malformed IDs, missing links, draft/review targets, invalid dates and self-links.

The `Editorial Quality` workflow on `master` adds two CI-only checks after the existing tests:

1. `npm run test:related-fixtures` temporarily swaps the actual MDX folders for isolated published and draft fixtures. Negative **Astro builds** assert that missing, draft, review and self-linking targets fail. A final successful build verifies both directions of cross-collection links, same-collection links, deduplicated author order, compact/card variants, omitted empty headings and unpublished page suppression. The real content directories are restored in `finally`, and fixture data is never committed.
2. `npm run test:related-browser` serves that temporary built output locally to Chrome. It checks 375/768/1024/1440px widths, no page overflow, the 720px reading measure, compact versus two-column card variants, exact ordered hrefs, keyboard Enter navigation to the correct section, and no related section on an uncurated article.

No new topic registry, related IDs on existing previews, affiliate links, artwork, new published content, dependencies, or next-prompt media work is introduced.

**Stopped after Prompt 18.**
