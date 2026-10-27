# Mystagogia — Sequential Implementation Prompts

**Version:** 1.0  
**Date:** October 27, 2026  
**Source of truth:** Mystagogia Project Specification v1.2 and approved design references  
**Target:** `bwoodson72/blackarcanum` (Astro frontend, `master`)  
**Execution mode:** One prompt at a time; review the diff/test evidence before authorizing the next.

## How to use this document

Copy the **Global execution contract** and exactly one numbered prompt into the coding session. If the coding agent retains instructions reliably, the contract may be provided once at session start, but always repeat it for a new session. A prompt is complete enough to execute on its own; the preceding prompt must be accepted/merged before the next is started. No prompt authorizes a deployment, public content publication, artwork generation, purchases, or live payment activity without separate express permission.

Keep a small execution log for each prompt: branch/commit, affected files, commands run, evidence, unresolved blocker, user approval. Do not skip failing gates.

## Global execution contract

Operate only in the existing GitHub repository bwoodson72/blackarcanum (default branch master), without scaffolding a second Astro app or mixing in the separate Medusa backend. Read AGENTS.md, package.json, astro.config.mjs, and relevant current code before editing. Treat /Mystagogia/Specifications/Mystagogia_Project_Specification_v1.2.md and approved design references as the requirements authority, and inspect them if available; if unavailable, use the concrete requirements in this prompt and do not invent missing assets/content. Mystagogia is the final public brand; the domain is undecided. Never expose the owner's legal identity in public text, assets, metadata or configurations. Maintain Astro-first rendering, accessible semantic markup, and mobile-first CSS. Define recurring styles with Tailwind CSS 4 @theme and semantic CSS tokens integrated with Starwind; do not scatter arbitrary Tailwind values, duplicate long class strings, or hardcode brand colors. Do not fabricate editorial topics, sources, imagery, product records, prices or claims. Do not generate artwork without explicit user approval of its concept. No courses or Academy. No automatic publishing of draft content. Make the smallest coherent changes for this prompt only, preserve unrelated work, run available build/typecheck and relevant tests (install/check tooling when that is the scoped task), report results and changed files, and STOP; do not start the next prompt.

## Ordered prompt queue

The phase labels indicate sequencing, not independent permission to execute future work. Prompts 25–29 are a **separately authorized commerce and launch phase**; do not execute them as part of initial editorial-site implementation.

### Prompt 01 — Baseline audit and safe build

**Phase:** Foundation  
**Outcome:** Inspect starter and establish reliable checks, without UI implementation.

**Execution prompt (copy with Global execution contract):**

Inventory installed versions/configuration, verify a clean install and production build, fix only blocking starter issues; add an Astro type-check script using appropriate tooling if needed; document current baseline in README including main commands and separate commerce repo boundary. Correct empty package name to blackarcanum. Do not install fonts or build pages in this step.

**Acceptance checks:**

Clean install and build pass; typecheck command works; README is accurate; changes are minimal.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 01”.

---

### Prompt 02 — Token foundation and Starwind mapping

**Phase:** Foundation  
**Outcome:** Create the single-source-of-truth visual system.

**Execution prompt (copy with Global execution contract):**

Establish centralized Tailwind 4 @theme tokens and semantic CSS properties matching approved charcoal, parchment, antique gold, supporting accents, reading measures, radii, spacing, borders and shadows. Align existing src/styles/starwind.css with tokens; remove generic default-blue visual semantics without breaking Starwind. Avoid double importing Tailwind and document token names. No page redesign yet.

**Acceptance checks:**

Named utilities and Starwind semantics resolve to one token layer; no repeated hardcoded brand hex values in components; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 02”.

---

### Prompt 03 — Self-host typography

**Phase:** Foundation  
**Outcome:** Acquire and configure approved typefaces.

**Execution prompt (copy with Global execution contract):**

