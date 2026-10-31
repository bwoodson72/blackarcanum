# Services frontend handoff — SF-11

Reviewed October 31, 2026. SF-01–SF-10 were accepted before this review. SF-11 implementation and review are complete, awaiting owner acceptance. This handoff covers the frontend scaffolding and ordinary informational browsing.

## Current state

The homepage invitation, header/footer/mobile navigation, `/services/` and the three approved sphere pages are available normally. Empty categories show an honest preparation message. This follows the owner's October 31 visibility instruction and supersedes older requirements to hide empty categories or use an unlinked development preview.

The actual Services collection is empty and the practitioner source remains null. The normal production build contains exactly the hub and three category pages, with no synthetic offerings, product detail pages, practitioner page, checkout, intake fields or commerce/person structured data. Indexing approval remains false. No push, deployment, payment integration or backend work was performed.

## Review evidence

All five required viewport widths were exercised: **375, 768, 1024, 1280 and 1440px**.

| Existing suite | Result / coverage |
| --- | --- |
| `test:services-navigation` | Passed at five widths. Added a keyboard journey through the real hub → Love sphere → reading → curated related spellwork → practitioner → Services breadcrumb. Checked one H1, no horizontal overflow, at least 44px interactive targets, no Services intake controls, computed text contrast (4.5:1 normal text / 3:1 large text), visible FAQ keyboard focus, native disclosure accessibility, reduced motion, and existing mobile modal focus/Escape/resize behavior. |
| `test:services-filter` | Passed at five widths across all three spheres. Mixed kinds, exact prices, filter pressed states, live counts, hidden accessibility-tree entries, keyboard focus, zero-result recovery and single-kind controls. With JavaScript disabled the complete linked catalog remains available. Empty approved categories remain browsable; explicitly unpublished categories remain absent. |
| `test:services-details` | Passed at five widths for reading, spellwork and closed/unavailable states. Actual MDX, correct price/type, curated links, breadcrumbs, approved fixture image alt/loading, text-first fallback, no fake checkout, draft/review and missing-ancestor exclusions, and rejection of a duplicate H1. |
| `test:practitioner` | Passed at five widths. Full optional résumé blocks, minimal biography, reading width, keyboard links, and omission of private/unverified/unapproved facts and draft profiles. |
| `test:services-home` | Passed at five widths. Existing editorial homepage composition and hero dimensions preserved; invitation placement, real category links, keyboard navigation, responsive layout and draft-only inventory behavior verified. |
| `qa:fast` | All 17 unit suites, newsletter checks and the real production build passed. The existing sample-article inventory assertion then failed because its expected article filenames are outdated. This unrelated blocker remains unresolved. Existing unit checks cover missing price/publication approval and deterministic rejection/filtering of invalid or unpublished related references. |
| Separate remaining fast checks | Typecheck passed with zero errors/warnings and two existing hints. High/critical audit passed; seven existing low/moderate advisories remain. |
| Real local site / build | Verified ordinary Services content and category links on the running dev server. Inspected the real build for fixture, product/profile, intake and structured-data leakage; none found. |

SF-10's approved-origin, sitemap, canonical, preview-robots and editorial-only search coverage remains in `test:services-seo`; this review does not change that policy or any page layout.

The existing screenshot helper now waits for two animation frames after an instant scroll to the top. This prevents captures made immediately after keyboard navigation from recording an unfinished scroll/repaint. The correction affects test captures only.

Review coverage comprises Chromium keyboard and accessibility-tree assertions, computed-style contrast checks, and visual screenshot spot review across the five widths. Manual screen-reader testing and other browser engines remain unverified.

## Screenshot inventory

Set `SERVICES_SCREENSHOTS` to retain screenshots from the existing browser commands. Files for this review were saved outside the repository and are not shipped in the site.

- `services-journey-{hub,sphere,reading,spellwork,practitioner}-{width}.png`: complete journey at all five widths.
- `services-practitioner-{width}.png`: full optional résumé layout at all five widths.
- `services-sphere-{sphere}-{width}.png` and `services-filter-{sphere}-{width}.png`: all three spheres, full and filtered views.
- `services-detail-{kind}-{availability}-{width}.png`: approved neutral test media and text-first detail cases.
- `services-navigation-menu-{width}.png`: modal menu at widths below 1024px.
- `services-filter-no-js-1440.png`, `services-filter-empty-result-1440.png`: progressive enhancement and recovery.
- `services-home-invitation-{width}.png`: homepage integration.
- `actual-local-hub-1440.png`, `actual-local-sphere-375.png`: actual ordinary local content, without test offerings.

Images containing synthetic offerings, numeric prices or résumé statements are clearly labeled test fixtures. They do not represent approved public content.

## Remaining inputs and decisions

1. **Product copy:** actual named offerings, purpose, scope, inclusions, deliverables, process, requirements, timing and availability.
2. **Prices:** explicit approval of each actual USD price.
3. **Practitioner résumé:** owner-supplied, verified and approved biography and optional experience/training facts; approved public identity if one is desired.
4. **Imagery:** Services-specific rights approval or an explicit decision to retain text-first presentation.
5. **Terms and launch:** reviewed commercial/privacy/refund terms, approved domain, indexing/public release decision, and resolution of the article-inventory QA blocker.
6. **Processor:** processor approval and separately authorized payment/intake/backend work in its future scope.

Stopped after Prompt SF-11.
