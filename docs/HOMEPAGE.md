# Homepage composition — Prompt 25

The homepage follows the approved reference at docs/design-references/homepage-approved.webp and the responsive layout reference. Its purpose is editorial navigation, not automatically promoting the most recent articles.

## Composition and editorial gates

The existing dark masthead continues into a charcoal/gold hero, with a prominent Mystagogia title and the approved Library/Grimoire calls to action. The mockup's unidentified illustrative imagery is **not** a production asset: the hero, Library books, Grimoire instrument and Grimoire spotlight use original CSS geometry instead.

Below the hero, equally weighted gateway cards explain the distinct roles of the Library and Grimoire. A parchment Featured Research section shows only the ordered IDs listed in src/data/features.ts. The Grimoire spotlight uses only the primaryGrimoire choice in that same curated registry. checkEditorialBuild validates those references; public article lookups and presentation helpers reject unpublished content. When there is no curated selection, the homepage still renders a finished editorial composition and links to the real archives, without inventing a feature.

The newsletter area is a clearly labeled **in-preparation** slot, not a fake Kit form, placeholder API or dead signup link. Shop remains absent until real merchandise and commerce are live. The homepage stays noindex until a real, non-preview article is explicitly curated.

## Responsive acceptance

The existing article fixture browser runner checks the homepage at 375, 768, 1024, and 1440px, alongside its regular article checks. It verifies single-H1 hierarchy, one/two-column gateway behavior, no horizontal overflow, working article-hub links, no implied feature or signup and touch target size. Four full-page screenshots are uploaded to the short-lived homepage-responsive-qa GitHub Actions artifact in the Deep Regression articles suite, for comparison against the approved mockup and responsive reference. The regular fast sample-article suite also asserts the real homepage HTML and noindex rules in its single build.

The primary visual limitation is deliberate: the approved mockup's painted figures, pictorial cards, parchment texture and elaborate sun identity are not cleared real site media. These have been replaced by accessible CSS elements, rather than copying mockup pixels or generating new art without approval. A later asset-approval step may improve illustrative fidelity.

**Stopped after Prompt 25.**

## Approved hero CTA frame

The owner approved the antique-gold engraved corner treatment from the generated Mystagogia artwork. The two homepage hero CTAs use genuine links with a thin outer gold frame, inset border, small ornamental corners, and book/botanical SVG line icons. Titles and arrows remain accessible HTML, not baked into an image. They stack full-width on narrow screens, preserve visible keyboard focus, and maintain dark/gold contrast. All other homepage artwork is unchanged by this focused styling update.

## Approved artwork implementation (October 28, 2026)

Replaced the four geometric illustrations with a **real generated engraving atlas** at `public/images/homepage/mystagogia-editorial-atlas.avif` (1400 × 739, 28.5 KB). The top 1400 × 560 region is the panoramic, artwork-only torch-bearing goddess hero; the bottom row contains three image regions: Library still life, Grimoire ritual desk and Grimoire spotlight.

Each region is cropped at display time through a semantic-free inline SVG `viewBox` sharing one compressed AVIF asset. The hero image is absolutely positioned behind the live heading and two live ornate gold-frame buttons and fills the section edge-to-edge; the gateways and spotlight replace the former fake CSS drawings. CSS only adjusts gradients for text contrast, especially on phones. All illustration regions are decorative and hidden from screen readers. The existing curated-feature gate, responsive layout, accessible links and honest newsletter state are untouched. The artwork is original AI-generated editorial decoration, **not an authenticated historical source**.

The former note that mockup-equivalent imagery was still absent is superseded by this implementation. Mobile and desktop visual acceptance should still be confirmed on live browser screens.