Obtain properly licensed webfont files for Cormorant Garamond (display), Source Serif 4 (reading), and Inter (interface) from reputable official distributors. Include only necessary weights/formats/subsets, store in project, provide license/attribution notices and @font-face definitions with font-display:swap; map all families and type scales to semantic tokens. If download/access unavailable, stop and report precisely, without pretending files were installed. Do not fabricate font files.

**Acceptance checks:**

Fonts exist locally in repo or blocking issue reported; no reliance on remote font CSS; heading/body/UI classes use tokens; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 03”.

---

### Prompt 04 — Site shell and SEO baseline

**Phase:** Foundation  
**Outcome:** Implement document shell independent of final domain.

**Execution prompt (copy with Global execution contract):**

Replace Astro Basics layout with reusable BaseLayout including site title Mystagogia, viewport, theme-color, accessible landmarks/skip link, default metadata, open graph slots, basic SEO helpers, and site-wide font/theme CSS. Keep canonical/sitemap hostname configuration optional until domain exists; do not invent a production URL. Do not yet build full homepage.

**Acceptance checks:**

Starter title removed; shell is semantic and token-styled; domain-dependent URLs are not fabricated; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 04”.

---

### Prompt 05 — Foundation UI patterns

**Phase:** Foundation  
**Outcome:** Implement meaningful primitives only.

**Execution prompt (copy with Global execution contract):**

Implement shared Container variants (wide/reading/full), SectionHeading, Ornament and reusable link/button treatments. Install only Starwind controls demonstrably needed now, adapting them to semantic tokens. Ornament must be CSS or approved/rights-cleared asset only; no unapproved image generation. Add a minimal visual test/demo page only if clearly non-public or temporary.

**Acceptance checks:**

Primitive props are typed; no duplicated long utility chains; narrow/mobile widths handled; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 05”.

---

### Prompt 06 — Header and responsive navigation

**Phase:** Site shell  
**Outcome:** Create global navigation based on approved information architecture.

**Execution prompt (copy with Global execution contract):**

Build SiteHeader with Mystagogia wordmark, Library, Grimoire, About, search trigger, newsletter action and a Shop entry conditioned on real store launch status. Desktop navigation and accessible mobile drawer with correct focus, escape, close, aria and touch behavior. Do not surface empty Shop or speculative categories. Style with tokens, not arbitrary values.

**Acceptance checks:**

Keyboard/mobile navigation usable at 375/768/1024/1440px; Shop hidden when unlaunched; no overflow; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 06”.

---

### Prompt 07 — Footer, breadcrumbs, and site-level polish

**Phase:** Site shell  
**Outcome:** Complete reusable site chrome.

**Execution prompt (copy with Global execution contract):**

Build SiteFooter, Breadcrumbs and optional reusable legal/navigation links. Add only routes that have meaningful content or required policies; do not publish placeholder legal assertions. Connect into BaseLayout and verify shared spacing/contrast; include no identifying legal name publicly.

**Acceptance checks:**

All live routes share header/footer; breadcrumbs have valid semantics; missing routes not linked; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 07”.

---

### Prompt 08 — Typed editorial collections and publication gates

**Phase:** Editorial  
**Outcome:** Introduce source-of-truth article storage.

**Execution prompt (copy with Global execution contract):**

Configure Astro Content Collections for MDX-only library and grimoire; typed frontmatter includes stable slug/ID, title, description, status draft|review|published, publication date required for published entries, optional updated date/image/topics/references/related IDs. Provide filter/helper that excludes all drafts/reviews from public generation and index. No example deity topics or fabricated published articles.

**Acceptance checks:**

Schema rejects invalid records; unpublished content cannot appear on public pages/sitemaps; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 08”.

---

### Prompt 09 — Topic, sources and feature registries

**Phase:** Editorial  
**Outcome:** Add intentional editorial metadata infrastructure.

**Execution prompt (copy with Global execution contract):**

Add empty, version-controlled approved topic registry (no invented topics); reusable bibliographic source model (no fake entries), and ordered homepage/hub feature configuration (initially empty). Validate stable IDs, existence, publication status, and opt-in topic visibility; do not auto-create categories or feature newest content implicitly.

