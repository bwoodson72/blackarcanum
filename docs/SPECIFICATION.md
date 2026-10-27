# Mystagogia — Website Project Specification

**Version:** 1.2 — Approved implementation baseline  
**Date:** October 27, 2026  
**Status:** Approved architecture and design decisions; phased implementation baseline. No code changes authorized by this document alone  
**Starting point:** An Astro project is already initialized. Do not scaffold or reinstall Astro.

## 1. Product vision

Build an independent esoteric research and practical-magic website with two editorial pillars: an authoritative, source-driven **Library** designed to attract evergreen organic search traffic, and an author-driven **Grimoire** section featuring the practitioner's methods, experiments, firsthand observations, and original insights. The website builds a direct audience through **Kit (ConvertKit)** and monetize initially through **Printful** print-on-demand apparel and merchandise, with digital publications possible later. No courses or Academy are planned for launch.

**Positioning:** A serious, accessible resource for occult research and applied practice—not a generic witchcraft blog, a novelty merchandise shop, or a storefront with an incidental blog.

**Success model:** Discoverability through research → engagement with applied material → email subscription → a long-term relationship with interested readers. Merchandise is a complementary revenue stream. Digital publications may be added later if warranted, but a course funnel is not part of the current plan.

## 2. Audience and content principles

Primary audiences are curious researchers of occult traditions, practicing occultists seeking historical context and methods, and readers interested in the author's practical approach. Readers may enter through any article or product page; navigation must not assume they arrive on the homepage.

Maintain a clear editorial distinction:

- **Library:** What historical documents, living traditions, scholarly work, and identifiable practitioners actually say. Attribute sources precisely; distinguish primary sources, later interpretations, and modern practitioner reports.
- **Grimoire:** How the author practices, adapts methods, evaluates experiences, and develops original ideas. First-person voice is appropriate. Label original adaptations as such; do not attribute them to historical texts without support.

Do **not** create a separate Journal section. Essays, experiment logs, reports, and original methods all belong within Grimoire and can be grouped into series or topic clusters.

Do not generate thin keyword pages, fabricated citations, unexplained symbols presented as authentic, or empty categories. Useful material comes before promotion.

## 3. Information architecture and editorial control

### Permanent navigation (structure, not topics)

**Library | Grimoire | Shop | About**

The homepage is linked from the logo. Search and Subscribe are header actions; Contact and legal/policy pages belong in the footer. **Shop should appear in navigation only when merchandise is available. There is no Academy section or placeholder.**

### Minimal sitemap

```text
/
/library/
/library/[slug]/
/library/page/[page]/     # Page 2 onward
/grimoire/
/grimoire/[slug]/
/grimoire/page/[page]/    # Page 2 onward
/shop/                  # Only when merchandise is available
/about/
/newsletter/
/search/
/contact/
/privacy/
/terms/
# Additional commerce, legal, and account routes only when required.
```

These are **route capabilities**, not instructions to generate placeholder pages. The site must **not** assume it will publish about any specific deity, tradition, technique, historical text, or occult topic. Such subjects are editorial decisions, not hardcoded website categories.

### Controlled topic registry

Create **one editable, version-controlled topic registry** (proposed location `src/data/topics.ts`) and use it as the source of truth for topic labels and visibility. The registry should start empty until topics are explicitly selected.

Each approved topic may have:

- `id` / stable slug and `label` / display name
- `description` (optional)
- `enabled` (may authors assign this topic to new articles?)
- `showInBrowse` (may it appear as a directory/filter/featured topic?)
- `landingPage` (optional; create one only after deliberate editorial approval and sufficient content)
- `featured` (optional, for homepage placement)

A topic can be used by Library, Grimoire, or both. An article references approved topic IDs in its metadata; adding an article does **not** automatically create a navigation item, landing page, or featured card. **No topic, collection, or page is published merely because it appeared in a suggested sitemap.**

For the initial Astro build, controlling the registry in a simple TypeScript file is sufficient. A CMS or graphical topic-management interface is a possible later enhancement, **not a requirement or dependency now**. The author approves each topic; tools and content generation must not create new subjects on their own.

Browse and related-article interfaces can draw from published content with approved visible topics. Empty topic pages never appear. Hidden or archived topics can be removed from navigation without deleting historical articles or changing their permanent URLs. Search remains available across published editorial content, independent of topic-directory visibility.

**Editorial rule:** The author decides *what* to cover. The site decides only *how* to display approved material.

### Editorial listing pagination

The Library and Grimoire each require **independent, numbered pagination** for their article index pages. Pagination is a presentation feature, not a predefined topic hierarchy.

