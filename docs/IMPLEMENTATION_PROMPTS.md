# Mystagogia — Sequential Implementation Prompts

**Version:** 1.1 (revised from v1.0; 41 executable steps)  
**Date:** October 27, 2026  
**Authority:** [Specification v1.2](./SPECIFICATION.md) · [Design system](./DESIGN_SYSTEM.md) · [Approved visual references](./design-references/README.md)  
**Repository:** `bwoodson72/blackarcanum` — Astro frontend, `master` branch  
**Status:** Implementation plan only. No prompt is automatically authorized by the existence of this document.

## Usage and scope contract

Complete **exactly one** numbered prompt per coding session or explicit user authorization. Treat the completion of all lower-numbered prompts as a dependency, not as permission to continue. Use the global execution contract below and the entirety of the selected numbered prompt. Prompt 32 onward requires separate approval of the commerce phase; prompt 41 requires explicit production-launch permission. The actual data source or production host must be verified during its assigned step. Each prompt defines a deliverable, excluded work, and specific acceptance checks. Do not silently skip validation; report genuinely impossible tests as blockers.

### Change-control and precedence

The user's latest explicit decisions supersede stale prose; the approved specification defines **what**, the design reference defines **appearance**, and the selected numbered prompt defines **what may be changed now**. Existing code and verified real vendor APIs inform implementation details, but must not justify unapproved scope expansion. If two instructions materially conflict, report the conflict and stop, rather than improvising. Commit only reviewable code, licensed assets and documentation; never secrets.

### Global execution contract (include with each numbered prompt)

> Repository: bwoodson72/blackarcanum (Astro frontend, default branch master). First read AGENTS.md, docs/SPECIFICATION.md (approved v1.2), docs/DESIGN_SYSTEM.md, docs/design-references/README.md and the assigned prompt; inspect code relevant to this prompt. Mystagogia is the final public brand; no domain is selected. Maintain owner anonymity everywhere public. Execute ONLY the assigned prompt after previous numbered prompts have been reviewed/accepted. Limit diffs to the scope given; do not infer permission from future prompts. Astro/MDX-first and mobile-first; select Starwind controls only when needed. Use centralized Tailwind CSS 4 @theme/semantic tokens and shared component styles; avoid repeated arbitrary colors/sizes and redundant giant class strings. Do not fabricate topics, historical claims/citations, product records, prices, reviews, artwork, licensing, newsletter actions, domain names or public author identity. No unapproved new images or live products/courses. The approved mockups are visual references rather than source assets. Keep Medusa in a separate backend repo. All draft/review material stays out of public routes, sitemaps and search. Run scoped tests + available typecheck/build; record commands, changed files, screenshots when visual, limitations and commit/PR. Stop after the assigned prompt for user review. If required input, credentials, licensing or user approval are absent, implement an honest disabled state or report the blocker; do not substitute made-up facts.

### Per-prompt handoff (mandatory)

Include **(a)** prompt number, **(b)** files changed and why, **(c)** checks run and actual results, **(d)** screenshots/viewport notes for visual tasks, **(e)** blockers or remaining known limitations, **(f)** commit/PR reference, **(g)** the exact statement “Stopped after Prompt XX.” Do not begin Prompt XX+1.

## Prompts — execute sequentially

### Prompt 01 — Baseline audit and reproducible checks

**Phase:** Foundation  
**Requires:** existing starter repository only  
**Objective:** Verify the starter and make its baseline reproducible.

**Execute (this prompt only):**

Inspect AGENTS.md, package.json, lockfile, astro.config.mjs, Starwind configuration, tsconfig and starter pages. Run npm ci and npm run build; identify and correct only genuine baseline failures. Set package.json name to blackarcanum. Add astro check tooling and an npm typecheck script when missing; preserve existing versions unless required for compatibility. Replace the starter README with an accurate setup/commands overview, separately noting that Medusa has its own repository. Do not change page design.

**Required deliverables and acceptance evidence:**

npm ci, npm run build, and npm run typecheck succeed, or each specific external blocker is documented. Diff contains only starter-fix/tooling/README changes; no new pages, fonts, or visual components.

**Explicitly out of scope:**

No app scaffolding, theme work, deployment, package upgrades unrelated to a reproduced failure.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 01.”

---

### Prompt 02 — Semantic tokens and Starwind mapping

**Phase:** Foundation  
**Requires:** accepted Prompt 01  
**Objective:** Provide one canonical, testable design-token system.

**Execute (this prompt only):**

Define approved charcoal #1A1A1A, deep brown #2B261E, parchment #F5EEDC, aged paper #E0D4B8, antique gold #C4A962, sage #6B705C, and oxide red #7F2D2D as documented source palette. Add semantic background/surface/ink/text-muted/border/accent/button roles, typography placeholders, spacing, layout widths, border/radius/shadow and fluid type-size tokens. Implement Tailwind 4 @theme mappings and map Starwind variables to these roles in one stylesheet; avoid duplicate Tailwind imports between global.css and starwind.css. Test generated utilities and contrast; tune semantic text roles for legibility without silently changing raw approved palette.

**Required deliverables and acceptance evidence:**

A documented table maps each token to semantic usage and Starwind variables. CSS build succeeds; no default-blue Starwind tokens remain for brand controls; no repeated arbitrary hex in components. Record contrast measurements for key text/button pairs.

**Explicitly out of scope:**

No fonts to download, components to create, or homepage styling yet.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 02.”

---

### Prompt 03 — Licensed self-hosted fonts

**Phase:** Foundation  
**Requires:** accepted Prompt 02  
**Objective:** Install the approved three font families with performant fallback.