**Acceptance checks:**

Unapproved topic refs fail validation; empty registries do not create empty public pages; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 09”.

---

### Prompt 10 — Article cards and listing primitives

**Phase:** Editorial  
**Outcome:** Build reusable cards from validated article records.

**Execution prompt (copy with Global execution contract):**

Create typed ArticleCard variants (standard, featured, editorial, compact), ArticleMetadata, responsive article list/grid, and pagination control. Card image is optional, text remains readable; use content collection fields instead of duplicated hardcoded copy. Do not build whole hubs yet.

**Acceptance checks:**

Variant styles share tokens; no broken image placeholders; accessible links; 1/2/3-column behavior as specified; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 10”.

---

### Prompt 11 — Library hub and numbered archive pagination

**Phase:** Editorial  
**Outcome:** Create functioning Library listing behavior.

**Execution prompt (copy with Global execution contract):**

Build /library/ and /library/page/[page]/ from published MDX library entries with 12 items/page from one constant, newest-first deterministic order. Page 1 only at /library/; crawlable numbered and previous/next links; empty state tasteful, not fabricated research. Include accurate page metadata; no empty out-of-range routes.

**Acceptance checks:**

Pagination and sorting verified using local nonpublished fixtures/tests where possible; zero-published library gives valid hub; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 11”.

---

### Prompt 12 — Grimoire hub and numbered archive pagination

**Phase:** Editorial  
**Outcome:** Implement distinctive Grimoire listing using shared infrastructure.

**Execution prompt (copy with Global execution contract):**

Build /grimoire/ and /grimoire/page/[page]/ using published Grimoire MDX, 12/page, deterministic ordering, editorial horizontal cards on desktop and stacked mobile cards. Reuse listing/pagination logic from Library; no separate journal section; no fabricated practitioner accounts.

**Acceptance checks:**

Paths and links correct; responsive layout distinct but consistent; drafts excluded; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 12”.

---

### Prompt 13 — Shared article layout and routes

**Phase:** Editorial  
**Outcome:** Render both published MDX article types.

**Execution prompt (copy with Global execution contract):**

Implement ArticleLayout, ArticleHeader, and canonical article routes for library and grimoire, with optional hero, metadata and central ~720px reading column. Full three-column shell only when width permits (~1440+); narrow view shows single column, related sidebar moves below. Article body from MDX; no public byline exposing identity.

**Acceptance checks:**

Published article pages render, drafts not routed; responsive 375/768/1024/1440 checked; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 13”.

---

### Prompt 14 — Heading-derived table of contents

**Phase:** Editorial  
**Outcome:** Add non-manual article navigation.

**Execution prompt (copy with Global execution contract):**

Extract headings from rendered MDX and implement responsive ArticleTableOfContents: optional sticky left rail on genuinely wide desktop; accessible collapsible contents near article start on tablet/mobile. Proper heading IDs, links, keyboard support and overflow behavior. Hide when too few sections, without artificial headings.

**Acceptance checks:**

Links land on headings; expanded/collapsed states accessible; reading width preserved; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 14”.

---

### Prompt 15 — Related reading, references and citations

**Phase:** Editorial  
**Outcome:** Finish research article affordances.

**Execution prompt (copy with Global execution contract):**

Build RelatedArticles/RelatedReading and ArticleReferences, supporting reusable source records, bibliographic details and passage/page locators, inline citation/footnote patterns as feasible without adding a large unsupported system. Related articles must be explicitly selected or validated; no fabricated sources; library/grimoire cross-links allowed.

**Acceptance checks:**

Source links and related IDs validate; empty states omit sections cleanly; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 15”.

---

### Prompt 16 — Asset registry and responsive image renderer

**Phase:** Media  
**Outcome:** Install organized local image infrastructure.

**Execution prompt (copy with Global execution contract):**

