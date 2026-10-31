# Services hub — SF-03

## Scope and visibility

`src/components/services/ServicesHub.astro` is a reusable review composition, not a production route. It uses BaseLayout with unconditional noindex and has no consumer under src/pages. No Services navigation, homepage invitation, products, prices, intake, payment, booking, or public launch is enabled.

The copy is an unpublished review draft based on the confirmed frontend plan. Review its wording before future public activation. No practitioner identity, credentials, testimonials, methods, named offerings or prices have been invented.

The composition follows the specified sequence: text-only hero and sphere anchor; brief introduction; sphere grid; conditional practitioner excerpt; reading/ritual panels; purpose/consent/non-baneful principles; native disclosure FAQ; closing link back to the spheres.

## Integration contract

- Pass only `PublishedSphereView` records backed by actual approved sphere destinations. Existing SphereCard validation remains in force. In SF-03, populated views and their destinations exist only in isolated tests.
- With no sphere views, render a clearly labeled preparation state with the three planned taxonomy names and no category links, product cards, prices, or suggestion that orders are available.
- A practitioner teaser is absent by default. Its minimal contract requires an approved, published, nonempty excerpt. A future caller must also establish that the real approved profile route exists; full practitioner content and route generation remain SF-07 work. This step supplies no real teaser data or profile route.
- PageHero adds a services mode that permits omitting artwork. Existing modes still require their approved artwork, and shared page-hero.css is unchanged. Services hero sizing and typography are scoped under services-hero.css (shared with sphere pages since SF-04); homepage dimensions are preserved.
- No browser script is needed for the hub, sphere navigation or native details/summary FAQ. The existing shell retains its own mobile navigation script.

## Verification

`npm run test:services-hub` uses the shared isolated-source fixture/CDP helper extracted from the SF-02 test. All synthetic data and route stubs are confined to an automatically removed temporary directory. The helper never changes the real content, media approvals, routes or build output. The existing `npm run test:services-cards` uses the same helper and remains independently runnable.

Set CHROME_BIN to a headless Chrome executable if google-chrome is unavailable. SERVICES_SCREENSHOTS optionally points to an external output folder; otherwise screenshots are temporary. Use the existing compatible Node runtime. No package dependency or runtime configuration changes are needed.

Checked at 375, 768, 1024, 1280 and 1440px for populated, unavailable and synthetic-approved-teaser states:

- One H1, correct sphere counts and 1/2/3-column grid, no horizontal overflow, early mobile sphere access, 44px minimum targets and real fixture link/anchor destinations.
- No product cards, prices, forms, intake fields, structured offer data or artwork. The unavailable state has no Services category links, and an unapproved teaser is omitted.
- Four accessible named FAQ disclosures, native Space/Enter toggling and expanded accessibility-tree states, visible focus and an in-page sphere target below the sticky header.
- Existing homepage hero min-height and artwork remain intact across all five widths. The shared hero stylesheet is unchanged.

Production build, 13 unit suites, newsletter checks, typecheck (zero errors/warnings; two pre-existing hints), the high/critical vulnerability gate, and the SF-02 browser regression pass. The combined qa:fast command still stops at the pre-existing hardcoded sample-article inventory test, which predates current article files and Demeter's rename; that test is unchanged. Existing low/moderate dependency advisories remain.

Screenshots were visually reviewed for desktop, phone, and the unavailable state. No production Services routes, links or synthetic fixture text were emitted. Work stops after SF-03 for owner review, with a local commit only and no push or deployment.
