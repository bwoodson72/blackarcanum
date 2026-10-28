# Mystagogia — Generated Table of Contents (Prompt 16)

## How article navigation works

Library and Grimoire article routes use `const { Content, headings } = await render(entry)` from Astro's typed MDX content collections. The same renderer generates both visible heading IDs and their corresponding `{ depth, slug, text }` metadata. `ArticleLayout.astro` passes that metadata through `getArticleTableOfContents()` in `src/lib/article-toc.ts`; no manual list, parallel slugifier, topic registry, or frontmatter ToC is introduced.

The TOC includes **h2 and h3 only**, preserves original document order and renderer-provided IDs, and indents h3 items. Identical headings remain distinct because Astro's default GitHub-style slug generation produces stable suffixes (for example `#origins` and `#origins-1`). A repeated renderer ID causes a clear build error instead of two broken anchors. Empty headings and headings below/above the included levels do not appear in navigation.

Articles with **fewer than three navigable h2/h3 headings** omit the TOC entirely. This prevents decorative, unhelpful navigation on short articles and avoids empty landmarks.

## Responsive layout and access

- At **375px, 768px, and 1024px**, the nav appears in a native keyboard-operated HTML `<details>` / `<summary>` disclosure **immediately following the article header and before the article body**. It starts collapsed; browsers handle Enter/Space, focus and expanded state without any client-side framework or custom JavaScript.
- At **1440px and wider**, the disclosure is hidden and a sticky `<nav aria-label="Article contents">` occupies the left **190px** rail of the existing article grid. The central **720px** reading measure is not squeezed; the 240px contextual area remains optional. On smaller widths the unused desktop rail is hidden completely.
- Both alternatives use semantic list/link markup and the same generated IDs. Only one is visible/accessibly exposed at a time using responsive CSS. Links use native same-document anchors and visible focus outlines; no active-section tracker, scroll event handlers, animated scroller or framework island.
- Headings in article reading content have `scroll-margin-top: 6rem` to keep the targeted section visible below the site masthead. Wide rail navigation caps its height and can scroll internally for long lists. All styling uses existing Mystagogia design tokens.

These changes affect only **published article detail pages**. The Library/Grimoire hubs and cards remain unchanged; the live MDX collections are still empty.

## Acceptance and tests

The existing `npm run qa:content` now runs `npm run test:toc` (pure heading filter and duplicate-ID assertions) before its normal Astro build. The `Editorial Quality` GitHub Actions workflow on `master` continues to run the existing archive, schema, article routes, responsive and typecheck tests, then adds:

- `npm run test:toc-fixtures`: isolated real Astro build containing **long and short published MDX articles in each collection** as well as draft/review exclusions. The long fixtures include h2/h3 nesting, repeated headings, and a deliberately excluded h4. Tests inspect actual generated `<h2>/<h3>` IDs and both sets of TOC anchors; short articles render **no** contents. Source fixture directories are restored in `finally` and no test content is committed.
- `npm run test:toc-browser`: actual Chrome checks at **375/768/1024/1440px** in each collection for central reading width, one visible responsive nav, keyboard Enter expansion, click-to-heading, anchor offset and no horizontal overflow. Short articles remain readable without an empty TOC.
- `npm run typecheck`, `npm audit --audit-level=high` and the baseline build remain mandatory.

All verification happens with ephemeral CI fixture data. No fictional esoteric accounts, generated images, first-person practice reports, new public topics, citations or bibliography features are added.

**Stopped after Prompt 16.**
