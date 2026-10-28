# Prompt 27 — technical SEO and discovery contract

## Publication origin and rollout

**No real, owner-approved Mystagogia domain is configured.** In the default build, `astro.config.mjs` has no `site` origin, and **no sitemap or canonical/OG URL is fabricated**. The generated `/robots.txt` conservatively disallows indexing this development/preview deployment. The currently published Greek-deity samples are temporary layout previews and keep their explicit `noindex` meta tags.

When the owner authorizes a real public origin, configure **`MYSTAGOGIA_SITE_URL`** as its exact HTTPS origin (no paths, ports, query, fragments, Vercel preview, example or test domain). Never use `VERCEL_URL` or an inferred deployment hostname. Do not set the variable on deployments whose URLs are not meant to be public search results.

With a real site URL, the build adds `@astrojs/sitemap` conditionally, emits `rel="sitemap"` and the robots sitemap reference, and derives self-referencing canonicals and OG URLs from **`Astro.site`**. Unavailable routes are not generated. The sitemap filter reads **actually built HTML** and only includes pages without a `noindex` robots meta tag; this excludes preview articles, preview-only hubs, draft/review entries, and the homepage while it is still designated noindex. Static page routes are generated only by the existing status/published-date-gated collection accessors.

## Metadata and schema rules

- Each existing page passes its actual title and description to `BaseLayout`. Archive pages 2+ have their own unique title, description and pathname-based canonical; **/library/`** and **/grimoire/`** remain the sole page-1 routes (no /page/1/` duplicates).
- Only indexable articles with an approved site origin receive `og:type=article`, publication/modification timestamps, and factual schema.org **Article JSON-LD**: title, real description/date, self page URL, and approved article image when available. **No author, publisher corporation, credential, organization identity, or review is invented.** No JSON-LD is emitted on noindex layout previews.
- An explicitly chosen and rights-cleared registered hero image can be optimized by Astro for OG and Twitter sharing when an authorized origin exists. Other articles do **not** borrow the Tyche image, and the homepage does not invent a general artwork fallback.
- Without an authorized origin, the site continues to expose descriptive titles and non-URL OG fields, but not fake canonicals, absolute image URLs or Article JSON-LD.
- The robots endpoint remains deterministic in prerendered builds: disallow the unapproved development deployment; allow and announce only an explicitly configured, real sitemap.

## Acceptance tests

**Fast master CI** (`npm run qa:fast`) checks the live seven-page build: no synthetic canonical or site URL, no sitemap, disallow-only robots, and excludes the current noindex preview pages. It also validates rejected placeholder origins and the sitemap filter's page-by-page `noindex` behavior.

**Deep Regression → articles** now includes `npm run test:seo-build`, which temporarily adds one synthetic published article with the existing rights-cleared Tyche art and one draft, builds **once** using `https://mystagogia.test` under a CI-only `MYSTAGOGIA_SEO_TEST=1` flag, and checks article metadata/schema/OG image, canonical URLs, robots/sitemap, and draft/preview absence. Both test files are removed in `finally`. This synthetic domain exists **only for acceptance tests**, never production settings or links.

Deep browser/fixture checks and manual visual QA from Prompt 26 still need separate acceptance; this prompt changes only metadata/discovery and does not certify those pending screens.

**Stopped after Prompt 27.**

## Update — removed public preview routes (2026-10-28)

The preview MDX files are now excluded from the public Astro route generation stage by the shared `canPublishEditorialEntry` predicate. The older `noindex` handling remains defense in depth, but preview pages are no longer emitted. The SEO integration test now asserts **missing preview HTML**, not merely noindex/canonical attributes.

