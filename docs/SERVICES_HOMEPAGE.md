# Homepage Services invitation — SF-09

## Placement and visibility

The actual src/pages/index.astro uses the same getServicesVisibility result as navigation and the canonical hub route. The invitation is rendered only when Services is live; it cannot be enabled separately from navigation. With the real release flag still false and catalog empty, the entire section and its links remain absent.

The section follows the existing editorial content/Grimoire area and precedes NewsletterSection. It introduces private practice, links to the real /services/ hub, and lists up to three published sphere views in approved registry order. The source contains no product names, prices, availability promise, testimonials, case study, new imagery or additional browser script. Empty/unpublished sphere destinations do not become links.

Only new home-services selectors are appended to homepage.css. Typography, spacing, palette and focus use existing tokens/styles. The invitation stacks on small screens and becomes two columns at 1024px. Existing illustrated hero markup/art/min-height, Library/Grimoire gateways, curated featured research, Grimoire spotlight and newsletter markup/behavior are unchanged. Services is not a third editorial gateway.

## Verification

`npm run test:services-home` extends the existing isolated-source/CDP approach. It copies the actual homepage and actual Services routes, keeps the real editorial source/curation/media intact, and supplies synthetic Services products only in the temporary copy. No synthetic record or release flag is written into the real catalog.

The browser test records the closed-state markup for the actual hero, two paths, research, Grimoire and newsletter at 375, 768, 1024, 1280 and 1440px. Each block remains exactly equal after enabling the isolated Services fixture. The original hero min-height formula, production art path, one H1 and two gateway links are also checked explicitly.

At all five widths: correct section order, real hub/sphere responses, at most three approved sphere links, 44px targets, visible focus, Tab/Enter behavior, no horizontal overflow, expected stacked/two-column layout and absence of prices/artwork/claims pass. Complete homepage and direct invitation-region browser screenshots were saved; phone and desktop invitations were visually reviewed. The section uses no animation or client JS.

Release-closed fixtures produce no invitation or Services navigation despite valid products. Unpublishing one sphere removes only that sphere's link and route. A draft-only catalog removes the invitation and navigation entirely and preserves the original editorial blocks. The real production output has no invitation markup or Services links.

Production build, 17 unit suites plus newsletter checks, typecheck (zero errors/warnings; two existing hints) and the high/critical audit pass. Full qa:fast still stops at the unchanged, pre-existing sample-article inventory test, including Demeter's former filename. Existing low/moderate dependency advisories remain; no dependency versions changed.

The invitation is implemented but not publicly enabled. Actual offerings, prices and release remain unapproved; all test flags and products stay isolated. Stopped after SF-09 with a local commit for review, no push and no deployment.
