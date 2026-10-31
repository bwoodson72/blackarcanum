# In-sphere Services filter — SF-05

## Behavior

SpherePage now wraps the existing ServiceProductGrid in ServiceProductFilter. The server still renders the complete, ordered list of published products and their original canonical links. No route, publication selector, price field, metadata, search scope, or release setting is changed.

All / Readings / Spellwork controls are emitted only for a mixed-kind catalog and remain hidden until the small native enhancement initializes successfully. Without JavaScript every product and link remains visible, with the original total count and no dead controls. Single-kind catalogs omit the controls entirely.

The client reads each existing card's data-service-kind, then sets hidden on its list item. It does not parse label text, duplicate the product catalog, reorder cards, fetch anything, update history, or emit analytics. Native buttons have accurate aria-pressed states and visible keyboard focus. A polite, atomic status region reports the visible/total count and selected type. Applying a filter never moves focus. Unknown filter values are ignored, and initialization is idempotent.

The empty-result message is truthful and noninteractive. Because single-kind catalogs normally have no controls, the defensive missing-kind branch is tested by removing the only spellwork card in the isolated DOM after initialization, selecting Spellwork, and checking zero results plus recovery with All. An empty component fixture is also tested separately; empty sphere routes remain excluded by SF-04.

Styling uses existing tokens, 44px minimum controls, wrapping at narrow widths and native hidden semantics. No animation, auto-scroll, skeleton cards or large reserved blank result area is introduced.

## Verification

`npm run test:services-filter` extends the existing real sphere-route fixture suite through its --filters mode. Synthetic MDX, routes and approvals remain in an automatically removed temporary source copy. No new browser dependency or CI pipeline is added.

All three sphere fixtures passed at 375, 768, 1024, 1280 and 1440px: every filter's subset/count, pressed states, Enter/Space operation, focus retention, visible outlines, 44px targets, no horizontal overflow, stable controls during interactions, unchanged URL/canonical/order, and accessibility-tree selected states and hidden-card omission. Full-page screenshots are captured after interaction measurements, since Chrome screenshot capture can temporarily affect viewport scrolling. Screenshot tests are not a manual screen-reader certification.

Scripts were disabled before loading a real fixture sphere route to verify the full linked catalog and hidden controls. Single-kind and empty component fixtures passed. Removing the spellwork card after initialization produced a clear zero-result message and count, retained focus, and recovered correctly with All. The original release, missing-route, empty-sphere and unpublished-sphere build checks still pass.

Phone, desktop, no-JavaScript and zero-result screenshots were visually reviewed. Production build, 14 unit suites plus newsletter checks, typecheck (zero errors/warnings; two existing hints) and the high/critical dependency audit pass. Full qa:fast still stops at the pre-existing, unchanged sample-article inventory test, which predates current article files and Demeter's rename. Existing low/moderate dependency advisories remain; no package versions changed.

The real Services catalog remains empty, release approval remains false, and no Services page or fixture data is emitted in production. No requests, payments, booking, client data collection, push or deployment are introduced. Work stops after SF-05 with a local commit for owner review.
