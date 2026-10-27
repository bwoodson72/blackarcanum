# Mystagogia — Grimoire Hub and Archive Routes (Prompt 14)

## Editorial scope and distinct experience

The Grimoire is the practice-oriented companion to the source-led Library. Its introduction addresses **original methods, adaptations, experiments and practitioner observations** in the editorial third person; it never invents a practitioner identity or asserts that any particular experiment has occurred. The site currently contains **no approved Grimoire articles**.

The Grimoire hub uses the shared token palette but a distinctive **deep-brown and gold masthead** and a warm-paper **horizontal editorial listing** on desktop, stacking into a single reading column on mobile. Every entry retains its semantic article title, date and optional excerpt. The first entry in each chronological page is placed into a larger **lead archive row**, not the manually curated feature registry from Prompt 11. This is a layout choice only: it does **not** auto-approve a featured publication or alter its editorial status. Entries remain in exact publication order. The numbered list below starts with the next chronological entry.

The empty hub contains an introduction explaining that **no Grimoire entries have yet been published**, with working links to the Library and About page. It adds no journal, fictional observations, unapproved artwork, pseudo-sources, CTA products or biography.

## Publication, paths and data contracts

- `/grimoire/` is **always available**, even with no published content. While empty, it is marked `noindex` so an empty archive is not promoted as indexed research.
- Only actual published Grimoire MDX records from `getPublishedGrimoireEntries()` enter the archive. A date must exist and be valid. No Library content can appear even when the same slug exists in both collections.
- `/grimoire/page/[page]/` pages are generated at build time using Astro's `paginate()`, sorted with the same `sortPublishedEntries()` helper as the Library. A single **`EDITORIAL_PAGE_SIZE = 12`** constant controls both archive routes and the displayed count.
- Newest publication date first; equal-date ties break by stable article ID ascending. The canonical first-page **path** is `/grimoire/`; numbered paths start at **`/grimoire/page/2/`**. No page-1 aliases or out-of-range pages are generated.
- `ArticleCard` (editorial variant), `ArticleMetadata`, `Pagination` and `BaseLayout` are reused directly. Pagination uses crawlable previous/next and numbered anchors, with `aria-current` semantics. The component layout is horizontal from 1024px and stacked below, preserving paragraph reading width.

The public domain is not yet approved in `astro.config.mjs`. Therefore `BaseLayout` deliberately omits absolute `canonical` and Open Graph URL metadata rather than promoting a temporary Vercel hostname. Once the actual site URL is configured in the later SEO step, archive pages receive distinct self-referencing canonical metadata. No individual Grimoire article routes are added in this prompt; that is the later article-route step.

## Repeatable verification

- `npm run test:grimoire` validates 0, 1, 12, 13 and 25 published entries, chronological sorting, same-day tie breaks, date/status publication gating, the 12/page constant, first-page URLs and Previous/Next links. It runs as part of `npm run qa:content`.
- The repository's existing **Editorial Quality** GitHub Actions workflow gains **Prompt 14 branch-only** integration checks. The script `scripts/test-grimoire-build-fixtures.mjs` creates temporary Library and Grimoire MDX on the isolated runner, builds all 0/1/12/13/25 cases, asserts generated HTML/paths, verifies a same-slug collision between the collections does not leak, rejects draft/review records and ensures fixture files are restored. No fake articles are committed or deployed.
- `scripts/test-grimoire-browser.mjs` checks the actual rendered empty and full archive in headless Chrome at 375, 768, 1024, 1280 and 1440px for stacked/horizontal layouts, semantic link and date markup, accessible pagination, no overflow and no placeholder imagery. The final 25-entry test build remains on the CI runner solely for the browser QA step.
- The base Editorial Quality job also runs `npm ci`, `npm run qa:content`, `npm run typecheck` and `npm audit --audit-level=high` against the real, empty production collections.

Implementation is prepared as **one atomic feature commit** to avoid repeated Vercel preview builds. Merge requires green GitHub Actions and PR review. Vercel Hobby account deployment quota is a separate operational constraint; no plan upgrade or repeated deployment attempts are authorized merely by completing this prompt.

**Stopped after Prompt 14.**