- Show **12 published articles per page** initially, controlled by one configurable constant.
- `/library/` and `/grimoire/` are page 1; subsequent pages use `/library/page/2/`, `/grimoire/page/2/`, etc. Do not produce `/page/1/` duplicates.
- Generate pages at build time with Astro's `paginate()` from each MDX collection. Exclude drafts and unpublished material before paginating.
- Order by publication date, newest first, with a deterministic tie-breaker for entries sharing a date.
- Include accessible **Previous**, **Next**, and numbered page controls; hide unavailable controls.
- Give each paginated page its own self-referencing canonical URL, appropriate title, and crawlable links. Include legitimate listing pages in the XML sitemap; no empty or out-of-range pages.
- Display article title, excerpt, date, and optional thumbnail on listings. MDX article bodies remain on their individual canonical URLs.
- Do not use infinite scroll as the sole method for accessing older articles.
- If topic-filtered archives are later approved, define their pagination and canonical strategy separately. Do not create topic listing pages by default.

## 4. Editorial content system

Use Astro **Content Collections** with typed schemas and **MDX (`.mdx`) for every editorial article**, including articles that are currently text-only. Integrate `@astrojs/mdx`. This ensures all articles can embed author-approved call-to-action blocks, newsletter subscription forms, and custom Astro-compatible components wherever needed without changing file formats later. Start with two main collections: `library` and `grimoire`. Supporting structured data may include `topics`, `sources`, `series`, and `authors` (not all require public pages).

### Shared fields for each entry

- Stable ID / canonical slug
- Title, description, summary / excerpt
- Author
- Published date and updated date
- Hero image and descriptive alternative text when relevant
- Content collection (Library or Grimoire) and optional IDs from the approved topic registry
- Related content IDs and optional series position
- Draft / publication status
- SEO override metadata only when needed

### Research-specific fields

- Optional editorial subtype when useful; do not predefine a taxonomy of subjects
- Bibliography / citations with source identifiers and relevant locations
- Distinction between primary evidence, interpretations, and practitioner reports
- Optional chronology, cultural context, alternative names, and cross-references

### Practice-specific fields

- Optional article format (method, experiment, experience, essay, follow-up); these are formats, not required topic categories
- Method provenance (traditional, adapted, original)
- Prerequisites, materials, and procedure as appropriate
- Personal observations and interpretation clearly attributed to the author
- Related research references and preceding/follow-up entries
- Optional associated digital publication or download when one actually exists

A subject may have both a Library entry and multiple Grimoire entries. Link them contextually without duplicating their content. Each substantial article must have useful introductory context, readable headings, related reading, and source attribution where applicable.

## 5. Templates and user experience

Every Library and Grimoire article is authored as MDX so editors may place reusable components inline. The article templates should support both a standard related-reading/footer CTA area and optional in-body components; CTAs are not mandatory, and placement must be controlled by the author.

**Homepage:** Approved mockup is the visual reference. Dark hero; two prominent Library/Grimoire entry points; curated featured research and Grimoire work; Kit newsletter; Shop only when operational. Homepage is not a second chronological archive.

**Research index:** Display published entries and only those topic filters or hubs the author has approved. An empty topic registry should still leave a useful chronological or curated index and search. No presumptive subject hierarchy.

**Library entry:** Title; context and key questions; main body; citations/bibliography; updated timestamp; related research; appropriate links to the author's practice and, only if relevant, a newsletter resource or product.

**Practice index:** Display published methods, experiments, insights, and series; organize by author-approved topics where available, with a simple latest/featured view as a fallback. No required subject hierarchy.

**Grimoire entry:** Method or idea up front; clear narrative; steps where instructional; experience/observations separated from interpretation as needed; links to underlying research; subscription or product CTA when directly relevant.

**Shop:** Merchandise collections and product pages later, showing garment details, images, sizes, colors, costs, shipping information and policies. Shop does not dominate research pages.

**Search:** Provide unified search across published Library and Grimoire articles (Pagefind) and available Shop products (Medusa Store API), with contextual filters and source-labeled results. Exclude drafts, checkout, account pages, and legal boilerplate.

## 6. Newsletter and audience development

Use **Kit (ConvertKit)** as the sole email marketing platform. One subscriber audience, with topic tags/segments derived from signup context. Initial integration can use an official Kit embedded form, avoiding a custom server endpoint until there is a concrete need. If adopting a custom form later, call Kit from secure server-side code, never expose private API credentials, and implement spam/rate-limit protections.

Provide a global subscription page, footer or contextual placements, and one useful launch incentive (not a dozen lead magnets). Subscribers opt in knowingly; confirmation, consent records, unsubscribes, and privacy disclosures must be handled appropriately. Suggested initial emails: welcome, orientation to the library, introduction to the author's practical work. Product sequences come after products exist.

Track newsletter signup by referring section and topic, without exposing personally identifiable subscriber data in analytics.

## 7. Commerce boundary

Courses and an Academy are explicitly outside the current website scope. The only commerce area planned is the Shop for Printful merchandise; digital books or downloads may be considered separately later.

