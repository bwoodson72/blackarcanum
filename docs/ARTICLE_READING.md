# Mystagogia — Published Article Routes and Reading Shell (Prompt 15)

## Routes, publication and content

This implementation adds the two public **static MDX detail route templates**:
- `/library/[slug]/` — published, source-led Library entries only.
- `/grimoire/[slug]/` — published Grimoire practice writing only.

Both `getStaticPaths()` implementations use their respective **published-only collection accessors** and shared chronological filter. The route's own rendering gate then validates that it is still an explicitly published entry with a valid date before calling Astro's `render(entry)`. The resulting `<Content />` is rendered in the central reading column; MDX paragraphs, headings, lists, quotes and inline markup are real article content, not cards or hand-written sample copy. A slug duplicated across collections resolves to its **own** section and source body. Drafts, review entries, invalid dates and non-existent slugs never generate article pages.

The production collections remain empty until the editor approves actual published articles. **No sample publications were added.**

## Shared responsive layout

- `src/layouts/ArticleLayout.astro` combines `BaseLayout` with a source-derived breadcrumb trail, a semantic `<article>` and the actual MDX body. It also links readers back to the corresponding collection.
- `src/components/editorial/ArticleHeader.astro` displays the **real title**, optional lead (frontmatter description), date and updated date via `ArticleMetadata`, and optional author-provided hero. No author names, bylines, reading-time estimates or invented images are generated. The Library and Grimoire use distinct eyebrow/accent treatments.
- The article body uses the licensed self-hosted **Source Serif 4**, while titles use Cormorant Garamond and metadata/controls use Inter. All colors and spacing follow the established Mystagogia tokens.
- The central reading column has a **720px maximum** and responsive gutters, with 17–19px body text. Text, lists, quotation blocks, inline media, long code blocks and tables remain within the viewport. The optional hero gets an explicit **3:2** aspect fallback with `object-fit: contain` so reference art is not arbitrarily cropped. If no hero is provided, **no empty image space** appears.
- **Prompt 16 addition:** `ArticleLayout` now consumes generated MDX heading metadata and automatically builds the article contents navigation when at least three meaningful h2/h3 headings exist. It does not use a manual `toc` slot. The native mobile/tablet disclosure follows the article header, while the sticky desktop rail appears at **≥1440px**. Both use the same renderer IDs. Short articles omit both TOCs. The optional `context` slot remains reserved for future related content.
- Only at **≥1440px** does the shell use the wide three-column **190px / 720px / 240px** arrangement with practical gaps, keeping the central reading column full-width. The optional registry-backed `mediaIds` metadata was added in Prompt 19 (see [MEDIA_REGISTRY.md](MEDIA_REGISTRY.md)); it does not render images until Prompt 20. References and citations are implemented in Prompt 17 (see [ARTICLE_REFERENCES.md](ARTICLE_REFERENCES.md)); curated related reading was added in Prompt 18 (see [ARTICLE_RELATED_READING.md](ARTICLE_RELATED_READING.md)). See [ARTICLE_TOC.md](ARTICLE_TOC.md).

## Metadata and deployment boundary

`BaseLayout` emits unique page title, description, social title and description, and truthful breadcrumb navigation. It deliberately omits canonical/OG absolute URLs until the owner approves a permanent site URL (there is no configured `Astro.site`). When that domain is configured, its existing canonical logic can apply to distinct article paths. No separate article `noindex` is set for explicitly published entries.

The owner has explicitly asked to **keep automatic Vercel deployments from `master` enabled**. Each finished prompt is committed atomically; the existing integration may deploy it automatically. Do not trigger a duplicate manual deployment.

## Acceptance checks

- `npm run qa:content` and `npm run typecheck` validate the unchanged schema, public editorial gates, build and the new Astro pages.
- `npm run test:article-routes` runs a **temporary CI fixture** with two published examples per collection, draft/review exclusions, a same-slug case in both sections, optional hero/updated date and actual MDX heading/body markup. It runs an Astro static build, inspects the generated HTML for all required paths, metadata, links and body text, and restores the original empty collections in a `finally` block. The one-pixel test-only image is a data URL: no artwork is generated or stored.
- `npm run test:article-responsive` starts a local test server and headless Chrome against that temporary build. It validates the two article variants at **375, 768, 1024 and 1440px**, ensuring no horizontal overflow, the central 720px maximum, readable body text, three-column layout only at 1440, correct heading hierarchy, links and hero fallback behavior.
- The persistent Editorial Quality GitHub Actions workflow runs the real project checks, then these isolated tests on `master`. No fixture files or article content are committed.

**Stopped after Prompt 15.**
