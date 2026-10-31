# Services cards — SF-02

Reusable presentation only. No Services routes or navigation are enabled, and the actual service catalog and Services image approval list remain empty.

## Components and data

- `SphereCard.astro` accepts a `PublishedSphereView` from `toPublishedSphereViews()`. That helper excludes unpublished/hidden spheres and spheres with no approved products. The card refuses a mismatched canonical URL or a zero product count. Its destination must be backed by real sphere routes before integration; route generation belongs to SF-04.
- `ServiceProductCard.astro` accepts a `PublishedService` from the catalog selector. `serviceCardPresentation()` revalidates publication approval, media permission and canonical identity. It formats USD directly from integer cents and labels the kind Reading or Spellwork.
- `ServiceProductGrid.astro` accepts published products and renders nothing for an empty array. Its semantic list has one column below 768px, two from 768px and three from 1280px.
- Both card types use one native full-card anchor, a contextual h2/h3 heading (h3 by default), a visible focus outline and reduced-motion styling. There are no nested controls or browser scripts. Product imagery uses the existing registry-backed MediaImage renderer; no image element or placeholder is emitted without approved media.
- `service-cards.css` uses the shared palette, type and spacing tokens, including the new `--text-card-heading`. Sphere cards reuse EngravedFrame. Existing editorial cards and homepage styles are unchanged.

## Local checks

`npm run test:services-presentation` runs the in-memory data tests; these are also part of `qa:units` and `qa:fast`.

`npm run test:services-cards` builds a temporary isolated source copy, adds synthetic data and a neutral technical SVG **only in that copy**, runs real browser checks, and removes the copy in a finally block. It never swaps live content, adds real routes, or alters actual media approvals. This focused visual suite is intentionally separate from the fast unit runner.

The browser suite defaults to `google-chrome`. Set `CHROME_BIN` to another installed headless Chrome executable when needed. `SERVICES_SCREENSHOTS` optionally sets an external screenshot folder; otherwise screenshots are temporary and removed with the fixture. Use the project's compatible Node runtime. No new package dependency is required.

## Verification for this change

- Browser checks passed at 375, 768, 1024, 1280 and 1440px: one/two/three columns, no horizontal overflow, one link per card, valid fixture targets, heading semantics, exact prices, both kind labels, loaded optional image, text-only fallback, empty-grid omission, accessibility-tree link names, native Tab/Enter behavior, 44px minimum targets, visible focus and reduced motion. Cards emit no browser JavaScript.
- Screenshots were visually reviewed at phone and desktop widths. Screenshot copy and the neutral black image are explicitly synthetic technical fixtures, not proposed offerings or approved imagery.
- Production build and typecheck pass. The existing `qa:fast` sample-article test fails because its hardcoded expected catalog predates the present article files (including Demeter's rename). That test is unchanged by SF-02.
- The high/critical audit gate passes; existing low/moderate advisories remain. No dependency versions were changed.
- No push or deployment is authorized or performed. SF-02 stops for owner review; acceptance tracking remains unchanged until accepted.