The **main Astro website and Medusa commerce backend are separate repositories and deployments**. No shared npm workspace or nested Medusa project. Astro owns editorial routes, rendering, brand, and public UI. Medusa owns the product catalog, pricing, cart/order/customer and promotion systems, and payment integration. Printful fulfillment is configured behind Medusa; Kit remains independent.

On the frontend, use Medusa's **Store API** and its publishable API key for permitted storefront operations. Do not expose secret Medusa admin keys, Stripe secret keys, or Printful credentials in browser code. Correctly handle regions/currencies, variation availability, pricing, shipping, checkout state, and backend downtime. Cart and checkout behavior require end-to-end testing before launch. The Printful integration's capabilities must be verified rather than assumed.

For the first editorial release, Medusa integration may remain entirely absent, provided the site architecture allows it to be added without reorganizing research content. Course delivery, student accounts, and an Academy are out of scope. If digital publications are introduced later, their sales and delivery will be specified at that time.

## 8. Technical implementation

- **Framework:** Existing Astro project. Preserve its current working scaffold.
- **Language:** TypeScript where appropriate, strict checking for application code.
- **Styling:** Tailwind CSS 4.
- **UI system:** Use Starwind UI selectively for accessible interactive primitives, keeping installed source in the project. Layouts and editorial design are custom Astro components. Install only controls needed for an implemented feature.
- **Interactivity:** Prefer native Astro/HTML and lightweight scripts. Add Svelte islands only when an interaction needs them; avoid defaulting to a client-rendered application.
- **Rendering:** Prerender research, practice, directory, and marketing pages as static HTML. Add Astro's Vercel server adapter and on-demand routes only when a feature requires server execution.
- **Hosting:** Vercel for Astro; independently hosted Medusa (Railway is the current candidate).
- **Content storage:** MDX (`.mdx`) with Git version control for all Library and Grimoire articles. Use Astro Content Collections with MDX rendering and the `@astrojs/mdx` integration; optional headless CMS only if editorial workflow later justifies it.
- **Embedded components:** Author-approved Astro components can be imported into MDX, including contextual CTAs, Kit forms, callouts, references, and future merchandise placements. Do not embed secrets or make every article dependent on a running commerce backend. Design reusable components; individual articles decide when and where to use them.
- **Search:** Pagefind for static editorial full text; Medusa Store API for current product inventory; present as unified scoped search (details §20).
- **Media:** Responsive optimized images; appropriate licensing and attribution; no unapproved generated artwork.
- **No unnecessary dependencies:** Verify a clean Astro build after each major integration.

### Indicative source organization (updated for v1.1; not scaffolding instructions)

```text
src/
  assets/                     # Astro-optimized originals, organized by subject/article
  content/
    library/                  # All articles .mdx
    grimoire/                 # All articles .mdx
  content.config.ts
  data/
    topics.ts                 # Author-controlled registry; initially empty
    media/                    # Optional typed centralized media metadata
  components/
    starwind/                 # Selected installed Starwind controls, only as needed
    foundation/               # Container, SectionHeading, Ornament
    site/                     # Header, mobile nav, footer, search trigger, breadcrumbs
    editorial/                # Cards, headers, ToC, pagination, references, related
    mdx/                      # ArticleImage, ReferenceFigure, Callout, CTA, etc.
    newsletter/               # Form and visual section
    commerce/                 # Later Shop phase, not created at launch
  layouts/
    BaseLayout.astro
    HubLayout.astro
    ArticleLayout.astro
  lib/
    content/
    images/
    seo/
  pages/
    index.astro
    library/
    grimoire/
    about.astro
    search/
  styles/
    global.css
    typography.css
public/                         # Assets needing unmodified/direct delivery
```

## 9. SEO, discoverability, and measurement

Every public editorial page needs a unique title, useful meta description, canonical URL, clear H1, readable headings, semantic links, and relevant structured data where valid. Generate sitemap(s), robots.txt, and RSS/updates feed. Use `Article`/`BlogPosting`, `BreadcrumbList`, and other schema types only when accurate. Do not mark unpublished or invented reviews, products, or credentials.

Plan content clusters **only for topics the author approves**, guided by actual reader questions and search intent, not mass-produced keyword variations. Use internal links between related research and practical work; distinguish a source citation from an internal site link. Maintain a brand-based or approved pseudonymous About/editorial attribution and clear editorial standards. Measure organic landing pages, engaged reading, internal navigation to Grimoire, signup events, and later product conversion in GA4 and Search Console. Respect consent and privacy settings.

## 10. Approved design direction and accessibility requirements

**Approved visual reference:** The most recently approved Mystagogia homepage mockup, plus the previously accepted Library and Grimoire article mockups. These are visual design references, not pixel-perfect implementation requirements. **Mystagogia is only a placeholder name**; no final brand/domain decision has been made.

