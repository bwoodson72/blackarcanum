# Mystagogia — Library Hub and Published Archive (Prompt 13)

## Public routes and editorial rules

- `/library/` is the single canonical **first page**. It always exists. With zero published entries it contains a thoughtfully composed, factual introduction and a link to the About page, not fake studies, empty cards, taxonomy or art. While empty it uses `noindex` so an unpopulated archive is not promoted to search results.
- `/library/page/[page]/` is generated at build time with Astro's `paginate()` **only** for actual pages **2 and above**. The generated page-1 candidate is filtered out. No `/library/page/1/`, overflow page, or numbered page for zero/one/12 articles is emitted.
- The source is the existing approved `library` MDX content collection. Publication requires `status: published` **and** a valid `publishedAt`. Grimoire entries are not mixed into the archive. Unapproved topic directories, demo articles and placeholder source records are not added.
- `src/lib/editorial-archive.ts` owns one shared `EDITORIAL_PAGE_SIZE = 12` constant, stable newest-first sorting by UTC date value, ascending ID tie break, and pure page slicing. The actual Astro `paginate()` receives the same sorted data and page size. The display count in `LibraryArchive.astro` also uses this constant.
- `LibraryArchive.astro` supplies a charcoal editorial introduction and warm parchment listing, using `ArticleGrid` / `ArticleCard` / `Pagination` from Prompt 12. There is no custom article card markup or automatic feature selection. Previous/next, numbered links, dates and excerpts are produced from real published entries.
- Actual individual Library article routes remain a later implementation step. This prompt adds an archive, **not article detail pages**, search, topic hubs, Grimoire routes or generated artwork.

## Metadata and SEO

Page 1 uses the title `The Library | Mystagogia`; numbered pages identify `Page N` in both title and visible section heading. All pages provide truthful descriptions and accessible heading/list/navigation semantics. Empty page 1 is `noindex` and contains no blank cards. Numbered routes are emitted only if supported by 13+ published entries.

The domain has not yet been approved/configured in `astro.config.mjs`. Therefore `BaseLayout` deliberately omits canonical/OG absolute URLs, rather than treating a Vercel preview URL as the permanent canonical. Once the site URL is selected, its existing canonical logic can emit a self-referencing URL for each distinct archive page. XML sitemap configuration also belongs to a later SEO milestone, not this archive step.

## Verification procedure

Run `npm run qa:content` for existing schema, content-integrity, presentation and permanent archive data tests plus the Astro build. Run `npm run typecheck` and `npm audit --audit-level=high`.

The GitHub Actions workflow runs these checks and, **only on the Prompt 13 branch**, isolated fixture builds for exactly **0, 1, 12, 13, and 25 published articles**. Fixture records exist only inside the GitHub Actions runner, never in the repository; the fixture harness restores the initial content collection directories afterwards. Build acceptance inspects the generated HTML for route counts, first-page uniqueness, article ordering, links, date/excerpt metadata, and absence of unpublished content. Chrome validates the actual CSS grid and navigation across 375, 768, 1024, 1280 and 1440px with empty and full archives.

A failed build must block merge. One atomic branch commit is preferred to avoid repeated Vercel preview builds. Once merged, the production deployment should use the reviewed master SHA.

**Stopped after Prompt 13.**
