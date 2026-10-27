# Mystagogia — Article Cards and Pagination Primitives (Prompt 12)

## Scope and presentation model

This prompt introduces **presentation components only**. The real Library and Grimoire MDX collections remain empty, and there are **no new public archives, cards, hub pages, or feature selections**.

`src/lib/editorial-presentation.ts` defines a small typed `PublishedArticleView` (collection, stable ID, title, canonical article href, optional excerpt, publication/update dates and an optional `{src,alt}` image). Its `toPublishedArticle()` converter accepts actual typed Astro collection entries and returns **nothing** for draft/review entries or entries lacking a valid publication date. Its `articlePath()` enforces a valid stable slug and generates `/library/<slug>/` or `/grimoire/<slug>/`. A card recomputes this canonical path from the validated collection/ID rather than trusting a caller-supplied URL.

## Components

- `ArticleMetadata.astro`: an unlinked, semantic collection label and optional `<time datetime>` publication and update dates, plus optional supplied reading-time metadata. Dates are formatted in UTC for stable SSR output. It invents no author or reading duration.
- `ArticleCard.astro`: one semantic `<article>` and one linked heading (configurable `h2`/`h3`) per item. Variants: `standard`, `featured`, `editorial` and `compact`. Optional excerpts are omitted if missing, and images appear only when both an actual image URL and meaningful author-supplied alt are present. No generated illustration, blank hero, stock art or mandatory image is introduced. All surface colors, borders, typography, focus rings and spacing follow the existing Mystagogia tokens.
- `ArticleGrid.astro`: a semantic `ul/li` listing that emits no grid markup for an empty list; mobile-first 1-column layout, 2 columns at 768px, and 3 columns from 1280px. The grid passes normalized article records directly to the shared card component.
- `Pagination.astro`: real, crawlable anchors using canonical path construction from `src/lib/editorial-pagination.ts`. Page one is always `/<collection>/`, page two and above `/<collection>/page/N/`. Previous and next use `rel=prev/next`, and the current page uses `aria-current=page`. Mobile replaces page-number controls with a compact “Page X of Y” text; larger screens display a bounded list with ellipses. Navigation omits itself entirely for zero or one page and rejects invalid page counts/current pages.

The pagination model is **pure** and reusable. Actual paginated archives and route generation are reserved for Prompt 13/14. This prompt does not guess published content or silently fall back to unapproved articles.

## Regression checks

The permanent `npm run test:presentation` command verifies published-only normalization, missing-image omission, slug paths, both collections' canonical archive links, invalid page arguments, first/middle/last navigation, compact page windows and zero/one-page omission. It is included in the established `npm run qa:content` pipeline alongside earlier schema/integrity tests and a full Astro build.

The temporary acceptance route and Chrome test script are **removed before the final PR**. They supply synthetic text-only fixtures only during an isolated GitHub Actions run and are not public site content.

**Acceptance run:** [GitHub Actions run 40596248446](https://github.com/bwoodson72/blackarcanum/actions/runs/40596248446). Checks include production build, Astro typecheck, security audit, HTML snapshot, absence of nested links and dummy images, and Chrome browser testing at **375, 768, 1024, 1280 and 1440px** for responsive 1/2/3-column layout and accessible pagination.

**Limitations:** No real article or image assets exist yet, so the fixture tests exercise the all-text path. Real card visuals using approved images and archive content can be reviewed when those assets and routes are approved. No broader Firefox/Safari visual claim is made.

**Stopped after Prompt 12.**