**Typographic roles:** Cormorant Garamond (display/headings), Source Serif 4 (long-form reading), Inter (UI/navigation/metadata). Self-host/subset fonts when possible; preserve fallbacks and avoid layout shifts.

**Color palette from the approved homepage concept (provisional tokens for implementation):** charcoal `#1A1A1A`, deep brown `#2B261E`, parchment `#F5EEDC`, aged paper `#E0D4B8`, antique gold `#C4A962`, sage `#6B705C`, oxide red `#7F2D2D`. Colors may need accessibility adjustments for body text and controls; never rely on decorative gold for low-contrast small text.

**Page templates to implement:** (1) Homepage: dark illustrated hero, dual Library/Grimoire panels, curated Library cards, featured Grimoire content, newsletter signup, optional Shop section only when live. (2) Library hub: search-first archive, curated featured pieces, paginated article grid; no preassigned topic hierarchy. (3) Grimoire hub: author-driven introduction, featured writing, paginated editorial list; no separate Journal. (4) Library article: legible reading column, optional sticky desktop table of contents, references, related Library and Grimoire links, optional relevant CTA. (5) Grimoire article: same reading system, method/experiment metadata when appropriate, optional sidebar, related resources, author-controlled in-body MDX components and CTAs.

**Layout:** Dark charcoal/gold header and footer; warm-paper content surfaces; disciplined historical-inspired imagery and ornamental rules. Desktop article layout may use contents rail + main reading column + contextual sidebar; collapse to a single comfortable reading column on small screens. Homepage and article pages should feel unified but have distinct editorial emphasis.

**Public anonymity:** The owner's legal/real name must not appear in public article bylines, About copy, author structured data, social metadata, newsletter sender identity, shop copy, or publicly accessible configuration. Use brand identity or an explicitly approved pseudonym. This requirement does not remove legal disclosure obligations for commerce.

**Brand approval note:** Visual references include illustrative article titles, invented sample content, and the placeholder brand; these do not authorize publication or selection of those topics. No new imagery is generated or used without approval.


Target WCAG 2.2 AA fundamentals: keyboard navigation, proper focus states, semantic headings, descriptive links, sufficient contrast, usable forms, responsive layouts, reduced-motion support, and meaningful image alt text. Aim for good Core Web Vitals and minimal client JavaScript; verify with real measurements rather than assuming a framework guarantees performance.

## 11. Rollout plan

**Phase 1 — Editorial foundation (first implementation):** Preserve/build existing Astro app; configure Tailwind and Starwind base; global layout and navigation; Library/Grimoire MDX content schemas, article templates, and paginated article indexes; empty author-controlled topic registry; SEO primitives; basic search; Kit subscription; About, editorial standards, privacy and contact. Publish a small, substantive body of real content. A working static production build is the milestone.

**Phase 2 — Commerce:** Independent Medusa deployment, Store API integration, Printful product/fulfillment verification, Stripe test checkout, product/catalog templates, cart, policies, transactional emails and end-to-end order testing.

**Possible later phase — Digital publications:** Only if the author chooses to introduce them, define downloadable products and delivery requirements at that time. No course platform, Academy, or student system is planned.

## 12. Acceptance criteria for the initial Astro release

1. Existing Astro project is preserved; `npm run build` completes cleanly without introducing Medusa into its dependency tree.
2. Library and Grimoire are distinct typed MDX collections with functioning index and detail routes, **without preset topical directories**. Both indexes have working build-time pagination at 12 articles per page (configurable), with valid previous/next links and no duplicate first-page URL.
3. A source-based research article and a first-person Grimoire article render correctly and link to one another.
4. Global navigation, mobile navigation, search and related-reading links work.
5. Kit signup completes successfully with an appropriate consent and confirmation flow.
6. The site generates canonical metadata and a valid sitemap; no drafts or empty placeholders are indexed.
7. Pages are responsive, readable, keyboard-accessible, and free of critical runtime errors.
8. Shop remains out of navigation until it is operational. No Academy route, course placeholder, or dead purchase link is created.
9. The publishing experience allows adding a new article by creating a validated `.mdx` content file without editing templates; topics are controlled solely through the approved registry, and articles cannot silently invent new topics.
10. Editorial release and deployment do not require Medusa to be running.

## 13. Open decisions (do not treat as settled)

- Domain name and its registration/availability (Mystagogia is the **final brand name**).
- Brand trademark/availability review, domain selection, final logo, licensed/approved imagery, and refined accessible token values. Responsive architecture is approved in §16; exact CSS tuning remains for implementation.
- Which topics, if any, to add to the registry and which deserve browse or hub pages. No topics are approved by this specification.
- First research articles and practical series.
- When the Shop opens; do not create an Academy preview or waitlist.
- First email lead magnet and newsletter cadence.
- Exact Kit integration method beyond a launch form, analytics vendor choices, and any optional CMS.
- Final Medusa/Printful integration details and payment/fulfillment architecture, to be specified separately.

