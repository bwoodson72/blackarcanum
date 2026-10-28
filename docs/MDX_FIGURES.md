# Editorial MDX figures — Prompt 21

These components work in **both** Library and Grimoire MDX articles. They are automatically mapped in the shared article routes, so an MDX author does **not** import them or write a `components` export.

Use approved image IDs from `src/data/media.ts`, and list each referenced ID in the article's `mediaIds` frontmatter. The registry is responsible for image alt text, clearance and provenance. A featured hero remains independently controlled by `featuredMediaId`.

## Author-facing components

```mdx
---
title: Example article
description: Illustration of MDX component syntax only
slug: example-article
status: draft
mediaIds:
  - approved-editorial-id
  - approved-reference-id
---

An ordinary editorial figure, with optional article-specific caption:

<ArticleImage
  id="approved-editorial-id"
  caption="An editorial explanation of this modern illustration."
/>

A reference figure with its **registry caption**, source, provenance and reuse terms:

<ReferenceFigure id="approved-reference-id" />

Optional native enlarge/inspect behavior (requires no additional imports):

<ReferenceFigure id="approved-reference-id" lightbox />

A deliberate layout breakout for an editorial image:

<FullWidthImage id="approved-editorial-id" caption="A wider contextual visual." />
```

The identifiers above are **illustrative**, not actual registered images. Only `tyche-fortune-city-illustration` currently exists in the approved registry, and it is **editorial artwork**, not an ancient reference image. The project has not sourced or added an ancient sculpture/manuscript photograph yet. No image is required for any article.

- **ArticleImage:** Uses approved editorial art, full composition, lazy-loaded through `MediaImage`. Uses the registry's caption unless an editor supplies an article-context caption. The registry credit remains visible.
- **ReferenceFigure:** Requires an approved `reference`-role ID, preserves its natural aspect ratio (no cropping), **always** displays its verified registry caption, and adds available creator/date or period/repository, direct source-catalog link, credit, license statement, and a link to documentary reuse terms. It explicitly marks historical reproductions versus modern reference illustrations. Unknown details are omitted rather than fabricated. Caption overrides are not offered.
- **FullWidthImage:** Uses editorial-role images only. Like ArticleImage, it preserves the image uncropped and may have a contextual caption. At **1024–1439px**, it can expand from the 720px reading measure to at most 960px, while respecting viewport gutters. On phones/tablets and **1440px+ three-column articles**, it stays within the reading column to avoid overlapping the sticky table of contents or right context rail. It remains responsive and lazy loaded; only the top-of-article hero gets high fetch priority.

All three emit semantic `figure` and `figcaption` elements. Reference source and rights links are normal focusable anchors with visible focus indicators. Static figures require no JavaScript. Prompt 22 adds opt-in native dialog behavior only for `ReferenceFigure lightbox`: Enter/Space opens, close gains focus, Tab stays in the modal, Escape/close restores focus, and the original uncropped local asset can be opened in a new tab. Without JavaScript, the original figure, its caption/credits/source/rights links and the direct original-image link remain fully readable. No gallery, zoom, historical object or new artwork is added.

## Implementation and validation

`src/components/mdx/MediaFigure.astro` centralizes verified metadata and responsive figure styling. `ArticleImage.astro`, `ReferenceFigure.astro` and `FullWidthImage.astro` are the small author-facing wrappers. They use the approved registry and existing Astro renderer; the `MediaImage`/`MediaPicture` components accept optional responsive `sizes` overrides for the wider figure.

Both `src/pages/library/[slug].astro` and `src/pages/grimoire/[slug].astro` register exactly the same MDX components via `<Content components={...} />`.

The already-existing `scripts/test-media-render-fixtures.mjs` now creates **temporary** Library and Grimoire MDX articles using one blank editorial PNG and two reference-role technical images. It verifies captions, registry attribution, source/reuse links, and each of the three MDX image patterns during the same Astro build it already used. `scripts/test-media-render-browser.mjs` reuses its single headless-Chrome session at 375px, 1024px and 1440px to inspect figure widths, natural ratios, link targets, image crop and overflow in both routes. All synthetic assets and articles are removed after the fixture build.

To run immediately after a substantive change to `src/components/mdx/` or `src/components/media/`, the Deep Regression workflow automatically runs the **media** suite. Routine text/content-only changes still trigger just the 1-build fast workflow. Deep Regression can also be dispatched manually for a selected suite or run weekly for all suites.

**Stopped after Prompt 21.**

## Prompt 22 validation

The existing synthetic MDX fixture opts one reference image into the lightbox and leaves another static in both collections. The media browser regression exercises 375px and 1440px, keyboard open/close/Tab/Escape and focus restoration, native modal naming, unclipped image display, original-file link and a disabled-JavaScript fallback. Real historical reference imagery still requires separate source/rights review before publication.

**Stopped after Prompt 22.**
