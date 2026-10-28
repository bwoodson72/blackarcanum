# Multi-image editorial figures — Prompt 24

Both components are available without imports in Library and Grimoire MDX. They are optional and never insert an image into existing content.

```mdx
<ImageGallery
  label="Three views of an object"
  items={[
    { id: "approved-editorial-id", caption: "Context for this modern illustration." },
    { id: "approved-reference-id", lightbox: true },
    { id: "approved-second-reference-id" },
  ]}
/>

<CompareImages
  title="Two iconographic examples"
  left={{ id: "approved-editorial-id", label: "Modern depiction", caption: "Artist's interpretation." }}
  right={{ id: "approved-reference-id", label: "Historical object", lightbox: true }}
/>
```

These IDs are syntax examples, **not** currently registered images. An ID must exist in `src/data/media.ts`, have cleared reuse rights, and be listed in the article's `mediaIds` frontmatter. No new real image or historical reproduction is supplied by this prompt.

- **ImageGallery:** Two to twelve ordered, unique IDs. The visible layout is one column on phones, two above 640px, three above 960px (two-item galleries remain two columns); its ordered list preserves source and screen-reader order.
- **CompareImages:** Exactly two distinct IDs with required visible `label` values, and optional comparison title. It stacks on phones and displays two uncropped columns above 760px. Reading order is always left, then right.
- Both use the same `MediaFigure` and `MediaImage` rendering pipeline as individual figures. All reference figures show the **verified registry** caption, source, repository and rights as available; reference caption overrides are prohibited. Editorial artwork alone supports contextual captions.
- Optional `lightbox: true` applies only to a reference-role image, reusing the existing native, accessible, progressively enhanced reference lightbox. There are no carousels, custom image sliders, client-side dependencies or image conversion forks.
- A gallery or comparison is rejected on invalid media IDs, decorative images, missing required labels, duplicate IDs in one group, or unapproved image roles. The existing media publication gate prevents unlicensed work from being rendered.

The existing **temporary** MDX media fixture inserts a three-image gallery, two-image gallery and comparison in each collection, retaining the exact Prompt 20–23 checks. Its existing browser QA verifies 375px, 1024px and 1440px widths, DOM order, responsive columns, image captions, uncropped ratios and no page overflow without starting another browser session. No fixtures or artwork are committed to public content.

**Stopped after Prompt 24.**