Set up src/assets media organization, master/source naming guidance and typed metadata registry (creator/period/archive/source/rights/alt). Build underlying Astro Image/Picture renderer with responsive sizing, aspect-ratio and decorative vs reference behavior. Preserve fine-line information; no unapproved art generated, no sample licensed art assumed. Include image usage documentation.

**Acceptance checks:**

Missing/invalid media metadata flagged; responsive output works with a safe existing fixture; no forced image requirement; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 16”.

---

### Prompt 17 — MDX editorial image components

**Phase:** Media  
**Outcome:** Expose media variants to authors.

**Execution prompt (copy with Global execution contract):**

Implement ArticleImage, ReferenceFigure and FullWidthImage using shared renderer; captions, alt text, provenance, source and rights rendered where needed, no misleading AI/historical representation. Add accessible reference-image enlargement/lightbox with focus handling and zoom only if practical; if complex, isolate lightbox into a follow-on task rather than degrading base accessibility.

**Acceptance checks:**

Figures preserve proportions, attributes and source details; lightbox either passes accessibility checks or documented as a separate scope; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 17”.

---

### Prompt 18 — MDX text and advanced media blocks

**Phase:** Media  
**Outcome:** Complete minimal author-facing content toolbox.

**Execution prompt (copy with Global execution contract):**

Implement Callout, SourceNote, QuoteBlock, ContentCTA, plus optional ImageGallery/CompareImages built on image renderer. Register components for both MDX collections. ContentCTA remains opt-in and must point only to valid live offers/sections. Avoid gratuitous styling variants and fake example promotions.

**Acceptance checks:**

Both collections can embed components; responsive galleries and quotes do not overflow; no mandatory CTA; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 18”.

---

### Prompt 19 — Homepage editorial composition

**Phase:** Homepage  
**Outcome:** Translate approved desktop/mobile mockups into assembled sections.

**Execution prompt (copy with Global execution contract):**

Build approved Mystagogia homepage: expressive hero, equal Library/Grimoire paths, curated Library articles, featured Grimoire content, newsletter invitation slot and Shop section only when selling. Use feature registry (not automatically latest). Reuse typography/cards and ornamental elements. Do not generate art without approved concept or fill cards with fictitious articles.

**Acceptance checks:**

Home looks coherent with zero published articles; visual hierarchy matches references across sizes; no dead destinations; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 19”.

---

### Prompt 20 — Accessibility and visual-regression pass

**Phase:** Quality  
**Outcome:** Harden responsive frontend before integrations.

**Execution prompt (copy with Global execution contract):**

Review keyboard interactions, heading hierarchy, focus rings, contrast, reduced motion, image alt, no horizontal overflow, and article line length. Add practical automated accessibility smoke checks or manual QA checklist; capture representative viewport reviews at 375, 768, 1024, 1280, 1440. Address only documented regressions and token violations.

**Acceptance checks:**

QA report identifies checked routes/viewports and fixes; build/typecheck succeed; no major accessibility blockers.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 20”.

---

### Prompt 21 — SEO, sitemap and editorial discoverability

**Phase:** Discovery  
**Outcome:** Complete canonical technical SEO without invented domain.

**Execution prompt (copy with Global execution contract):**

Activate installed @astrojs/sitemap only when site URL is configured; add metadata/schema for genuinely published editorial content, robots handling, RSS only if desired and warranted, share image fallbacks, draft exclusions and stable canonical routes. Use environment configuration for pending domain and avoid hardcoded placeholder URLs.

**Acceptance checks:**

Published entries only in sitemap/SEO; no fictional author names, domain or topics; build passes with documented domain setup.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 21”.

---

### Prompt 22 — Pagefind editorial search

**Phase:** Discovery  
**Outcome:** Build index/search of published Library and Grimoire only.

**Execution prompt (copy with Global execution contract):**

Add Pagefind as build-step postprocessor for generated production pages and implement accessible /search/ results and header search trigger. Index title, description, headings and article body; scope Library/Grimoire, exclude drafts/legal/noindex paths, clear empty states, linkable query and keyboard behavior. No Shop tab until live catalog available.

