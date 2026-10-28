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