**Execute (this prompt only):**

Obtain Cormorant Garamond, Source Serif 4 and Inter from official/open-license sources. Retain license notices and provenance URLs in docs; commit only relevant webfont formats/subsets and required weights. Add local @font-face definitions with font-display:swap and named --font-display, --font-reading, --font-interface mappings plus fallback stacks. Set initial heading/body/UI typographic role styles in shared CSS; avoid a remote CSS font dependency. If a license or acquisition is unresolved, document the exact blocker and STOP without fake files.

**Required deliverables and acceptance evidence:**

Fonts are in repository, load without third-party font network requests, and are demonstrably applied to headings, reading text and controls; tests/build pass. Record weights, license files and fallback behavior.

**Explicitly out of scope:**

No artwork sourcing, redesign, or page layout work.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 03.”

---

### Prompt 04 — BaseLayout and metadata interface

**Phase:** Foundation  
**Requires:** accepted Prompt 03  
**Objective:** Replace Astro starter document shell with accessible layout.

**Execute (this prompt only):**

Create src/layouts/BaseLayout.astro with typed title, description, optional image and noindex props; implement proper document language, viewport, favicon fallback, meta descriptions, OG/twitter defaults without fabricated URLs, skip-to-content and semantic main landmark. Import exactly one global theme CSS entry. Keep canonical URL optional until a real site URL is configured. Update starter index route to consume BaseLayout with a neutral, truthful temporary shell, not the full approved homepage.

**Required deliverables and acceptance evidence:**

No Astro Basics title or unrelated starter branding in served HTML; default metadata renders and can be overridden; skip link lands at main; build/typecheck pass with no fake production URL.

**Explicitly out of scope:**

No header/footer, Library routes, or invented placeholder content.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 04.”

---

### Prompt 05 — Foundation layout and controls

**Phase:** Foundation  
**Requires:** accepted Prompt 04  
**Objective:** Create the smallest reusable primitive set.

**Execute (this prompt only):**

Implement typed Container.astro variants wide (~1280px), reading (~720px), and full; SectionHeading.astro with optional eyebrow/description/ornament; Ornament.astro using CSS/SVG only if original/rights-cleared; and semantic primary/secondary link and button variants. Use Tailwind utilities for ordinary layout but semantic tokens for repeating visual decisions. Add Starwind interactive controls only if actually needed now, leaving unneeded components uninstalled. Test variants through an internal-only/non-indexed fixture, not a public demo route.

**Required deliverables and acceptance evidence:**

Props/types documented; all variants render at 375,768,1280; keyboard focus visible; no duplicated long utility strings; CSS/compile checks pass.

**Explicitly out of scope:**

No main navigation, new themed artwork generation, or advanced components.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 05.”

---

### Prompt 06 — Responsive header and navigation

**Phase:** Site shell  
**Requires:** accepted Prompt 05  
**Objective:** Implement accessible global navigation without broken early links.

**Execute (this prompt only):**

Implement SiteHeader plus desktop links and a mobile navigation panel using accessible native elements or a selected Starwind component. Brand wordmark must be Mystagogia; homepage via logo. Planned sections: Library, Grimoire, Shop, About; search/subscribe are actions. While target routes remain unimplemented, omit disabled/dead links rather than pointing to 404s; Shop stays hidden until live commerce enablement. Mobile panel must open/close with keyboard, Escape, focus management, and aria semantics; keep visual treatment charcoal/gold and no overflow.

**Required deliverables and acceptance evidence:**

Manual or automated checks at 375,768,1024,1440; accessible focus/escape/close; all rendered links resolve; no publicly identifying name; typecheck/build pass.

**Explicitly out of scope:**

Do not create destination pages or enable unfinished shop/search/newsletter actions.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 06.”

---

### Prompt 07 — Footer and breadcrumbs

**Phase:** Site shell  
**Requires:** accepted Prompt 06  
**Objective:** Complete reusable site chrome.

**Execute (this prompt only):**

Build SiteFooter and typed Breadcrumbs components; integrate shell header/footer in BaseLayout. Only link to real routes, explicitly approved policies or working contact methods; hide unknown legal links rather than invent legal notices. Implement responsive multi-column-to-stacked footer treatment, semantic navigation landmarks, and aria-current for breadcrumbs where relevant. Preserve anonymous public authorship.

**Required deliverables and acceptance evidence:**

Header/footer appear on existing routes, footer adapts at 375/768/1440 and breadcrumbs form a valid ordered hierarchy. All links resolve, focus/contrast checks and build pass.

**Explicitly out of scope:**

No dummy privacy/terms content, search feature, or newsletter API call.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 07.”

---

### Prompt 08 — About page

**Phase:** Site shell  
**Requires:** accepted Prompt 07  
**Objective:** Provide the required public About destination.

**Execute (this prompt only):**

Implement /about/ with concise, factual, brand-centered editorial copy: what Mystagogia publishes, Library vs Grimoire distinction, historical attribution/experience distinction, how to navigate and subscription only if active. Follow approved parchment/dark editorial design, typography and responsive sections. Do not mention the owner identity, claim a staffed institution, falsely assert affiliations or invented history. Enable About in header/footer only once the route passes.

**Required deliverables and acceptance evidence:**

/about/ loads with correct metadata and nav, mobile readability, no fictitious claims or owner identity; build and typecheck pass.

**Explicitly out of scope:**

No standalone biography, invented credentials, or new topical articles.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 08.”

---

### Prompt 09 — Typed Library and Grimoire MDX collections

**Phase:** Editorial  
**Requires:** accepted Prompt 08  
**Objective:** Establish strict, reusable article schemas and publication gates.