**Acceptance checks:**

Post-build search finds known published fixture text; no drafts indexed; All/Library/Grimoire scopes work; build pipeline reproducible.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 22”.

---

### Prompt 23 — Kit newsletter integration

**Phase:** Audience  
**Outcome:** Deliver secure, consent-aware subscription.

**Execution prompt (copy with Global execution contract):**

Implement NewsletterForm and NewsletterSection in homepage and optional site placements. Integrate Kit via server-side secret handling and nonleaky endpoint; validate input, double opt-in/consent behavior as configured, success/error states, accessible labels and spam mitigation. If API credentials are unavailable, implement a clearly disabled/nonlive state and document required secret names; never invent keys or silently submit to fake service.

**Acceptance checks:**

Secrets server only; form behaves appropriately with and without credentials; no false subscription success; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 23”.

---

### Prompt 24 — Final frontend release readiness

**Phase:** Quality  
**Outcome:** Prepare initial content site for controlled launch.

**Execution prompt (copy with Global execution contract):**

Run complete build, typecheck, search build, route checks, drafts validation, token audit, representative responsive review, legal/footer/noindex review and security sanity check. Update project README and deployment environment checklist (domain pending). Do not publish, deploy, introduce live content or choose domain without instruction.

**Acceptance checks:**

Release checklist with pass/fail evidence and blockers; no unintended live deploy or content publication.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 24”.

---

### Prompt 25 — Shop catalog contract and integration plan

**Phase:** Commerce (separate phase)  
**Outcome:** Inspect real Medusa API before coding storefront.

**Execution prompt (copy with Global execution contract):**

In the separate authorized commerce phase only, inspect running Medusa v2 version, supported Store API routes, auth, product/variant model, region/currency, filters, cart/checkout endpoints and Printful integration capabilities. Document frontend API contract, security boundaries and unresolved vendor dependencies. Do not modify backend repo or fabricate catalog/product data.

**Acceptance checks:**

API contract and verified assumptions documented; unresolved dependencies explicitly flagged; no frontend commerce implementation yet.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 25”.

---

### Prompt 26 — Shop browsing and product search

**Phase:** Commerce (separate phase)  
**Outcome:** Build apparel-first product discovery.

**Execution prompt (copy with Global execution contract):**

Implement /shop/ responsive catalog from live allowed Medusa Store API, with product cards, apparel prominence, product-family/subject filters, price and availability, size/color filters only when supported, and Shop-specific search. Reuse design tokens and approved Shop visual reference. Hide when catalog unavailable; no sample prices/reviews/claims.

**Acceptance checks:**

Catalog states and filters reflect real backend responses; accessible on mobile; graceful unavailable states; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 26”.

---

### Prompt 27 — Product details, cart and checkout

**Phase:** Commerce (separate phase)  
**Outcome:** Finish real commerce interaction after backend verification.

**Execution prompt (copy with Global execution contract):**

Implement product detail gallery, garment variants, sizing info, shipping/returns disclosures, cart lifecycle and Stripe/Medusa checkout via supported APIs. Never expose admin/Printful/Stripe secret keys to browser. Prices/availability must follow region and variant; test fulfillment lifecycle in sandbox before launch, and do not enable orders without approval.

**Acceptance checks:**

Variant/cart/checkout tested end to end in sandbox, secure error states; no live sales enabled without authorization.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 27”.

---

### Prompt 28 — Unified search with live Shop scope

**Phase:** Commerce (separate phase)  
**Outcome:** Combine editorial and product results without mixing data provenance.

**Execution prompt (copy with Global execution contract):**

Extend Pagefind editorial /search/ to combine live Medusa search results in All and Shop tabs. Group by Library, Grimoire, Shop; product counts/prices and availability come from backend. Keep article search available when commerce API fails; Shop search remains on storefront. No empty Shop tab if commerce disabled.

**Acceptance checks:**

Scoped and All searches return correct grouped data; editorial fallback works during API errors; build passes.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 28”.

---

