# Mystagogia — Prompt 20: Astro Responsive Media Renderer

**Scope:** Shared image rendering only. The approved media registry is still empty. No new historical depictions, deity artwork, public articles, images, MDX figure components, galleries or lightboxes were added.

## Component boundary

Use `src/components/media/MediaImage.astro` for approved, public editorial imagery. It accepts `id` from the typed `src/data/media.ts` registry, a required `variant`, and optional `priority` and `class`. This component:

1. Looks up the one rights-reviewed media ID (`getMediaRecord`).
2. **Refuses to render** an image when rights are pending/restricted or the required reuse/source evidence is absent.
3. Confirms that the role matches the display variant, so a historical/reference source cannot be silently cropped as a thumbnail.
4. Resolves the exact local image through Vite's eager `import.meta.glob`; unknown IDs, files, paths and metadata errors fail the build.
5. Delegates actual responsive HTML to `MediaPicture.astro`, using Astro's built-in `<Image />` and `<Picture />` components.

`MediaPicture` is the **internal, low-level** renderer for resolved local `ImageMetadata` and verified alt text. Editorial MDX and page authors should not bypass `MediaImage` and its rights validation by importing `MediaPicture` directly. No remote image URL is accepted by `MediaImage`; no external image service or new dependencies were added.

Example template syntax (an approved registry ID must exist before using this):

```astro
---
import MediaImage from "../components/media/MediaImage.astro";
---
<MediaImage id="approved-hero-id" variant="hero" priority />
<MediaImage id="approved-thumbnail-id" variant="card" />
<MediaImage id="approved-museum-record-id" variant="reference" />
<MediaImage id="approved-ornament-id" variant="decorative" />
```

`mediaIds` on an article remains metadata-only; **it does not automatically create image markup**. A future editor explicitly places images using the approved components. Existing article `hero` fields are not migrated in this prompt, and the three Greek previews remain text-only. Prompt 21 will implement MDX figure, caption and full-width composition components.

## Responsive behavior and variants

| Variant | Registry role | Raster output | Display / crop | Default network priority |
| --- | --- | --- | --- | --- |
| `card` | `editorial` | `<picture>`: AVIF/WebP `<source>`, fallback original format; responsive widths/sizes | Cropped to 3:2 thumbnail **only here** | Lazy, async |
| `hero` | `editorial` | `<picture>`: AVIF/WebP, fallback; responsive widths/sizes | Full image, `object-fit: contain` | Eager, high priority by default (can disable) |
| `reference` | `reference` | `<img>` via Astro Image, source format retained, width `srcset` and `sizes` | **Never cropped**. Natural aspect ratio/height, large widths for details | Lazy, async |
| `decorative` | `decorative` | AVIF/WebP picture for raster; native SVG for vectors | Contained | Lazy, async |

All variants reserve intrinsic dimensions, respect their parent column width, and avoid source upscaling. SVG vectors are rendered through Astro Image with their original intrinsic width/height **without artificial raster transformations or fake `srcset`**. Responsive raster widths are chosen per variant and capped to the actual source size; `sizes` reflects the 720px article measure or responsive card width. The `srcset` and browser format negotiation are handled by Astro—not handwritten HTML.

Semantic alt text comes exclusively from the reviewed registry. For decorative records it must be `alt=""` and the wrapper is `aria-hidden="true"`; for all other images meaningful alt text is required. High network priority is restricted to an actual hero; card/reference/decorative requests for priority fail. Images have width/height and CSS constraints to prevent horizontal overflow and layout shifts.

**Source responsibility:** Source metadata must be true; this renderer is not a citation/caption replacement. Historical image attribution, captions and inspection features belong to Prompts 21/22. The registry's provenance/rights clearance rules from Prompt 19 remain in force.

## Tests and release boundary

`npm run qa:content` includes `npm run test:media-display` in the permanent prebuild suite. It validates every display role, crop restrictions, width candidates, aspect ratios, small images, priority policy and invalid inputs.

At the end of the `master` Editorial Quality workflow:

- `npm run test:media-render-fixtures` temporarily creates two **blank synthetic PNGs** (flat black pixels only), two minimal plain SVG rectangles, and a nonindexable local QA page. These are **technical pixels, not illustrative artwork**. The temporary fixture IDs use documented rights/source test metadata under `example.org` and cannot be mistaken for real artifacts. It runs an actual Astro production build and inspects all five rendered variants for generated `srcset`/`sizes`, dimension attributes, alt, AVIF/WebP fallback and hero loading priority. It restores the original registry and removes every synthetic image and route in `finally`.
- `npm run test:media-render-browser` serves **only the test build output**, checks loaded local images, natural aspect ratios, full reference detail, card crop, alt, hero priority, and no horizontal overflow at **375px and 1440px**. The test build is not deployed.

No approved images were selected, no permanent new media assets exist, and no new image is placed on any public page.

**Stopped after Prompt 20.**