**Execute (this prompt only):**

Configure Astro content layer for two MDX-only collections (library, grimoire) using the installed MDX integration; create content config, schemas and public-entry helpers. Required: stable ID/slug, title, description, status draft|review|published. publishedAt required only for published entries; updatedAt, hero, topics, related IDs and source IDs optional. Check unique slugs per collection and constrain public queries to published status. Keep both collections empty initially; publication is a separate explicit human approval.

**Required deliverables and acceptance evidence:**

Schema rejects missing publishedAt and invalid status/slug; draft/review are excluded from public helper; typecheck/build pass with zero articles; no unexpected routes are produced.

**Explicitly out of scope:**

No sample deity articles or preapproved topics assumed.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 09.”

---

### Prompt 10 — Topic and bibliography registries

**Phase:** Editorial  
**Requires:** accepted Prompt 09  
**Objective:** Model controlled taxonomies and source data without fake entries.

**Execute (this prompt only):**

Add editable typed src/data/topics.ts registry, initially empty, with id,label,enabled,showInBrowse,optional description/landingPage. Add reusable citation/source model including creator, title, edition/translator, period, publisher/archive, stable link, rights and page/passage locator support as applicable. Validate duplicate IDs and unknown article topic/source references; no automatically created category pages. Document how to approve a new topic/source.

**Required deliverables and acceptance evidence:**

Empty registry works; unknown IDs fail validation; topics do not auto-publish navigation/routes. Fixtures only in nonpublic tests; build/typecheck pass.

**Explicitly out of scope:**

No invented subjects, titles, primary sources, or public topic hubs.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 10.”

---

### Prompt 11 — Curated feature registry and publication QA helpers

**Phase:** Editorial  
**Requires:** accepted Prompt 10  
**Objective:** Control homepage and hub features explicitly.

**Execute (this prompt only):**

Add typed, ordered feature lists for homepage Library slots, primary Grimoire feature and optional hub features. Only explicit IDs may be featured; validate each ID resolves to a published entry. Define empty state (omit feature section, not auto-substitute newest). Add reusable content QA validation commands/checks for broken related/source/topic refs and date ordering. Keep registries empty until the editor approves real content.

**Required deliverables and acceptance evidence:**

Invalid/unpublished feature IDs fail deterministic checks; empty lists build without public blank cards; documented QA command and typecheck/build pass.

**Explicitly out of scope:**

No auto-curation, fake featured entries or visible filler artwork.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 11.”

---

### Prompt 12 — Article cards and pagination primitives

**Phase:** Editorial  
**Requires:** accepted Prompt 11  
**Objective:** Implement shared editorial presentation primitives.

**Execute (this prompt only):**

Build typed ArticleCard.astro variants standard, featured, editorial and compact; ArticleMetadata; responsive 1/2/3-column listing grid; pagination controls. Inputs should come from normalized published content model, accepting optional image/excerpt/date without broken image placeholders. Pagination must render real anchor links and accessible prev/next semantics, with compact mobile representation and consistent route building.

**Required deliverables and acceptance evidence:**

All variants render with text-only fixtures; mobile 375 has one column, tablet 768 two where sensible, 1280+ three; no nested links or decorative alt misuse. Unit snapshots/HTML fixture and build/typecheck pass.

**Explicitly out of scope:**

No hub routes and no manually hardcoded article cards.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 12.”

---

### Prompt 13 — Library hub and archive routes

**Phase:** Editorial  
**Requires:** accepted Prompt 12  
**Objective:** Publish Library index and stable paginated archives.

**Execute (this prompt only):**

Implement /library/ and /library/page/[page]/ listing only published Library entries in newest-first order (date then stable ID tie-break), 12 per page from a shared constant. Page 1 only on /library/; page 2+ use /library/page/N/. Use ArticleCard/grid/pagination and approved scholarly landing design. Empty site shows a truthful, visually composed introduction; no out-of-range or duplicate page-1 routes. Test with isolated fixture data not deployed.

**Required deliverables and acceptance evidence:**

Tests for 0,1,12,13,25 entries verify sorting, paths, count and previous/next; no draft exposure; responsive/metadata/build checks pass.

**Explicitly out of scope:**

No topic hubs, search implementation or invented Library articles.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 13.”

---

### Prompt 14 — Grimoire hub and archive routes

**Phase:** Editorial  
**Requires:** accepted Prompt 13  
**Objective:** Publish distinct editorial Grimoire index using same data helpers.

**Execute (this prompt only):**

Implement /grimoire/ and /grimoire/page/[page]/ from published Grimoire only; 12/page, same canonical pagination rules and tie-breaking. Reuse data helpers but render editorial horizontal feature/list layouts on desktop, stacked mobile. Intro describes original methods, experiments and practitioner observations without impersonating author. Empty state should be truthful, not fabricated journal entries.

**Required deliverables and acceptance evidence:**

Data tests parallel Library 0/12/13/25 cases; responsive at 375/768/1440; no drafts/cross-collection duplicates; build/typecheck pass.

**Explicitly out of scope:**

No third journal section, personal biography or fake Grimoire experiences.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 14.”

---

### Prompt 15 — Article routes and responsive reading shell

**Phase:** Editorial  
**Requires:** accepted Prompt 14  
**Objective:** Render published MDX articles in distinct Library/Grimoire views.

**Execute (this prompt only):**

Implement article slugs under /library/[slug]/ and /grimoire/[slug]/; shared ArticleLayout.astro/ArticleHeader.astro with section variants, optional lead/hero/meta, reading column max ~720px, hero aspect safe fallback, and space for future TOC/sidebar. Activate full three-column shell only if central measure remains comfortable (~1440px+); below move contextual content after article. Use published-only getStaticPaths. No identifying personal byline.