**Explicitly excluded from this specification:** Preselecting occult subjects or populating topic categories without approval; reinstalling Astro; rebuilding the Medusa backend; installing speculative UI components; generating unapproved designs; publishing unreviewed content; creating an Academy, courses, course waitlists, or student features; selecting a domain without approval.


## 14. Workspace design-reference inventory

The following approved concept mockups are retained in the Mystagogia workspace as independent visual references. They are **not** production code or authorization to publish the sample copy/imagery.

- **Homepage — approved:** `Mystagogia_Homepage_Approved_Reference.png` — dark charcoal/gold masthead and hero, parchment Library/Grimoire panels, featured Library cards, Grimoire feature, newsletter area, and the typography/color-token reference sidebar.
- **Library article — initial approved direction:** `Library_Article_Reference.png` — three-column article layout, contents navigation, readable editorial column, related research and contextual sidebar.
- **Grimoire article — initial approved direction:** `Grimoire_Article_Reference.png` — personal-practice editorial layout with optional practice metadata and embedded MDX modules.

**Brand decision:** Mystagogia is the final approved brand name; the domain has not been selected. None of the mockups' sample occult topics, text, dates, religious imagery, or newsletter promises are approved published editorial content.

## 15. Next specification tasks

Search architecture, editorial workflow, and Shop visual direction are now approved in §§20–22. Next is build verification and initial frontend implementation; domain, product catalog, fulfillment details, and topic selection remain explicitly undecided.


## 16. Approved responsive layout specification (v1.1)

**Status:** Approved responsive behavior; exact CSS values and real-device refinements remain implementation details. Use mobile-first Tailwind CSS 4 breakpoints: base <640px, `sm` ≥640px, `md` ≥768px, `lg` ≥1024px, `xl` ≥1280px, `2xl` ≥1536px. Fluid containers, padding, and typography avoid rigid viewport assumptions. Test representative widths 375, 768, 1024, 1280, and 1440px.

| Element | Wide desktop | Tablet / small desktop | Mobile |
|---|---|---|---|
| Global header | Wordmark, full links, search, subscribe | Compact as space requires | Approximately 64px header, search + accessible menu drawer |
| Homepage hero | Spacious illustrated editorial composition | Reduced ornament and type | Single-column heading, intro, stacked actions |
| Library / Grimoire homepage panels | Two equal editorial panels | Two when viable | Stacked, each image/title/description/action together |
| Featured Library grid | Three columns | Two columns | One column, not a horizontal carousel |
| Grimoire previews | Editorial image/text composition | Flexible | Image above text |
| Hub pagination | Numbered links and previous/next | Condensed links as needed | Previous / current status / Next |
| Individual article | Three columns only when genuinely wide enough | One reading column; ToC disclosure; right content below | One-column book-like reading; ToC disclosure; related below |
| Newsletter form | May place input/button inline | Responsive | Stacked, full-sized touch controls |
| Footer | Multiple columns | Two columns as space permits | Stacked |

**Article width is non-negotiable:** Aim for a central reading width of up to 720px, with a desktop contents rail around 190px and contextual sidebar around 240px, with practical gaps (approximately 32px). Do **not** force all three columns at 1024px or even 1280px if the reading column suffers. Enable the full arrangement only when container space allows, likely around ≥1440px; use CSS/grid constraints rather than blindly equating viewport breakpoint with available space.

**Table of contents:** Derive entries automatically from rendered MDX headings. On wide desktop show an optional sticky rail and optionally highlight the current heading; on tablet/mobile place a keyboard-operable collapsible contents panel near article introduction. Disable for short articles when appropriate. Do not hide essential related links when moving sidebars below body text.

**Typography targets, subject to accessibility testing:** homepage display ≈42px mobile / 72px desktop; hub title 40/64; article title 36/56; H2 28/36; H3 23/28; body 17–18/19; UI 14–16. Use fluid `clamp()` for display sizes. Target ~65–75 characters per desktop line. Apply ~20px mobile reading gutters and fluid spacing. Preserve Cormorant Garamond (display), Source Serif 4 (body), Inter (UI).

**Decorative behavior:** Preserve brand motifs but simplify section rules and shrink or remove large background ornamentation on smaller devices. Background art must not push content multiple screens down, cover text, or harm contrast. Images retain aspect ratio. Wide tables scroll **within their own container**, not the whole page. Avoid floating newsletter prompts that obstruct reading.

**Interaction and accessibility:** Responsive behavior primarily through CSS; keyboard-operable drawer and disclosure; adequate touch targets and focus states; reduced-motion support; semantic links for pagination; lazy-load below-the-fold media; reserve image space to prevent layout shifts. No duplicate mobile site and no default horizontal-scroll card carousels.

