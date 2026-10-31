# Mystagogia — Services Frontend Specification and Scoped Work Prompts

**Version:** 1.0  
**Prepared:** October 31, 2026  
**Repository:** bwoodson72/blackarcanum  
**Target:** existing master branch, Astro/Vercel frontend  
**Status:** planning and task instructions only; no application changes or publication authorized by this document.

This is a **separate, additive workstream** to the earlier 42-step editorial/site plan in docs/IMPLEMENTATION_PROMPTS.md. It records the owner's later decisions about a Services section. For this workstream only, those later decisions supersede the earlier site's two-pillar-only navigation and deferred-commerce assumptions. They do **not** authorize the Shop, Medusa, live payments, new images, fabricated offerings, or public launch. The existing editorial specification and implementation remain authoritative for shared foundations.

## A. Source-of-truth audit — existing master

Read the current files again before each implementation task; this is a snapshot, not a promise that paths remain unchanged.

- **AGENTS.md** mandates one authorized prompt at a time, direct-to-master commits, automatic Vercel deploys, scoped QA and a stop for review. Do not create feature branches or manually trigger duplicate deployments.
- **package.json / .nvmrc / astro.config.mjs**: Astro 7, TypeScript, Tailwind 4, Starwind, Svelte (selectively), MDX, Vercel adapter; Pagefind after Astro build. Check the live runtime requirements rather than altering Node versions during a Services step: the audited .nvmrc and CI use 22.23.4, while the audited package.json declares a 24.x engine.
- **src/layouts/BaseLayout.astro**: document shell, global CSS, site header/footer, optional breadcrumb trail, metadata, conditional canonical and robots controls. Do not create a second site shell.
- **src/components/site/PageHero.astro / HeroAction.astro / src/styles/page-hero.css / hero-action.css**: shared, prop-driven, illustrated hero and compact engraved CTA. Existing modes are home, archive, about; extend compatibly or add a justified variant. Preserve homepage dimensions and existing About/Library/Grimoire styles.
- **src/components/foundation/**: Container, SectionHeading, EngravedFrame, ActionLink, ActionButton, Ornament. Prefer reuse. **src/components/site/Breadcrumbs.astro** accepts an explicit, typed ancestor trail.
- **src/lib/site-navigation.ts**, SiteHeader, DesktopNavigation, MobileNavigation and SiteFooter: centralized real-route navigation; Shop absent until launch. The mobile menu is a native dialog. Never introduce broken/placeholder links.
- **src/pages/index.astro** and **src/styles/homepage.css**: illustrated hero, Library/Grimoire gateway cards, curated research/Grimoire, newsletter. “Two Paths of Exploration” refers to editorial paths and must remain intelligible; Services is an additional practice section, not a third editorial collection.
- **src/content.config.ts**, **src/lib/editorial-schema.ts**, **src/lib/editorial-public.ts**, **src/lib/editorial-presentation.ts**: typed MDX editorial entries with strict publication gating. Service products need their **own** typed model and visibility gate; do not piggyback on the topic registry or change editorial semantics.
- **src/components/editorial/ArticleCard.astro / ArticleGrid.astro**: useful responsive/accessibility precedents, **not** service cards. Existing card grid uses 1 column by default, 2 at 768px, 3 at 1280px.
- **src/data/media.ts / src/components/media/**: rights-reviewed media registry and Astro image tools. Artwork is not automatically cleared for commercial use just because it exists in an article. No new images, downloading or generation without explicit approval.
- **src/lib/seo-config.mjs / src/pages/robots.txt.ts**: canonical/sitemap only for an approved real domain; development Vercel URLs are not canonical. **src/pages/search/** currently targets editorial content; no Services search expansion in this phase.
- **docs/DESIGN_SYSTEM.md / docs/TOKENS.md / src/styles/starwind.css**: charcoal, parchment, aged paper, antique gold; Cormorant Garamond display, Source Serif 4 reading, Inter interface; mandatory shared semantic design tokens.
- **docs/DEVELOPMENT_WORKFLOW.md / docs/QA.md / scripts/**: normal master QA is npm run qa:fast (one build plus tests/typecheck/audit). Deep Regression is targeted or weekly, not a mandatory duplicate suite per small push. Inspect existing suites before adding any tests.
- **docs/design-references/**: approved **general** site visuals; none is an approved Services-specific mockup or reusable production artwork.
- No **src/pages/services/**, **src/content/services/**, Services frontend or approved Services product catalog exists at the time of this audit.

## B. Confirmed product requirements

1. **Services is a premium, selective private practice.** Pricing should discourage casual curiosity or thrill-seeking, but the site must not make unsupported claims that price improves effectiveness. All prices remain **unapproved and unknown** until explicitly supplied.
2. **Browse by sphere, not by method.** At launch the agreed sphere names are **Love & Relationships**, **Money & Prosperity**, and **Protection & Uncrossing**. Future spheres (such as career/success or road opening) require explicit approval and must not be silently enabled.
3. Within each sphere page, **readings and spells appear together as individual product cards**, distinguished by a reading/spellwork type label. Each card links to a **dedicated, detailed product page**. A type filter may narrow the page without becoming the main information architecture.
4. **No baneful work**: no curses, retaliatory work, harming others, coercion, domination or nonconsensual manipulation. Protective and cleansing work is allowed in principle. Do not invent a public spell list or imply a curse diagnosis.
5. Each eventual product is **specific and packaged**, not an open-ended request for unspecified custom work: approved purpose, method/scope, requirements, inclusions, deliverables, timeframe, price and availability.
6. Public Services hub introduces the practice, prominently presents spheres, includes a practitioner teaser when approved, explains readings vs. ritual work, describes the constructive/non-baneful boundary, has practical FAQ and a restrained final CTA. The hub itself does not show a product catalog or prices.
7. A dedicated **occult résumé / practitioner profile** must show only verified and expressly approved experience, disciplines, education, initiations and credentials; no legal name or invented pseudonym/qualifications. The hub and product pages link to it only when real profile content is approved.
8. Maintain visual continuity with Mystagogia: mobile-first, editorial rhythm, restrained antiquarian imagery, tokenized styles, accessible semantic HTML and responsive 1/2/3 grids. Do not introduce generic psychic-store design.
9. **Frontend only in this workstream:** no Stripe/PayPal code, checkout/payment links, requests or intake data submission, API endpoints, databases, order management, receipts, email sending, booking/calendar, member accounts, storefront backend, analytics events, or production commerce enablement.
10. No invented products, prices, biographies, reviews, case studies, testimonials, guarantees or photography are to appear in committed public pages. Temporary synthetic fixtures are allowed **only inside tests or local, uncommitted development fixtures**, clearly identified as such and removed after validation.

## C. Information architecture and design contract

Canonical intended paths, after actual approved content is ready:

~~~text
/services/                             Services hub
/services/love/                        Sphere page
/services/money/                       Sphere page
/services/protection-uncrossing/       Sphere page
/services/{sphere}/{product-slug}/     Individual reading/spellwork detail
/services/practitioner/               Occult résumé (once approved)
~~~

- One canonical sphere for each product; cross-sphere related links are permitted only when explicitly selected, not duplicate product pages.
- The three sphere IDs above are **approved navigation taxonomy**, not approval to publish empty category pages or specific products.
- The hub's sphere-card links must resolve to real, approved sphere pages. Until such pages have real approved products, do not surface broken links, fictitious products, or empty landing pages as live offerings.
- A published service product must have an actual price in USD cents (not vague fabricated “from” figures); displayed amount must match its one source of truth. A defined status indicates whether enquiries/purchasing are open independently of whether informational content is published.
- Each product card: approved image if available, type badge, name, concise reason-to-select, exact approved price, and “View details” affordance. If imagery is absent, render a deliberate text-first design rather than stock art or an invented image.
- Sphere page: shared compact hero; concise sphere introduction; responsive product-card grid; optional All / Readings / Spellwork filter; truthful zero-results handling; no other product category UI.
- Product detail page: breadcrumbs, one H1, approved media if any, sphere and type, description, actual price, scope, what is included, client inputs (informational only), process, fulfillment timing, relevant boundaries, and curated related products. **No fake Buy/Checkout buttons.** If purchasing isn't enabled, show an honest noninteractive availability message; never collect private intake details.
- Practitioner page: readable biography plus factual résumé blocks (practice history, traditions/disciplines, training, selected work/publications, approach/ethics); do not claim independent verification or add unapproved experience.
- Hub composition: compact/full-bleed hero; short introduction; dominant illustrated-or-text sphere-card grid; conditional practitioner excerpt; two explanatory reading/spellwork panels; practice principles; concise FAQ; closing navigation CTA. The spheres should be reached early on mobile.
- Home integration: a modest Services introduction below existing editorial sections and above the newsletter, **only when there is a live Services destination**; preserve the two editorial gateways.
- SEO: descriptive unique titles/metas and correct breadcrumbs; rely on existing approved-domain canonical/sitemap policy; draft/unapproved routes must not be indexed or linked. Do not invent offers, reviews, practitioner identity, ratings or sale-ready Product structured data.
- A complete Services frontend can be **tested without publishing a made-up catalog** by using ephemeral fixture data in the test harness and confirming it never appears in committed files or built production routes.

### Release/visibility rule

Treat the unapproved state as **not launched**. Build reusable components and tests first. A Services hub may exist as an unlinked, explicitly noindex and truthful informational page for development review, but must not display non-existent offerings or activate navigation to absent sphere routes. Never publish a sphere or product route until its real data is expressly approved. If the implementation can exclude the unready hub from production entirely without complexity, prefer that. No automatic transition to live selling after completing any prompt; public activation requires a separate owner instruction.

### Future boundary (not in this implementation)

Readings may ultimately support direct payment after content approval; spell packages may require a screening step before payment. This affects only future-compatible **informational** page design. Do not build forms, ask for sensitive client data, connect a processor, or implement deferred endpoints now.

## D. Work-chat execution contract

**Every numbered prompt below is independently assignable. Execute one and stop.** For each Work session:

1. Read **AGENTS.md**, this whole document (including confirmed rules), **docs/DESIGN_SYSTEM.md**, **docs/DEVELOPMENT_WORKFLOW.md**, and the source files affected by the selected prompt. The old docs/SPECIFICATION.md and docs/IMPLEMENTATION_PROMPTS.md govern shared architecture; this later-authorized Services frontend supplement governs the new feature where it differs.
2. Inspect current **master** and existing code **before editing**. Do not assume the 2026-10-31 audit still matches current files. Work directly on master, no branches or PRs, and preserve the existing automatic Vercel deployment.
3. Execute **only** the selected SF prompt. Do not move on to another step, invent product data, enable public Services, generate images, alter payments or expand commerce.
4. Build a minimal coherent diff, with focused checks. Run **npm run qa:fast** for code changes, relevant targeted tests and responsive/keyboard QA for visual work. Keep one normal build/commit path and avoid unnecessary repeated deploys or Vercel polling.
5. Commit one reviewed set of changes to master. State the prompt ID, changed files, why, actual checks and results, tested viewport widths/screenshots when available, blockers, commit SHA and deployment outcome if verified. **Stop and request the owner's review rather than proceeding.**
6. If an operation is blocked by unavailable capabilities/assets/approvals, do not improvise. Complete safe partial work, identify the exact blocker and stop.

### How to invoke a prompt in Work

Copy this instruction, replacing SF-XX with the selected number:

> In bwoodson72/blackarcanum on master, read AGENTS.md and docs/SERVICES_FRONTEND_IMPLEMENTATION.md in full. Execute **only Prompt SF-XX** from that document, honoring its dependencies, scope, publication gates and acceptance criteria. Reuse existing Mystagogia components and tokens. Run relevant checks, make one atomic master commit when ready, report evidence, and stop. Do not advance automatically.

## E. Scoped implementation prompts

### Prompt SF-01 — Service catalog schema, sphere registry and publish gate

**Depends on:** none. **Goal:** create typed frontend-only source of truth, without rendering any new page.

**Work:** Define the three approved sphere records (ID, label, approved short summary optional, ordering, visible/published state) in a Services-specific registry under src/data/. Add a Services content collection in src/content.config.ts using the established Astro loader conventions and a separate schema/ID helper in src/lib/ (not the editorial topic registry). Favor MDX for detailed eventual product copy. Each entry must represent exactly one reading or spellwork product and one canonical sphere, with explicit stable slug, title, concise summary, typed kind, status draft/review/published, price in integer USD cents for a published product, availability, optional approved media reference, sections for scope/inclusions/process/turnaround/client requirements, optional explicitly curated related IDs and SEO summary. Validate unique IDs, legal sphere reference, proper money format, known related IDs at an appropriate stage, and that draft/review entries cannot generate public routes. Ensure no required fields force fake content when catalog is empty. Implement published-only selectors, deterministic sorting, URL helpers and strict tests, without touching editorial accessors.

**Files to consider:** src/content.config.ts; new src/data/service-spheres.ts; new src/lib/services-schema.ts and src/lib/services-public.ts (names may be adjusted); new empty src/content/services/; scripts/ focused schema tests; existing QA runner if appropriately integrated.

**Acceptance:** empty real catalog builds; invalid fixture slug/sphere/kind/price fails; draft or review fixture never qualifies; only fully approved published fixture yields a normalized public view; no public /services route, invented service item, price or artwork; no change in editorial public routes. **Out of scope:** cards, pages, payments, new imagery.

**Handoff:** stop after SF-01.

### Prompt SF-02 — Reusable sphere and service cards

**Depends on:** accepted SF-01. **Goal:** build view-only presentation primitives in isolation.

**Work:** Create Services-specific SphereCard, ServiceProductCard and ServiceProductGrid (use meaningful names under src/components/services/) driven by typed approved view models. Service card shows optional approved image, type badge, title, summary, formatted price, and a single keyboard-accessible link to the product's canonical route. Do not nest an anchor or button inside a clickable anchor. Sphere cards support full-card links to valid published category destinations. Use existing Container, EngravedFrame, ActionLink, typography and design tokens selectively; don't force an editorial ArticleCard into commerce use. Mobile-first grids 1 column, 2 >=768px, 3 >=1280px, with no overflow, readable focus state and reduced-motion support. Add a fixture-only visual/markup test verifying optional-image behavior and screen reader semantics; keep fake entries out of public routes.

**Acceptance:** component fixture renders both kinds, exact USD price and text-only graceful fallback; one link per card; 375/768/1024/1280/1440 viewport evaluation where available; no production dummy card. **Out of scope:** route generation, filter JS, image generation, cart.

**Handoff:** stop after SF-02.

### Prompt SF-03 — Services hub composition

**Depends on:** accepted SF-02. **Goal:** develop the hub frontend and sphere-led hierarchy without publishing false offerings.

**Work:** Build a Services hub using BaseLayout, PageHero (small compatible extension only if necessary), SectionHeading, Container, approved tokens and newly created SphereCards. Compose sections in this order: hero “Divination & Ritual Work” with true internal anchor to spheres; brief private-practice introduction; dominant sphere grid; conditional practitioner teaser (only if approved data actually exists); readings/spellwork process panels; factual principles and non-baneful boundary; short disclosure FAQ with native details/summary; closing CTA returning to sphere grid. Hub shows no product cards or prices. Use only approved factual service copy; any unsettled wording is kept unpublished. Test an isolated fixture state with the three spheres and assert the empty/disabled state neither links to nonexistent categories nor presents fictitious availability. Keep noindex/unlinked until a real sphere is ready and public activation is authorized.

**Acceptance:** one H1, early access to sphere grid on phone, real links only, FAQ keyboard/assistive behavior, correct unpublished behavior, no changed homepage hero layout. **Out of scope:** product detail routes, public launch or new artwork.

**Handoff:** stop after SF-03.

### Prompt SF-04 — Sphere landing routes and published-only product grids

**Depends on:** accepted SF-03. **Goal:** implement category pages for approved spheres only.

**Work:** Implement build-time routes for /services/{sphere}/ using getStaticPaths and the published-only service selector; generate a page only for a sphere containing real approved products. Share a SpherePage or equivalent presentational component with compact hero, meaningful copy, breadcrumbs Services → current sphere, and the reusable service grid. Show readings and spellwork together, with their respective kind badges, correct prices and working detail links. Test all three registry IDs using ephemeral fixture data, including an empty sphere case. No auto-created page for a future sphere, no 404 product links, and no directory for categories lacking a published product.

**Acceptance:** all emitted sphere pages have correct breadcrumbs, H1, product counts/links and correct canonical path; empty/unapproved sphere returns no static route; no fake live content. **Out of scope:** client-side filter, detail templates, payments.

**Handoff:** stop after SF-04.

### Prompt SF-05 — Accessible reading/spellwork filter within sphere pages

**Depends on:** accepted SF-04. **Goal:** add a lightweight in-place convenience filter, not a second catalog hierarchy.

**Work:** Add All / Readings / Spellwork controls to sphere grids where both kinds exist. Default displays all products; without JavaScript all products remain visible and linked. Prefer minimal scoped native JS; buttons must have clear labels, visible focus, accurate selected/pressed state, and status announcement showing visible product count. Hide/show by existing type metadata, not label-text parsing or duplicated arrays. Do not affect route generation, product ordering, URL canonicals, or search indexing. When one kind has zero products, show honest empty-filter feedback, not empty card skeletons.

**Acceptance:** toggling each filter shows correct subset, keyboard and no-JS behavior, no lost focus, 375px touch targets, no layout shift severe enough to harm use. Tests may use temporary fixture data. **Out of scope:** faceted search, client-side router, remote queries.

**Handoff:** stop after SF-05.

### Prompt SF-06 — Detailed product page template and routes

**Depends on:** accepted SF-04; SF-05 may be complete independently. **Goal:** define premium, specific service pages from real content.

**Work:** Add /services/{sphere}/{product-slug}/ getStaticPaths using the same published-only collection gate and validated path helper. Create reusable ServiceDetail layout for both kinds, featuring explicit breadcrumbs, heading, badge/sphere, real price, optional approved media (no generic stock), meaningful introductory copy, exactly approved scope/inclusions/process/turnaround/client-info sections from MDX or typed content, honest boundaries, and explicitly curated related services with links to actual published routes. Differentiate reading from spellwork through factual procedure descriptions, not entirely separate layouts. Reserve CTA placement but, without payments, show a text-only “Purchasing not yet available” or equivalent **only where owner-approved public informational pages exist**; no active buy button, intake form or dummy URL. Keep price in a single schema field, do not duplicate in hardcoded markup or invent discounts.

**Acceptance:** one real approved fixture renders correct hierarchy/metadata; unpublished fixture absent from routes, related items filtered; no public fiction, no fake checkout; 375–1440px responsive and keyboard checks. **Out of scope:** payments, forms, fulfillment, actual new products.

**Handoff:** stop after SF-06.

### Prompt SF-07 — Practitioner profile and verified occult résumé

**Depends on:** accepted SF-03; can be done after SF-06. **Goal:** create a structured, truthful practitioner presentation.

**Work:** Introduce a Services-specific private/public profile content source or typed MDX file and reusable page sections for experience timeline, disciplines/traditions, legitimate training/initiations if any, kinds of work, writings and practice principles. Prepare /services/practitioner/ layout with a compatible hero and editorial readable width. Render only verified, owner-approved facts; no legal name, invented occult name, third-party endorsement, credential, unverifiable experience or claims of guaranteed results. If the genuine résumé has not been supplied, implement presentation through ephemeral fixtures only; do not publish an empty résumé route or show a practitioner link on live pages. Keep the eventual profile link on hub and detail pages conditional on publication.

**Acceptance:** profile page type/fixture tests work; no fabricated public biography/credential or owner identity; links absent when unpublished; accessible long-form hierarchy and responsive reading width. **Out of scope:** writing invented résumé content, reviews, testimonials or practitioner photography.

**Handoff:** stop after SF-07.

### Prompt SF-08 — Services navigation and breadcrumb integration

**Depends on:** accepted SF-04 and SF-06. **Goal:** add discoverability only for actually live Services pages.

**Work:** Extend centralized src/lib/site-navigation.ts with a conditional Services top-level link, then verify DesktopNavigation, MobileNavigation, SiteFooter and active-state handling on nested /services/ URLs (the current components use exact pathname equality; adjust robustly without changing behavior for existing links). Keep Shop hidden. Use existing typed Breadcrumbs for hub → sphere → product and for practitioner. Ensure header does not overflow at supported viewport widths with the extra link; preserve mobile modal focus and Escape behavior. Do not expose top-level Services if the hub is nonindexable/unlaunched or no published sphere page exists.

**Acceptance:** correct current nav on nested routes, true destinations for all activated links, no dead link, dialog keyboard/focus behavior retained; old editorial navigation unchanged. **Out of scope:** checkout, Shop, cross-collection searches.

**Handoff:** stop after SF-08.

### Prompt SF-09 — Homepage Services invitation

**Depends on:** accepted SF-08. **Goal:** integrate Services into the existing homepage without changing its editorial identity.

**Work:** Add a restrained, visually consistent Services introduction in src/pages/index.astro and scoped homepage styles, after the existing editorial content and before NewsletterSection. Link to a **live** Services hub and up to three approved sphere pages when they exist; no misleading “available now” copy, fake category link, price, or fabricated case study. Preserve the existing illustrated hero, exact hero min-height, two editorial gateways, curated features, Grimoire spotlight and newsletter. The section must be gated off automatically when Services is not approved for public navigation.

**Acceptance:** homepage remains one H1, no broken or premature Services links, section only appears for an actual live destination, keyboard and responsive behavior at 375/768/1024/1280/1440. **Out of scope:** homepage redesign, new hero artwork, promotional countdowns.

**Handoff:** stop after SF-09.

### Prompt SF-10 — Services metadata, visibility and navigation QA hardening

**Depends on:** accepted SF-06, SF-07, SF-08. **Goal:** ensure the new static routes remain truthful and safely discoverable.

**Work:** Integrate Services page metadata with BaseLayout and the existing approved-origin/noindex/sitemap gates. Add meaningful page-specific titles/descriptions for hub, sphere, detail and approved practitioner profile. No fabricated absolute domain, same-page canonical fallback from Vercel, Product/Offer/Review ratings, merchant identity, person schema, or prices in JSON-LD without a separately reviewed decision about structured data. Keep Pagefind's current editorial-only scope unless the owner explicitly authorizes product search. Add focused build assertions that draft/unapproved services and practitioner records create no build output, sitemap entries, navigation links or search entries. Ensure broken related references are rejected or filtered deterministically.

**Acceptance:** no unintended route indexation or owner identity leak; published fixture has correct SEO/title/canonical behavior under approved test origin; Vercel preview remains under existing robots rules; no changes to actual editorial article schema. **Out of scope:** search expansion, analytics, payment metadata, legal page invention.

**Handoff:** stop after SF-10.

### Prompt SF-11 — End-to-end frontend responsive review and handoff

**Depends on:** accepted SF-01 through SF-10. **Goal:** certify completed **frontend scaffolding**, not a commercial launch.

**Work:** Exercise hub → sphere → card → detailed product → breadcrumbs and practitioner where approved, using isolated fixture products if real offerings still are not approved. Cover reading/spellwork cards, empty sphere exclusions, no-JS filter behavior, no approved imagery fallback, missing price/publishing failure, related-service links, accessibility and contrast on both dark/antique-gold and parchment surfaces. Capture/screenshots at 375, 768, 1024, 1280 and 1440px, check no horizontal overflow, 44px targets, heading semantics, meaningful alt, reduced motion, focus, mobile drawer and native FAQ details. Extend the **existing** testing approach rather than starting a duplicate CI pipeline; use npm run qa:fast as routine gate and only necessary targeted browser suites. Document reviewed paths, screenshots, unresolved approvals and readiness state.

**Acceptance:** all safe in-scope checks pass or failures are explicitly logged; no synthetic fixtures shipped publicly; all real service/product/profile publish gates remain closed until content and launch approval; no payment interaction or personal-data collection is exposed. End with a concise punch list of still-missing product copy, price approval, résumé, imagery, legal terms and processor approval. **Out of scope:** declaring business open, Stripe/Medusa, live forms, real orders.

**Handoff:** stop after SF-11.

## F. Tracking and review

Update a row only after that one prompt has been completed and accepted by the owner. The existence of this plan is not authorization to execute SF-01 or any later prompt.

| Prompt | Scope | State | Commit | Verification / blockers |
| --- | --- | --- | --- | --- |
| SF-01 | Service schema and publish gate | Completed; owner accepted | Local commit only | Unit suites, build, typecheck, high/critical audit and route checks pass. Full qa:fast stops at pre-existing outdated sample-article expectations. No push or deployment. |
| SF-02 | Reusable cards and grids | Completed; owner accepted | 5fca2fc (local only) | Unit suites, build, typecheck and five-width browser checks pass. Existing sample-article QA failure remains. No push or deployment. |
| SF-03 | Services hub | Completed; owner accepted | 91679ae (local only) | Build, unit suites, typecheck, audit and five-width hub/card checks pass. Existing sample-article QA failure remains. No push or deployment. |
| SF-04 | Sphere pages | Completed; owner accepted | fa39bbb (local only) | Build, 14 unit suites, typecheck, audit and five-width sphere/hub checks pass; release and route-dependency gates remain closed. Existing sample-article QA failure remains. No push or deployment. |
| SF-05 | In-sphere filter | Completed; owner accepted | c6019a0 (local only) | Build, 14 unit suites, typecheck, audit and five-width filter/no-JS checks pass. Existing sample-article QA failure remains. No push or deployment. |
| SF-06 | Product detail pages | Completed; owner accepted | 33a6ef3 (local only) | Build, 15 unit suites, typecheck, audit and five-width detail/flow checks pass. Existing sample-article QA failure remains. No push or deployment. |
| SF-07 | Practitioner résumé | Completed; owner accepted | 7168f84 (local only) | Build, 16 unit suites, typecheck, audit and five-width profile/hub checks pass; real profile remains null. Existing sample-article QA failure remains. No push or deployment. |
| SF-08 | Navigation and breadcrumbs | Completed; owner accepted | 1805604 (local only) | Build, 17 unit suites, typecheck, audit and five-width navigation/profile checks pass; actual navigation stays hidden. Existing sample-article QA failure remains. No push or deployment. |
| SF-09 | Homepage invitation | Completed; owner accepted | 7e6b2b0; visibility correction f571d77 (local only) | Homepage and ordinary Services navigation verified at five widths; actual dev server routes verified. No push or deployment. |
| SF-10 | SEO and publication QA | Completed; owner accepted | 5317f5a (local only) | Unit suites, build, typecheck, audit and focused metadata/sitemap/search build assertions pass. Normal Services browsing preserved. Existing sample-article QA failure remains. No push or deployment. |
| SF-11 | Responsive regression / handoff | Not started | — | — |

### Owner approvals required later

- Actual named readings and spells, **specific** methods, package scope/deliverables and delivery schedules.
- Actual premium prices; no speculative numeric examples in production content.
- Practitioner's factual résumé and any public practitioner name.
- Services-specific hero/category/product imagery or explicit approval of text-first layouts.
- Exact commercial, privacy and refund terms and a deliberate public release decision.
- Stripe's written approval and all payments/intake/backend functionality are **outside this frontend workstream**.


## Owner visibility instruction — October 31, 2026

Services must be viewable through ordinary pages, site navigation and the homepage, without a development preview mode. This supersedes the earlier release-wide hiding and empty-category suppression requirements. The three approved sphere pages remain browsable with an honest empty state until actual offerings are approved. Individual draft/review offerings and unapproved practitioner facts remain excluded. Informational visibility does not authorize sales, pushes or deployments; commercial launch remains unapproved.