**Required deliverables and acceptance evidence:**

Published fixture pages render in both collections, draft/review paths absent, at 375/768/1024/1440 text remains readable/no overflow. Metadata and build/typecheck pass.

**Explicitly out of scope:**

No ToC/citation implementation or sample live publication.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 15.”

---

### Prompt 16 — Generated table of contents

**Phase:** Editorial  
**Requires:** accepted Prompt 15  
**Objective:** Add usable heading navigation without manual duplication.

**Execute (this prompt only):**

Use Astro MDX renderer heading metadata and deterministic IDs for h2/h3. Create responsive ArticleTableOfContents supporting sticky desktop rail on wide three-column pages and details/disclosure near top on tablet/mobile. Highlight current item only if it adds minimal accessible JS; otherwise clear link states suffice. Hide for short articles; links must land at visible section headings with sticky header offset.

**Required deliverables and acceptance evidence:**

Fixture with nested headings and duplicate labels shows unique anchors; keyboard disclosure works; 375/768/1440 no reading-width squeeze; build/typecheck pass.

**Explicitly out of scope:**

No rich scroll animations, manual TOC data, or framework island unless justified.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 16.”

---

### Prompt 17 — Citations, footnotes and bibliography

**Phase:** Editorial  
**Requires:** accepted Prompt 16  
**Objective:** Render source-supported Library research accurately.

**Execute (this prompt only):**

Implement an ArticleReferences list/section backed by source IDs, inline SourceCitation component with optional passage/page locator, and accessible note/footnote IDs and return links. Render only verifiable metadata from source registry; where a field is unknown, omit it rather than invent it. Support Grimoire use as optional. Validate missing IDs and source URLs during build; distinguish quotation/citation from personal observation.

**Required deliverables and acceptance evidence:**

Fixtures demonstrate two uses of one source with different locators, keyboard reachable backlinks and sane print output; unknown IDs fail; no empty reference block; build/typecheck pass.

**Explicitly out of scope:**

No external citation database, fake citations, or required bibliography on all entries.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 17.”

---

### Prompt 18 — Related reading links

**Phase:** Editorial  
**Requires:** accepted Prompt 17  
**Objective:** Surface meaningful curated cross-links.

**Execute (this prompt only):**

Create RelatedArticles and RelatedReading from explicitly supplied related stable IDs. Allow cross-links between published Library and Grimoire entries, reject missing/unpublished targets, deduplicate and avoid self-linking; omit section if no valid relationships. Provide compact card/text variant that respects mobile reading width.

**Required deliverables and acceptance evidence:**

Fixture with one cross-collection relationship resolves to correct URL; draft/missing link fails validation or is safely excluded as specified; no empty headings; typecheck/build pass.

**Explicitly out of scope:**

No automatically inferred topic matches or affiliate links.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 18.”

---

### Prompt 19 — Central media registry and provenance

**Phase:** Media  
**Requires:** accepted Prompt 18  
**Objective:** Establish reusable image metadata independent of presentation.

**Execute (this prompt only):**

Define src/assets media structure, filename rules and typed media registry recording identifier, source file, alt, decorative flag, figure caption, creator/date/period, repository/source URL, license/rights status and reproduction vs modern artwork. Require sufficient rights metadata for historical/reference publication. Allow entries to be optional on articles, reuse media IDs across pages and preserve high-resolution originals separately when available. Do not scrape or generate imagery in this task.

**Required deliverables and acceptance evidence:**

Test valid and invalid media metadata; missing source/image/rights field flagged when required; empty registry compiles; README documents import/reuse and rights checks.

**Explicitly out of scope:**

No real historical images selected, no image UI, no external media service.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 19.”

---

### Prompt 20 — Astro responsive image renderer

**Phase:** Media  
**Requires:** accepted Prompt 19  
**Objective:** One media rendering foundation for all image contexts.

**Execute (this prompt only):**

Implement MediaImage.astro/MediaPicture.astro using Astro Image/Picture for local assets: responsive sizes/srcset, width/height or aspect-ratio, meaningful alt, priority hero vs lazy below fold. Accept named display variant: decorative/card/hero/reference; reference must not lose critical content to cropping. Provide safe SVG or existing starter asset as test fixture only, never pass placeholder artwork as historical material.

**Required deliverables and acceptance evidence:**

Generated HTML has correct srcset/loading/alt/dimensions for variants; at 375 and 1440 no horizontal overflow and no missing images; typecheck/build passes.

**Explicitly out of scope:**

No lightbox, galleries or new art generation.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 20.”

---

### Prompt 21 — Editorial MDX figure components

**Phase:** Media  
**Requires:** accepted Prompt 20  
**Objective:** Expose figure patterns to MDX authors.

**Execute (this prompt only):**

Implement ArticleImage, ReferenceFigure and FullWidthImage using the central renderer and media registry. ReferenceFigure includes figcaption and source/provenance/rights where applicable; preserves intrinsic aspect ratio. FullWidthImage breaks reading measure only at permissible widths. Register mappings for both Library and Grimoire MDX collections; add test-only MDX fixture illustrating one image and one historical reference.

**Required deliverables and acceptance evidence:**

Both collections compile MDX figure usage; captions linked and accessible; detailed image uncropped; mobile and 1440 review + build/typecheck pass.

**Explicitly out of scope:**

No lightbox, gallery, or user-unapproved historical images.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 21.”

---

### Prompt 22 — Reference-image lightbox

**Phase:** Media  
**Requires:** accepted Prompt 21  
**Objective:** Provide accessible enlarge/inspect behavior as its own task.

