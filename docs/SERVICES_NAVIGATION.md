# Services navigation and breadcrumbs — SF-08

## One live-state contract

getServicesVisibility is shared by the canonical Services hub route, SiteHeader, SiteFooter and the practitioner publication gate. It returns live only when the owner has explicitly approved release, the canonical hub/sphere/detail modules exist, and at least one sphere has approved published products. The real release flag is still false and the catalog remains empty, so all actual Services navigation remains hidden.

The new services/[...index].astro route emits exactly /services/, or nothing. It opts the existing ServicesHub composition into indexability only when that same live gate succeeds. An arbitrary index.astro review fixture remains noindex by default and cannot activate navigation. Merely creating route modules or completing this prompt is not release authorization.

services-route-readiness centralizes the exact route-module checks. It accepts legacy index.astro hub fixtures for older parent/detail test scenarios, but only the actual gated [...index].astro hub qualifies for public navigation. There is no duplicate manual menu flag. Profile links additionally require a real live hub and an approved verified profile; the profile accessor is now asynchronous so it can use that same readiness result.

## Navigation and current state

getSiteNavigation in site-navigation.ts composes Library, Grimoire, conditional Services, About and the existing search/mobile entries. Its default static exports remain closed for offline consumers. Public header and footer select links using the shared live state. Shop and Subscribe remain absent.

navigationCurrent normalizes trailing slashes, marks the exact Services hub as aria-current=page, and marks nested sphere/product/practitioner paths as aria-current=location. The prefix match includes a slash boundary, so /services-other/ cannot match. Only Services opts into subpath matching; existing editorial links keep exact matching. Desktop/mobile/footer use the same state; the footer now exposes current-link semantics and styling too.

Existing typed breadcrumbs remain Services → current sphere, Services → canonical sphere → current product, and Services → current practitioner page. Current items are unlinked. Every activated Services link targets a real emitted route in the accepted fixture state.

The existing native mobile dialog script is unchanged. Menu opening/closing, background inertness, Escape, focus return and the desktop-breakpoint close behavior remain native. No new client router, search scope, commerce action or homepage section is introduced.

## Verification

The new navigation/readiness unit suite is part of qa:units/qa:fast. It checks closed/live link composition, existing editorial matching, exact/nested Services states, path-boundary negatives, release/empty-route gates, and exclusion of arbitrary noindex review hubs.

`npm run test:services-navigation` uses the existing isolated-source/CDP harness with actual hub, sphere, detail and profile routes. Closed release and draft-only catalogs emit no hub or top-level Services link. A populated approved fixture emits a real indexable hub. Replacing it with an unlinked noindex review hub removes Services from all global navigation surfaces.

At 375, 768, 1024, 1280 and 1440px, home, hub, sphere, product, practitioner and editorial fixture pages pass: consistent navigation/current states, correct breadcrumb ancestors and unlinked current items, actual link responses, no Shop, no horizontal overflow and no header-part overlap. Phone/tablet dialog checks cover keyboard opening, initial close-button focus, repeated Tab navigation without background-control focus, modal accessibility semantics/background exclusion, Escape and trigger focus return, actual Services navigation, and automatic close at the desktop breakpoint. Chromium may report BODY while focus crosses browser chrome; background page controls must never receive focus while the native modal is open. This suite preserves that native behavior rather than adding a second focus trap.

Desktop and mobile navigation screenshots were visually reviewed. The practitioner integration suite now uses the actual canonical hub and passes all five widths, including private/unverified omission and conditional profile links. Production build, 17 unit suites plus newsletter checks, typecheck (zero errors/warnings; two existing hints) and the high/critical audit pass. Full qa:fast still stops at the unchanged sample-article inventory test, which predates current article files and Demeter's rename. Existing low/moderate dependency advisories remain; no package versions changed.

All synthetic catalog/profile data and release flags remain isolated to temporary tests. Production emits no Services hub/sphere/product/profile routes or links. Services navigation is implemented, but remains hidden until actual content and public release are approved. Stopped after SF-08 with a local commit only, no push and no deployment.
