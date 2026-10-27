# Mystagogia — MDX Editorial Collections (Prompt 09)

## Collections and file rules

The Astro 7 content layer uses `src/content.config.ts` to define **two MDX-only collections**:

- `src/content/library/` — researched, attributed historical and contemporary esoteric material.
- `src/content/grimoire/` — practical methods, experiments and firsthand observations.

The glob patterns are `**/*.mdx` only. No Markdown, JSON, or automatically generated article content is accepted into either collection. Both directories start **empty** (a noncontent `.gitkeep` retains each folder in Git). The existing `@astrojs/mdx` integration remains in `astro.config.mjs`; no new dependency or public article route was added.

## Data contract

The shared Zod schema is in `src/lib/editorial-schema.ts`:

| Property | Rule |
| --- | --- |
| `slug` | Required explicit ID/URL slug: lowercase ASCII letters or digits separated by single hyphens; no slash, spaces or punctuation. |
| `title`, `description` | Required, nonempty strings. |
| `status` | Required: `draft`, `review` or `published`. |
| `publishedAt` | Required **only** for `published` entries, must parse as valid date. Optional in other statuses. |
| `updatedAt` | Optional valid date. |
| `hero` | Optional `{ src, alt }` object with nonempty strings. |
| `topics` | Optional list of approved-slug-shaped IDs. Registry checks are reserved for Prompt 10. |
| `relatedIds` | Optional list of namespaced article references, e.g. `library:article-slug` or `grimoire:article-slug`. Referential validation arrives in later prompts. |
| `sourceIds` | Optional list of slug-shaped IDs; bibliography/source registry checks arrive in Prompt 10. |

Astro's `glob()` receives a per-collection `generateId` function that uses the explicit frontmatter `slug` as the entry's ID, independent of its filename. The function rejects missing/invalid slugs and **duplicate IDs from different files inside the same collection** before they can overwrite entries in Astro's store. The same slug is permitted across Library and Grimoire, whose collections are independent. Repeat reload of the same file does not constitute a collision.

A future published entry will resemble the following **documentation-only shape** (this example is not an article, approved subject, or content file):

```yaml
slug: example-entry
title: Example title
description: Editorial summary of this article
status: published
publishedAt: 2026-10-27
```

## Publication safety

`src/lib/editorial-public.ts` exports `getPublishedLibraryEntries()`, `getPublishedGrimoireEntries()`, `getPublishedLibraryEntry(id)` and `getPublishedGrimoireEntry(id)`. These are the **only approved accessors for future public article pages, listings, related content and search**. Each filters for `status === "published"` and a real parsed `publishedAt` date. Missing, draft, and review entries return no public result. Article pages are not created as part of Prompt 09.

**Editorial approval is separate from the schema**: adding an MDX file does not automatically make a route, authorize a topic or publish an article. Changing a file's status to published requires explicit human approval, complete citations where appropriate, and the relevant later route/template prompts.

## Verification — October 27, 2026

**PASS — [GitHub Actions run 40592213801](https://github.com/bwoodson72/blackarcanum/actions/runs/40592213801)**. A single temporary CI workflow and script created local, nonpublic fixtures during the run only; both are removed before PR review.

- `npm ci` — passed.
- `npm run test:content` — passed schema/unit checks for all three valid statuses, required publication dates, invalid statuses, invalid slugs, malformed dates, unknown related collection prefix, stable IDs, missing slugs, within-collection duplicate rejection, and valid cross-collection duplicate IDs.
- `npm run typecheck` — passed: **22 files, 0 errors, 0 warnings, 0 hints**.
- `npm run build` with **zero articles** — passed and emitted exactly two existing routes: `/` and `/about/`. No new Library, Grimoire, search or topic pages were produced.
- `npm audit --audit-level=high` — **0 vulnerabilities**.
- A temporary internal-only noindex route queried real Astro content collections with five MDX fixtures (Library: draft, review, published; Grimoire: draft, published). It verified exactly one published result from each collection, stable `entry.id === data.slug`, direct lookup exclusion of all drafts/reviews, and independent reuse of the same slug in Library and Grimoire.
- The temporary fixture build emitted only `/`, `/about/` and the noindex QA route; no public article pages.
- A sixth temporary MDX file intentionally collided with an existing Library slug. The build failed as expected with `duplicate slug`; the negative check passed.

**Remaining work is deliberately outside this prompt:** Prompt 10 creates approved topic/source registries and referential validation. Later tasks create article cards, editorial indexes and routes. No articles, topics, sources, or images are published by this change.

**Stopped after Prompt 09.**