**Execute (this prompt only):**

Implement a lightbox only for opt-in reference images, using native dialog or a verified Starwind dialog. Support open by click/keyboard, Escape/close, focus entry/restore, descriptive label/caption, fit-to-screen and view-original link; optional zoom only if correctly supported on touch and keyboard. Keep the non-JS image/attribution readable, avoid trapping screen reader content outside semantics.

**Required deliverables and acceptance evidence:**

Automated/manual keyboard sequence covers focus restore/Escape/screen-reader label; 375 and desktop fit images without clipping; graceful no-JS fallback and build/typecheck pass.

**Explicitly out of scope:**

No gallery carousel or advanced image manipulation.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 22.”

---

### Prompt 23 — Textual MDX editorial blocks

**Phase:** Media  
**Requires:** accepted Prompt 22  
**Objective:** Provide minimal author-facing prose enhancements.

**Execute (this prompt only):**

Implement Callout (informational/caution variants only if justified), SourceNote, QuoteBlock and ContentCTA as typed MDX components for both collections. CTA is entirely opt-in and may link only to implemented live destinations; unknown offer destinations cause validation failure or nonrendering, not a dead button. Use semantic blockquote/aside/figure markup and shared typography tokens.

**Required deliverables and acceptance evidence:**

Test MDX fixtures in both collections for prose nesting, keyboard links, accessible contrast, no forced CTA or image, and responsive rendering; typecheck/build pass.

**Explicitly out of scope:**

No promotional offers, fake newsletter signups, or complex style inventories.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 23.”

---

### Prompt 24 — Multi-image MDX components

**Phase:** Media  
**Requires:** accepted Prompt 23  
**Objective:** Provide optional responsive galleries and comparisons.

**Execute (this prompt only):**

Implement ImageGallery and CompareImages on top of the existing media renderer. Gallery accepts an ordered list of approved media IDs with per-image caption and responsive 1/2/3-column or horizontally scrollable accessible layout; CompareImages labels each side and supports stacked mobile presentation with uncropped subject detail. Reuse single-image provenance and optional lightbox where appropriate.

**Required deliverables and acceptance evidence:**

Two/three-image fixture shows labels/captions, no horizontal page overflow at 375px, meaningful order in screen-reader DOM, no duplicated image conversion logic; build/typecheck pass.

**Explicitly out of scope:**

No real article publication or bespoke media slider dependencies.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 24.”

---

### Prompt 25 — Homepage composition from approved reference

**Phase:** Homepage  
**Requires:** accepted Prompt 24  
**Objective:** Implement actual Mystagogia editorial gateway.

**Execute (this prompt only):**

Build / from approved homepage reference: charcoal/gold masthead and illustrated hero treatment (only with rights-cleared supplied art or tasteful CSS fallback), primary Library/Grimoire actions, equal gateway panels, curated Library features, Grimoire spotlight, newsletter slot, and Shop only when commerce truly live. Use explicit feature registry with no auto-newest fallback. Match warm parchment reading blocks, Cormorant/Source Serif/Inter hierarchy and responsive mockup composition. Do not copy fake product images or article titles from mockups.

**Required deliverables and acceptance evidence:**

375/768/1024/1440 screenshots compared to docs/design-references/homepage-approved.webp and responsive reference; page looks complete with no articles, uses no dead links/placeholder pricing, and build/typecheck pass.

**Explicitly out of scope:**

No asset generation without concept approval, no Kit submission logic, no Shop launch.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 25.”

---

### Prompt 26 — Responsive accessibility and visual QA

**Phase:** Quality  
**Requires:** accepted Prompt 25  
**Objective:** Resolve cross-template accessibility/visual issues.

**Execute (this prompt only):**

Audit homepage, About, hubs and article fixtures for headings, skip links, keyboard nav, focus, mobile drawer, contrast, reduced motion, alt/captions, reading line length, overflow, tap targets and link destinations. Compare approved homepage/article/responsive images. Add automated smoke checks where feasible and write docs/QA.md with inspected routes/sizes and before/after evidence. Fix problems discovered in this pass only.

**Required deliverables and acceptance evidence:**

Verify widths 375/768/1024/1280/1440; no high-severity accessibility/overflow regressions; document any reference-fidelity difference or unresolved issue; build/typecheck pass.

**Explicitly out of scope:**

No unrelated redesign, commerce work or new public content.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 26.”

---

### Prompt 27 — Technical SEO and sitemap rules

**Phase:** Discovery  
**Requires:** accepted Prompt 26  
**Objective:** Complete metadata and discovery for approved published pages.

**Execute (this prompt only):**

Implement per-page title/description, canonical when real Astro.site configured, OG fallback using licensed real asset if available, article type/schema without owner identity, robots/noindex handling for special pages, sitemap integration conditional on nonplaceholder public site URL. Restrict collection pages/sitemaps to published articles, preserve page-1 canonical pagination rules and avoid invented domain.

**Required deliverables and acceptance evidence:**

Inspect HTML for published fixture and draft excluded, verify no fictional origin/author; build with/without site URL behaves predictably; typecheck/build pass.

**Explicitly out of scope:**

No analytics, domain purchase or unsolicited legal content.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 27.”

---

### Prompt 28 — Pagefind indexing pipeline

**Phase:** Discovery  
**Requires:** accepted Prompt 27  
**Objective:** Make editorial search indexing repeatable and draft-safe.

**Execute (this prompt only):**

Install/configure Pagefind CLI post-build to index only published Library/Grimoire article content. Mark inclusion/exclusion regions, index title/description/headings/body, block drafts/review/hidden fixture routes and non-editorial paths. Document the script order: Astro build then Pagefind. Add one disposable nonpublic build-test fixture or test harness to assert a known phrase appears and an unpublished phrase does not.