## 17. Approved images and media handling (v1.1)

**Status:** Approved media strategy; vendor/external media service is **not** selected. Do not generate or publish imagery without explicit approval. Differentiate historical reproductions from modern interpretations and AI-generated art wherever presented as editorial evidence.

**Media classes:** (1) editorial images—heroes, cards, illustrative art; (2) reference images—manuscripts, sigils, diagrams, artifacts, needing full detail and provenance; (3) decorative images—flourishes, textures, motifs. Cropping can be appropriate for decorative/editorial crops but must not remove essential markings from reference figures.

**Storage:** Begin with a centrally organized, version-controlled media library in the Astro repository. Put optimized-source images under `src/assets/` (Astro image pipeline) and assets requiring unchanged public delivery under `public/`. Keep high-resolution masters separate from derived optimized website variants. Use a typed media metadata registry for reusable historical figures so a single source/rights record can serve several articles. Avoid external image-hosting dependencies until scale justifies them.

**Delivery:** Use Astro `<Image />` or `<Picture />` with responsive sizes and formats such as WebP plus appropriate fallbacks. Responsive card thumbnails have consistent display aspect ratios; article inline and reference images preserve natural proportions by default. Use SVG for suitable clean vector motifs/diagrams, lossless formats for fine-line details as needed, and avoid destructive compression that obscures characters. Supply width/height or aspect ratio, descriptive alternate text, and appropriate loading priorities; eager/prioritized top-of-page hero where justified, lazy below-the-fold images.

**Image placements/components:** `ArticleImage` (ordinary captioned editorial visual); `ReferenceFigure` (caption, provenance, larger inspection mode); `FullWidthImage` (selective editorial breakout); `ImageGallery` (related images); `CompareImages` (responsive comparisons). A shared lower-level image renderer should handle optimization, metadata, alt text, and accessibility. Historical figures include available creator/period, archive/museum, source link, license/rights, and descriptive caption; no fabricated provenance.

**Image enlargement:** Reference images should support an accessible lightbox with zoom where useful, intact composition, appropriate keyboard close/focus management, and mobile-friendly interaction; no automatic lightbox for purely decorative art. Only implement gesture/zoom dependencies as needed.

**Editorial rules:** Image metadata and permissions are reusable; every article may choose its own featured/card image separately from embedded figures; **no article requires an image to publish**. Art generation requires express user approval of the concept before any new generated artwork. Verify rights and attribution before publication.

## 18. Approved component architecture and build order (v1.1)

**Architecture:** Astro components by default; use semantic HTML/CSS for presentation, and selective Starwind controls for accessible interaction. Install only the Starwind components actually used. Svelte islands are optional exceptions, not the base architecture. Prefer reuse of behavior and meaningful design patterns over microscopic markup abstraction.

**Foundation:** `Container` (wide ≈1280px, reading ≈720px, full-bleed inner constrained), `SectionHeading` (eyebrow/title/description and optional decoration), `Ornament`; selected `Button`, `Input`, `Separator`, `Dialog`/drawer, `Collapsible`, and optional `Badge` from Starwind when needed.

**Shared site components:** `SiteHeader`, `DesktopNavigation`, `MobileNavigation`, `SiteFooter`, `SearchTrigger`, `Breadcrumbs`; `NewsletterForm` encapsulates Kit validation/submission/states while `NewsletterSection` manages placement and appearance. Search-trigger UI is separate from indexing/search-results infrastructure.

**Editorial components:** `ArticleCard` (standard, featured, editorial, compact variants), `ArticleFeature`, `ArticleListItem`, `ArticleHeader` (Library/Grimoire presentation variants), `ArticleMetadata`, `ArticleHero`, `ArticleTableOfContents`, `RelatedArticles`, `ArticlePagination`, `ArticleBreadcrumbs`, `ArticleReferences`. Share data and templates across Library/Grimoire rather than duplicate components. Cards derive titles/excerpts/URLs/media from validated content collection records, not copied page text.

**MDX author-facing components:** `ArticleImage`, `ReferenceFigure`, `FullWidthImage`, `ImageGallery`, `CompareImages`, `Callout`, `SourceNote`, `QuoteBlock`, `RelatedReading`, `ContentCTA`. Components are optional; content editors decide where to use them. Custom promotional modules never become a required part of articles.

**Layouts:** Prefer minimal `BaseLayout`, `HubLayout`, and `ArticleLayout` plus the home page assembled directly from shared sections. Add additional layout files only when there is meaningful reuse. Component files should be organized by `foundation/`, `site/`, `editorial/`, `mdx/`, `newsletter/`, and installed `starwind/`. Reserve `commerce/` for the future Shop phase, not as speculative implementation.

