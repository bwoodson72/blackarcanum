# Service detail pages — SF-06

## Routes and publication

The prerendered route src/pages/services/[sphere]/[slug].astro uses the same published-only service accessor and sphere grouping as the category pages. The buildServiceProductPaths helper supplies canonical sphere/product parameters and explicitly curated related products. Related targets retain the selected order; draft/review, hidden-sphere and absent targets never become public cards. Real unknown references are already rejected by catalog validation. Duplicate published IDs are rejected defensively.

The global Services release flag remains false. Detail routes additionally require the actual Services hub and sphere route modules. The real hub route is still absent, so completion of this prompt cannot expose Services. Category and detail routes share the same catalog and must remain coordinated when public release is separately approved. No navigation or homepage integration is enabled.

## Presentation and copy

ServiceDetail is a shared layout for readings and spellwork, using BaseLayout, Container, SectionHeading, the existing MediaImage renderer and ServiceProductGrid. It has Services → canonical sphere → unlinked current-product breadcrumbs, one template H1, type/sphere metadata, summary and the exact USD price formatted from the catalog's integer cents. The URL helpers now expose their known local path type for typed breadcrumbs; runtime paths are unchanged.

Optional approved MDX body copy is rendered before the typed scope, inclusions, ordered process, timing and client-information sections. The exact published entry ID is used for render lookup after path selection. Markdown headings in the MDX must begin at H2: a second H1 fails the build rather than producing a broken heading hierarchy. Published required fields still come from the SF-01 schema; no fake scope or price is substituted.

A selected media ID requires both the established registry rights clearance and explicit Services media approval. With no approved image, no media wrapper or stock fallback is rendered. The real media approval list is unchanged and empty.

Availability is text only. Closed/unavailable records display their factual state; all records state that purchasing, booking and intake are unavailable through this frontend. An informational open state never creates a purchase button or intake link. The practice's existing non-baneful/consent boundary is reiterated. No Product/Offer/Review/Person schema, forms, processor links, sensitive-data inputs, orders or payments are added.

Pages remain noindex under the existing approved-domain policy. Page-specific description uses seoSummary when present, otherwise the summary. Services is not added to Pagefind. Practitioner identity/profile presentation remains SF-07 work.

## Verification

The new path/related-product suite is part of qa:units/qa:fast. It checks release closure, canonical sphere IDs and slugs, hidden and draft exclusions, duplicate rejection, exact price and curated-only related products.

`npm run test:services-details` exercises the actual route, schema, MDX rendering and layout in the existing isolated-source browser harness. Temporary reading/spellwork products, a neutral technical image, its isolated approval record and all test routes are removed with the temporary copy. No real product or price has been supplied; these are exclusively synthetic technical fixtures, not approved business offerings.

At 375, 768, 1024, 1280 and 1440px the checks cover one H1, accurate title/description/robots, breadcrumbs, price/type, all typed sections, actual formatted MDX, optional image and text-only fallback, informational availability, no fake checkout, curated cross-sphere related links, absent empty related sections, readable width, no overflow, keyboard focus/Tab/Enter and working ancestor/detail links. Desktop and mobile screenshots were visually reviewed. Closed-release, missing-hub, draft/review and duplicate-H1 build cases pass.

The existing sphere/filter suite now copies the actual SF-06 route instead of a detail stub. All five-width sphere/filter checks, no-JavaScript fallback, zero-results recovery, and missing/empty/unpublished route scenarios pass against the real detail template.

Production build, 15 unit suites plus newsletter checks, typecheck (zero errors/warnings; two pre-existing hints) and the high/critical audit pass. Full qa:fast still stops at the unchanged sample-article test's outdated catalog expectation, including Demeter's former filename. Existing low/moderate dependency advisories remain; no dependency versions changed.

No Services routes, links, offers, fixture content or artwork appear in real production output. Real catalog and image approvals remain empty. Stopped after SF-06 for review with a local commit only; no push or deployment.