**Required deliverables and acceptance evidence:**

Clean build+Pagefind succeeds; scripted test proves published known-term match and draft/legal exclusion; no indexed dead paths; all output is generated, not committed source files.

**Explicitly out of scope:**

No search UI, Shop product indexing or fabricated live articles.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 28.”

---

### Prompt 29 — Editorial search interface

**Phase:** Discovery  
**Requires:** accepted Prompt 28  
**Objective:** Build accessible Library/Grimoire search experience.

**Execute (this prompt only):**

Implement /search/ and connect SiteHeader search trigger; use Pagefind browser API, URL-encoded query for shareability, All/Library/Grimoire scopes and relevance-ranking with safe snippets. Group/filter results by collection, include empty/loading/error states, keyboard search, accessible labels and no broken links. Only show Shop tab after enabled product source exists. Ensure searching zero published articles produces a respectful empty state.

**Required deliverables and acceptance evidence:**

Keyboard/mobile smoke tests at 375 and 1440; controlled fixture query returns correct scope and URL state, no Shop tab, no draft result, no sitewide JS bundle beyond search interaction; build/typecheck/search passes.

**Explicitly out of scope:**

No live Medusa queries or newsletter integration.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 29.”

---

### Prompt 30 — Kit newsletter form and endpoint

**Phase:** Audience  
**Requires:** accepted Prompt 29  
**Objective:** Implement consent-aware audience acquisition.

**Execute (this prompt only):**

Create NewsletterForm and NewsletterSection using approved tokens and reusable layouts; put only in active homepage/approved placements. Use secure server-side Kit API interaction and env vars with explicit names and validation, appropriate subscription confirmation/consent as configured, rate limiting/honeypot or comparable anti-spam safeguards, success/failure states without leaking provider responses/secrets. If credentials unavailable, show honest disabled state; document Vercel runtime requirements and local integration test strategy.

**Required deliverables and acceptance evidence:**

Secret never in built browser JS; tests cover invalid input, provider failure, no credentials, and truthful success; keyboard labels and build/typecheck pass. Explicitly note if live provider delivery not tested.

**Explicitly out of scope:**

No invented lead magnet, sender identity or forced newsletter modal.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 30.”

---

### Prompt 31 — Editorial frontend release review

**Phase:** Quality  
**Requires:** accepted Prompt 30  
**Objective:** Verify the content-led site is ready for controlled deployment.

**Execute (this prompt only):**

Run from clean install through Astro build, typecheck, Pagefind, fixture route checks, publication gates, component consistency, token/contrast audit, responsive screenshots, SEO and Kit credential-safety review. Ensure README and docs include Vercel env setup, domain pending, nonlive features disabled, rollback notes and open blockers. Remove test/demo output from public routes.

**Required deliverables and acceptance evidence:**

Publish a pass/fail checklist with evidence and unresolved issues; public source contains no owner identity or invented topics; no deployment performed.

**Explicitly out of scope:**

No live launch, domain commitment, Shop implementation or public content publication.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 31.”

---

### Prompt 32 — Medusa Store API and fulfillment contract

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 31  
**Objective:** Verify the actual separate commerce integration before writing storefront.

**Execute (this prompt only):**

Read connected Medusa backend version/configuration (separate repo) and documented Store API endpoints for product, variant, region, cart, checkout, availability and search. Confirm Printful apparel SKU/size/color mapping, regional pricing/shipping and Stripe test checkout capabilities. Record API origins, publishable keys vs server-only secrets and CORS/session approach in docs/COMMERCE_CONTRACT.md. No made-up provider features or live API claims; identify blockers.

**Required deliverables and acceptance evidence:**

Contract explicitly lists verified endpoints, request/response shapes, missing environment vars, availability assumptions and test prerequisites. Repo untouched outside documentation; zero live orders.

**Explicitly out of scope:**

Do not change the Medusa backend, checkout, or frontend storefront.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 32.”

---

### Prompt 33 — Shop gateway and real catalog grid

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 32  
**Objective:** Implement the approved apparel-first storefront shell.

**Execute (this prompt only):**

Create /shop/ conditionally using verified Medusa Store API and correct region/currency; display actual active T-shirts/hoodies prominently and, if real, other merchandise/digital books. Implement reusable ProductCard, product/category navigation, responsive 1/2/3 grid, images/price/availability from API only. Use approved apparel-inclusive Shop mockup, not the books-only concept. Handle loading/empty/backend-unavailable, and keep main nav Shop hidden until launch flag explicitly enabled.

**Required deliverables and acceptance evidence:**

Catalog renders a controlled real/sandbox API dataset at 375/768/1440, reflects backend price correctly, creates no dummy products, fails gracefully offline; build/typecheck pass.

**Explicitly out of scope:**

No Shop search, apparel variants, cart or live purchase enablement.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 33.”

---

### Prompt 34 — Shop filters and product search

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 33  
**Objective:** Make real catalog discoverable independently of editorial search.

**Execute (this prompt only):**

Implement Shop-local search input and filters using supported Medusa Store API semantics: name/description/subject, product family, real price range, availability, size/color only where backed by variants; sorting relevance/price/newest when API supports. Use URL query parameters so filters persist across refresh/back. Ensure mobile filter drawer and accessible result counts/empty/reset states. Do not invent unsupported taxonomy or false inventory.

**Required deliverables and acceptance evidence:**

Test query, reset, out-of-stock filter, sort and mobile navigation with real/sandbox backend responses; no stale fabricated counts; build/typecheck pass.