**Staged implementation:**
1. Configure approved Tailwind CSS 4 semantic tokens/fonts and install only needed Starwind primitives; create foundational layout, Container, SectionHeading, and Ornament.
2. Build shared header, accessible mobile navigation, footer, and breadcrumbs; verify responsiveness.
3. Wire typed Library/Grimoire MDX content, editorial cards, hub pagination, article layouts and responsive heading-derived ToC. Reach first working Library hub and article.
4. Add standardized image renderer, media metadata, reference figures/lightbox and optional MDX editorial components; verify with representative source-led and practice-led articles.
5. Assemble approved homepage from tested shared components and curated featured content.
6. Integrate Kit, search, SEO, analytics/consent and accessibility/performance verification. Shop/Medusa/Printful integrations come in the separately approved commerce phase.

**Initial scope discipline:** Start with roughly fifteen components that are necessary to deliver the foundational navigation, Library hub, article layouts, basic media, and newsletter pathways. Do not construct every catalogued component on day one. Each shared component must work on mobile before it is considered complete. Avoid dependencies that prevent static editorial builds from operating independently of commerce.

## 19. Remaining planning decisions after v1.1

The responsive layout, media strategy, component architecture, unified search plan, publishing workflow, and storefront visual direction **are approved**. Domain, individual topics, final logo, newsletter lead magnet, exact product selection, and live Medusa/Printful integration remain deferred or separately scoped. Mystagogia is the final brand name.


## 20. Approved search architecture (v1.2)

**Unified entry point:** The global header search opens a single accessible search UI covering **All, Library, Grimoire, and Shop**. On the All tab, group results by source rather than intermixing articles and products without context. Results must make clear whether an item is an article, practice entry, or product. A dedicated `/search/` results route may support sharable query URLs and browser history.

- **Editorial search:** Use Pagefind over production-generated static Astro pages. Index published Library and Grimoire articles, including titles, descriptions, headings and body text. Exclude drafts, unlisted pages, legal boilerplate and any sensitive routes. Weight titles/headings sensibly, show useful excerpts, and offer Library/Grimoire scope filtering. Rebuild the Pagefind index as part of the production build/deploy pipeline.
- **Product search:** Use Medusa Store API to search the live catalog so prices, availability, variants and product state are not presented as static editorial facts. Support text matching on product names and descriptions, and relevant Shop filters (product family, approved subject/tags, price, availability, size and color where available) plus sorting. Validate the actual Medusa version/API and permissions before coding filters; do not assume capabilities unsupported by the running backend.
- **Shop browsing:** Provide a search field and product filtering directly within `/shop/`, without forcing visitors into site-wide search.
- **Progressive rollout:** Before the Shop launches, show only functioning Library and Grimoire scopes; do not display an empty Shop tab. A temporary unavailable commerce backend must not break editorial search.
- **UX:** Keyboard-accessible search activation, clear labels, focus management, helpful empty/error states, responsive result layout, and no fabricated result counts. Query strings must not be exposed as personally identifying analytics data.

## 21. Approved editorial workflow (v1.2)

**Lifecycle:** Draft → Review → Published → Updated. The owner explicitly approves all publication. Draft MDX must never generate public article pages, sitemap entries, or Pagefind results. There is no requirement for a graphical CMS, editorial team roles, scheduled publication, or automated publishing at launch. Git records revisions.

- **Content schema:** Separate typed `library` and `grimoire` Astro Content Collections; all editorial articles use `.mdx`. Require stable slug or ID, title, description and status; require a real publication date only on published entries. Optional featured image, approved topic IDs, update date, references, related article IDs, and contextual CTA components. Never infer placeholder topics from sample mockups.
- **Library standard:** Source-backed history and traditions. Distinguish primary texts, scholarship, later interpretations and contemporary claims; cite claims responsibly, including specific passages and image provenance when applicable.
- **Grimoire standard:** Original approaches, practical methods, experiments and reflections, with first-person authorship when useful. No forced ritual format; make observations and interpretations intelligible without pretending personal adaptations are ancient attestations.
- **Topic registry:** Version-controlled, owner-approved and initially without prepopulated subject lists. Article tags cannot silently create public category pages.
- **Source registry:** Lightweight reusable bibliographic records for books, manuscripts, articles, museum collections and source links, with passage/page locators as applicable; support inline citations, footnotes and bibliographies.
- **Featured content:** Explicit ordered editorial configuration for homepage Library selections, Grimoire selections and any other featured areas. Validate that referenced content exists and is published; fail safely if selections are unavailable. Newest content is not automatically featured simply because it is new. Related article suggestions must remain editorially controllable.
- **Publication checks:** Validate frontmatter, MDX parsing, image references/rights fields, internal links and accessible output before deploy. Meaningful article changes update `updatedAt`; trivial copy fixes need not. Publication and revisions happen through reviewed Git changes.
- **Anonymity:** Do not publish the owner's legal name in bylines, metadata, JSON-LD, media credit conventions, Kit sender display names, About copy, or brand assets. Legal requirements of vendors are handled separately and privately.

