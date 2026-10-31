# Services sphere pages — SF-04

## Implementation

- `src/pages/services/[sphere].astro` is prerendered and uses getStaticPaths, the shared published-only getPublishedServices accessor, and buildServiceSpherePaths. No draft/review entry or unapproved/hidden sphere can generate a category page.
- SpherePage reuses BaseLayout, the text-only PageHero, SectionHeading, Container, existing typed breadcrumbs and ServiceProductGrid. One H1 names the sphere; the Services ancestor is linked and the current sphere is unlinked. Readings and spellwork appear together with exact prices from their single integer-cent field, a true product count, and canonical detail paths.
- Sphere paths follow registry ordering and the existing deterministic product ordering. Empty spheres and future sphere IDs have no static path. The presentational component rejects an empty or mismatched catalog.
- Shared Services hero CSS moved from the hub stylesheet into services-hero.css. Existing page-hero.css and the homepage remain unchanged. SF-04 introduced no new imagery, filters or detail template; SF-05 later adds the filter and SF-06 supplies detail routes.

## Release and route dependencies

servicesPublicReleaseApproved in src/data/services-release.ts is false. Completion of SF-04 is not permission to change it. Before a future public release, the owner must separately authorize release and approve the real products, their copy/prices and the sphere visibility records.

The route also requires actual modules for both /services/ (the canonical src/pages/services/[...index].astro since SF-08) and product detail routes (src/pages/services/[sphere]/[slug].astro). If either is absent, no sphere paths are emitted. SF-06 supplies the real detail module and SF-08 supplies the gated canonical hub module; public release approval remains closed. When implemented, they must use the same approved catalog so every emitted breadcrumb and detail link resolves. Merely adding a module is not public-release authorization.

Sphere pages remain noindex while this frontend is under development, following BaseLayout's approved-origin policy. Normalized canonical paths are tested; no canonical domain or canonical tag is invented for development previews. No Services navigation or homepage invitation is enabled.

## Verification

The new pure path-selection suite is included in qa:units/qa:fast. It checks release approval, all three sphere IDs, mixed kinds, deterministic grouping and draft/review/empty/hidden/unpublished exclusions.

`npm run test:services-spheres` uses the existing isolated-source/CDP helper. It copies the actual dynamic sphere route and (since SF-06) the real detail template, creates temporary MDX products and a test-only hub destination, and exercises these real build scenarios:

1. Populated catalog with release approval closed: no sphere pages.
2. Release approval enabled in the test copy, but detail module absent: no sphere pages.
3. Release approval enabled in the test copy, but hub module absent: no sphere pages.
4. Both test destinations present and all three spheres populated: three sphere pages, each containing published readings and spellwork, with draft/review entries excluded.
5. An empty sphere and an unpublished sphere: neither emits a page or directory; the remaining populated, approved sphere still renders.

All three populated sphere routes were browser-tested at 375, 768, 1024, 1280 and 1440px: no overflow, 1/2/3 columns, correct heading/breadcrumb/current state, exact counts/prices/type labels, non-nested native links, 44px targets, visible focus, Tab/Enter navigation and working fixture detail URLs. Phone and desktop screenshots were visually reviewed. The text-only hub and unchanged homepage hero passed the existing five-width regression suite after the shared hero CSS extraction.

Use a compatible Node runtime. CHROME_BIN optionally selects headless Chrome; SERVICES_SCREENSHOTS optionally retains screenshots outside the temporary directory. No synthetic source, product, price, route stub, imagery or approval reaches the real catalog or production output; the helper removes its isolated copy after checking.

The real production build, 14 unit suites plus newsletter checks, typecheck (zero errors/warnings, two existing hints) and high/critical audit pass. Full qa:fast still stops at the unchanged, pre-existing sample-article test's outdated file inventory (including Demeter's former filename). Existing low/moderate dependency advisories remain. No dependency versions changed.

The real catalog remains empty and all Services visibility/release approvals remain closed. No production Services pages or links were emitted. Work stops after SF-04 with a local commit for owner review, no push and no deployment.