**Explicitly out of scope:**

No global unified search integration, cart or checkout.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 34.”

---

### Prompt 35 — Apparel/digital product detail and variants

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 34  
**Objective:** Display accurate product pages and selectable purchasable variants.

**Execute (this prompt only):**

Build /shop/[handle]/ product detail with correct product title, description, regional price, apparel size/color selections, selected purchasable variant ID and stock state, and digital format selector only for actual digital products. Size charts and care/shipping descriptions must originate from verified supplier/product information. Disable Add-to-Cart until valid purchasable variant. Reflect approved black tee/hoodie styling without assuming unverified blank/print method compatibility.

**Required deliverables and acceptance evidence:**

Selecting size/color changes correct variant ID/price and availability; unavailable choice cannot be added; 375/1440 layouts accessible; metadata and build/typecheck pass.

**Explicitly out of scope:**

No image-gallery lightbox expansion, cart lifecycle, fake reviews or invented Printful guarantees.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 35.”

---

### Prompt 36 — Product photography/gallery and sizing UI

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 35  
**Objective:** Complete rich but accurate apparel presentation.

**Execute (this prompt only):**

Implement product media gallery with front/back/details/variant images only where provided; thumbnail selection, accessible full-size view when possible, real size chart and material/print/care info. Use product image assets from authorized supplier/store sources and preserve correct dark-garment artwork rendition; do not claim DTFlex automatically supported. Product details and size chart accordions are optional but must be keyboard usable.

**Required deliverables and acceptance evidence:**

Gallery reacts to real variant selection, images have alt/dimensions, chart readable at 375, no speculative badges/reviews, no overflow; build/typecheck pass.

**Explicitly out of scope:**

No user-generated reviews, invented product photography, or purchasing flow implementation.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 36.”

---

### Prompt 37 — Medusa cart lifecycle

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 36  
**Objective:** Support variant-based carts safely before payment is connected.

**Execute (this prompt only):**

Implement cart create/retrieve/add/update/remove via verified Medusa APIs, persisted cart ID within appropriate session storage/cookies, cart drawer or /cart/ page with correct variant/quantity/region/currency, empty/loading/error handling, and quantity limits. Protect publishable vs secret keys appropriately; prices/totals always server-authoritative. Cart action must not submit any payment.

**Required deliverables and acceptance evidence:**

Sandbox tests cover multiple garment variants, quantity updates, remove, empty, expired session and offline API. Cart price matches returned backend, no duplicate line item bug, responsive/keyboard/build/typecheck pass.

**Explicitly out of scope:**

No live checkout, credit-card collection, fulfillment or invented shipping costs.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 37.”

---

### Prompt 38 — Stripe/Medusa sandbox checkout

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 37  
**Objective:** Implement test-only checkout from verified cart state.

**Execute (this prompt only):**

Use the verified Medusa v2 cart/fulfillment/payment flow for shipping address, shipping option, payment session/Stripe checkout and order confirmation in sandbox only. Keep secret tokens server-side; do not implement unsupported endpoints from assumption. Provide truthful taxes/shipping/returns messaging from configured backend and explicit unsupported-region errors. Document webhook/order callback, failure and abandoned-payment behavior.

**Required deliverables and acceptance evidence:**

End-to-end sandbox order, decline/retry/cancel and region variants verified with backend evidence, no credential leakage, and a hard guard preventing real orders without later express approval.

**Explicitly out of scope:**

No live payment capture or Printful production fulfillment.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 38.”

---

### Prompt 39 — Unified editorial and product search

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 38  
**Objective:** Unify Pagefind and Medusa without weakening either source.

**Execute (this prompt only):**

Add Shop scope to /search/ only when catalog is active. All tab groups Library, Grimoire and live Medusa Shop results for same query; price/availability from backend; editorial results retained when commerce request fails. Shop-local search from prompt 33 remains available. Handle combined count labeling without suggesting false precision when backend reports partial/unknown counts.

**Required deliverables and acceptance evidence:**

Fixtures demonstrate same-term results in all three scopes, correct links/ranking/order, commerce timeout with editorial still functioning, and no Shop tab if disabled; build/typecheck pass.

**Explicitly out of scope:**

No global storefront launch or third-party paid search platform.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 39.”

---

### Prompt 40 — Printful sandbox fulfillment and merchandising QA

**Phase:** Commerce — requires separate authorization  
**Requires:** accepted Prompt 39  
**Objective:** Prove the sale can be fulfilled before enabling real purchases.

**Execute (this prompt only):**

Using sandbox/test capabilities and verified separate backend integration, trace an apparel order from Medusa product variant to Printful SKU, size/color, artwork placement, shipping rates and status callbacks. Confirm Bella+Canvas 3001/Gildan 18500 and proposed DTFlex only where Printful currently supports each combination; flag unverified claims and review no-sample quality risk. Confirm tax, returns/cancellation, digital delivery boundaries and support workflow; document operations without manufacturing an order.

**Required deliverables and acceptance evidence:**

A documented test path and pass/fail supplier compatibility table exists; unsupported combinations blocked; no real orders activated; backend changes require separate approval.

**Explicitly out of scope:**

No new live supplier orders, paid sample purchases or unapproved designs.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 40.”

---

### Prompt 41 — Production launch audit and handoff

**Phase:** Launch — separate explicit authorization  
**Requires:** accepted Prompt 40  
**Objective:** Provide controlled production readiness signoff.

**Execute (this prompt only):**