## 22. Approved Shop visual direction and phased merchandising (v1.2)

The latest approved responsive Shop concept extends the Mystagogia parchment/charcoal/antique-gold editorial aesthetic to **apparel, other physical merchandise, and potential future digital publications**. Mockup text, named products, sample prices, reviews, and visual examples are illustrative, not a committed catalog or claims. Maintain a prominent apparel presence rather than designing the Shop as a books-only store.

**Initial apparel candidates:** Bella+Canvas 3001 black T-shirt and Gildan 18500 black hoodie through Printful; DTFlex was preferred in earlier planning for vivid artwork on dark garments, subject to real Printful compatibility and production requirements. Do not assume the store must launch with every mockup product. No obligation to buy multiple samples is imposed.

When the commerce phase is authorized, implement a responsive product grid and product-detail UX: garment/product imagery, zoom/gallery, sizes and colors, variant-specific availability, size guidance, transparent pricing, shipping/return disclosures, cart and checkout states, and suitable accessible filters. Medusa runs in a **separate repository/backend**; the frontend consumes permitted APIs and never exposes admin or fulfillment secrets. Printful synchronization, fulfillment and Stripe payment integration must be verified end-to-end before selling. Digital guide delivery is a separately specified future capability.

**Design-reference status:** The expanded apparel-inclusive responsive Shop mockup is approved as **visual direction**, not finalized production product artwork. Keep it with the other design-reference assets when organizing the workspace.

## 23. Required design-token and Tailwind standards (v1.2)

**Core rule: centralized, semantic tokens are the single source of truth for recurring design choices.** The codebase must not accumulate one-off Tailwind arbitrary colors, sizes and duplicated multi-class styles that bypass the Mystagogia system.

1. **Token definitions:** Use Tailwind CSS 4 `@theme` for reusable utilities and semantic CSS custom properties for functional roles. Define approved charcoal, parchment, antique gold, supporting accents, typographic families and scales, spacing, radii, borders, shadows and layout widths in one documented styling layer.
2. **Semantic names:** Prefer intent names such as `--color-surface`, `--color-text-primary`, `--color-border-subtle`, `--color-accent-gold`, `--font-display`, `--font-reading`, and `--font-interface`. Map Starwind variables to the same system; do not maintain an independent default-blue UI palette.
3. **No scattered arbitrary values:** Repeated `bg-[#...]`, `text-[#...]`, `text-[19px]`, `w-[...]`, inline `style` colors, or copied arbitrary shadow values in page components violate the baseline unless justified as unique illustration/layout cases. Prefer tokens, standard Tailwind utilities and reusable variants.
4. **Reusable visual patterns:** Buttons, article cards, navigation, section headings, link treatments, dividers, figures, and form controls must use shared components/variants or documented component-level CSS. Do not build a new abstraction for every ordinary `flex` or `grid` placement.
5. **Legitimate Tailwind use:** Standard utility classes for layout, composition and responsive behavior remain encouraged (`grid`, `flex`, `gap-*`, breakpoints). This is not a prohibition on Tailwind; it is a requirement to avoid needless hardcoding and long duplicated utility strings.
6. **Typography:** Cormorant Garamond for display, Source Serif 4 for article reading, Inter for UI. Centralize fluid heading scales and body line-height/measure; maintain the reading-width standard and accessible contrast.
7. **Quality gate:** During reviews, flag duplicated arbitrary values, visual inconsistencies, accidental hardcoded colors and unstyled Starwind defaults. Review representative desktop/tablet/mobile renderings before calling a component complete.

## 24. Implementation baseline and remaining decisions (v1.2)

**Ready to begin frontend foundation:** Use the existing `blackarcanum` GitHub repository (default branch `master`) as the Astro frontend starter. Installed libraries do not imply the site has been built. Preserve the separate Medusa backend approach. First milestone: theme/token foundation, fonts, BaseLayout, responsive header/footer, and selected Starwind controls; then typed MDX editorial system, hubs and article views, approved homepage, Pagefind/Kit, and later commerce. Do not scaffold another Astro application.

**Still undecided (not blockers for foundation):** Domain, final logo/art licensing, initial approved article topics, lead magnet/newsletter cadence, live product catalog, actual Medusa-Printful fulfillment wiring, payment policies and storefront launch date. Search and editorial workflows are approved conceptually; API shape and deployment details still require verification against the installed packages and live services.

**Acceptance baseline:** Responsive and accessible layouts match the approved concept references; all reusable styles use approved tokens; all public content requires owner approval; Article/Shop search scopes work only when their backing sources are available; there are no speculative course routes, preselected topics, invented product offerings, or public identifying details for the owner.