### Prompt 29 — Launch audit and production handoff

**Phase:** Release  
**Outcome:** Validate final brand site and future-safe operations.

**Execution prompt (copy with Global execution contract):**

After explicit launch authorization and domain selection, configure production URL, canonical tags, sitemap, Pagefind, Kit, Medusa/Stripe/Printful, analytics/consent, privacy/security policies, and smoke tests. Verify apparel stock/variant/shipping policies before accepting orders. Check all public content/assets/metadata for real-name leakage. Document runbook and rollback.

**Acceptance checks:**

Production checklist signed off, no fabricated offers or unverified commercial flows; deploy only with authorization.

**Handoff required:** File list, relevant diffs or PR, build/typecheck/test outcomes, screenshots where visual, known limitations, and explicit “Stopped after Prompt 29”.

---

## Execution tracker

| Prompt | Stage | Status | Branch / PR / commit | Notes |
|---|---|---|---|---|
| 01 — Baseline audit and safe build | Foundation | Not started | — | — |
| 02 — Token foundation and Starwind mapping | Foundation | Not started | — | — |
| 03 — Self-host typography | Foundation | Not started | — | — |
| 04 — Site shell and SEO baseline | Foundation | Not started | — | — |
| 05 — Foundation UI patterns | Foundation | Not started | — | — |
| 06 — Header and responsive navigation | Site shell | Not started | — | — |
| 07 — Footer, breadcrumbs, and site-level polish | Site shell | Not started | — | — |
| 08 — Typed editorial collections and publication gates | Editorial | Not started | — | — |
| 09 — Topic, sources and feature registries | Editorial | Not started | — | — |
| 10 — Article cards and listing primitives | Editorial | Not started | — | — |
| 11 — Library hub and numbered archive pagination | Editorial | Not started | — | — |
| 12 — Grimoire hub and numbered archive pagination | Editorial | Not started | — | — |
| 13 — Shared article layout and routes | Editorial | Not started | — | — |
| 14 — Heading-derived table of contents | Editorial | Not started | — | — |
| 15 — Related reading, references and citations | Editorial | Not started | — | — |
| 16 — Asset registry and responsive image renderer | Media | Not started | — | — |
| 17 — MDX editorial image components | Media | Not started | — | — |
| 18 — MDX text and advanced media blocks | Media | Not started | — | — |
| 19 — Homepage editorial composition | Homepage | Not started | — | — |
| 20 — Accessibility and visual-regression pass | Quality | Not started | — | — |
| 21 — SEO, sitemap and editorial discoverability | Discovery | Not started | — | — |
| 22 — Pagefind editorial search | Discovery | Not started | — | — |
| 23 — Kit newsletter integration | Audience | Not started | — | — |
| 24 — Final frontend release readiness | Quality | Not started | — | — |
| 25 — Shop catalog contract and integration plan | Commerce (separate phase) | Not started | — | — |
| 26 — Shop browsing and product search | Commerce (separate phase) | Not started | — | — |
| 27 — Product details, cart and checkout | Commerce (separate phase) | Not started | — | — |
| 28 — Unified search with live Shop scope | Commerce (separate phase) | Not started | — | — |
| 29 — Launch audit and production handoff | Release | Not started | — | — |

## Explicit deferrals and safeguards

- Final brand **Mystagogia**; repository may remain named `blackarcanum`; domain deliberately pending.
- Approved fonts are not installed in the starter project; the agent must acquire legitimate self-hosted files during Prompt 03.
- Visual mockups are references, **not production images**; create/source assets only under applicable license and with approval for original generated artwork.
- No editorial topic lists, source citations, products, prices, testimonials, or reviews are to be invented as real content.
- Article drafts/review entries must never leak into production routes, search or sitemaps.
- No speculative Academy/course routes; the Shop is hidden until merch is actually available.
- Medusa remains in a separate backend repository; avoid mixing backend implementation into this Astro starter.
- Detailed checkout and operations work is contingent on live vendor/API verification and separate approval.