Only after domain/launch permission, configure real site origin and verify sitemap/canonicals, Pagefind, Kit, Store API, approved checkout/fulfillment, analytics/consent and required legal text. Inspect public copy, image EXIF, structured data, newsletter identity and asset paths for owner real-name leakage. Verify redirects, 404, security headers, deployment/rollback, health checks and accessible 375/768/1440 routes. Produce a final launch runbook with exact unresolved blockers.

**Required deliverables and acceptance evidence:**

Launch checklist signed off with URLs/screenshots/build evidence; publication and order processing only after explicit approval; rollback documented.

**Explicitly out of scope:**

Never silently purchase a domain, deploy, publish content or enable real payments.

**Handoff:** Use the mandatory format and end with “Stopped after Prompt 41.”

---

## Execution tracker

Update only when a prompt has been reviewed/accepted, retaining any failed verification or blockers.

| ID | Phase | Prompt | Status | Commit / PR | Evidence and issues |
| --- | --- | --- | --- | --- | --- |
| 01 | Foundation | Baseline audit and reproducible checks | Not started | — | — |
| 02 | Foundation | Semantic tokens and Starwind mapping | Not started | — | — |
| 03 | Foundation | Licensed self-hosted fonts | Not started | — | — |
| 04 | Foundation | BaseLayout and metadata interface | Not started | — | — |
| 05 | Foundation | Foundation layout and controls | Not started | — | — |
| 06 | Site shell | Responsive header and navigation | Not started | — | — |
| 07 | Site shell | Footer and breadcrumbs | Not started | — | — |
| 08 | Site shell | About page | Not started | — | — |
| 09 | Editorial | Typed Library and Grimoire MDX collections | Not started | — | — |
| 10 | Editorial | Topic and bibliography registries | Not started | — | — |
| 11 | Editorial | Curated feature registry and publication QA helpers | Not started | — | — |
| 12 | Editorial | Article cards and pagination primitives | Not started | — | — |
| 13 | Editorial | Library hub and archive routes | Not started | — | — |
| 14 | Editorial | Grimoire hub and archive routes | Not started | — | — |
| 15 | Editorial | Article routes and responsive reading shell | Not started | — | — |
| 16 | Editorial | Generated table of contents | Not started | — | — |
| 17 | Editorial | Citations, footnotes and bibliography | Not started | — | — |
| 18 | Editorial | Related reading links | Not started | — | — |
| 19 | Media | Central media registry and provenance | Not started | — | — |
| 20 | Media | Astro responsive image renderer | Not started | — | — |
| 21 | Media | Editorial MDX figure components | Not started | — | — |
| 22 | Media | Reference-image lightbox | Not started | — | — |
| 23 | Media | Textual MDX editorial blocks | Not started | — | — |
| 24 | Media | Multi-image MDX components | Not started | — | — |
| 25 | Homepage | Homepage composition from approved reference | Not started | — | — |
| 26 | Quality | Responsive accessibility and visual QA | Not started | — | — |
| 27 | Discovery | Technical SEO and sitemap rules | Not started | — | — |
| 28 | Discovery | Pagefind indexing pipeline | Not started | — | — |
| 29 | Discovery | Editorial search interface | Not started | — | — |
| 30 | Audience | Kit newsletter form and endpoint | Not started | — | — |
| 31 | Quality | Editorial frontend release review | Not started | — | — |
| 32 | Commerce — requires separate authorization | Medusa Store API and fulfillment contract | Not started | — | — |
| 33 | Commerce — requires separate authorization | Shop gateway and real catalog grid | Not started | — | — |
| 34 | Commerce — requires separate authorization | Shop filters and product search | Not started | — | — |
| 35 | Commerce — requires separate authorization | Apparel/digital product detail and variants | Not started | — | — |
| 36 | Commerce — requires separate authorization | Product photography/gallery and sizing UI | Not started | — | — |
| 37 | Commerce — requires separate authorization | Medusa cart lifecycle | Not started | — | — |
| 38 | Commerce — requires separate authorization | Stripe/Medusa sandbox checkout | Not started | — | — |
| 39 | Commerce — requires separate authorization | Unified editorial and product search | Not started | — | — |
| 40 | Commerce — requires separate authorization | Printful sandbox fulfillment and merchandising QA | Not started | — | — |
| 41 | Launch — separate explicit authorization | Production launch audit and handoff | Not started | — | — |

## Visual reference catalog

The files listed below must be checked into `docs/design-references/` before a visual prompt is executed. These are design-only mockups, not licensed publishing artwork or approved article/product data.

- `homepage-approved.webp` — authoritative desktop homepage and palette/typography reference.
- `responsive-layouts.webp` — desktop/tablet/mobile homepage and editorial layouts.
- `library-article.webp` — Library editorial article reference.
- `grimoire-article.webp` — Grimoire editorial article reference.
- `shop-apparel-approved.webp` — latest approved apparel-inclusive Shop responsive mockup.
- `shop-books-earlier.webp` — earlier store concept for comparison only; apparel-inclusive mockup wins if they differ.

Do not copy the imagery, example religious themes, assumed book titles, product prices, author bylines or placeholder dates from reference designs into live pages.

## Deliberate deferrals and gates

- **Identity:** Public brand Mystagogia, domain TBD, owner publicly anonymous.
- **Assets:** fonts uninstalled at baseline; no approved original production art. Prepare during relevant approved prompt.
- **Editorial:** topics and publication require the owner’s affirmative approval. No public fixtures/drafts.
- **Commerce:** Medusa backend is separate, live catalog and checkout behavior require inspection; apparel-first, actual garment/printing compatibility is unverified until checked.
- **External services:** Kit credentials, Vercel configuration, domain, and paid vendor settings must not be fabricated.
- **Launch:** No deployment, product sale or content publishing solely from this document.