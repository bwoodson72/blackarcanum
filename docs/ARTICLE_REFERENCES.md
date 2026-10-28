# Mystagogia — Prompt 17: Citations, Notes and Bibliography

This implementation adds **source-backed editorial citations** to both Library and Grimoire MDX articles. The version-controlled `src/data/sources.ts` registry remains the single source of truth for bibliographic metadata. **The approved production source registry is still empty.** Only isolated CI tests use temporary fictitious records, and restore the original file afterward.

## Data model and authoring

An article's frontmatter stores **one citation item per inline occurrence**. When the same source is cited at different locations, add two citation items, each with its own locator. Only add fields supported by real sources. An article may also list uncited bibliography entries through `sourceIds`. Both `citations` and `sourceIds` are optional.

This illustrative syntax is NOT a real article; `reviewed-source-id` must refer to an approved source before publication:

```mdx
---
slug: example
title: Example
description: Illustration only
status: draft
citations:
  - sourceId: reviewed-source-id
    locator:
      page: "12"
    note: Exact context supported by this source.
  - sourceId: reviewed-source-id
    locator:
      passage: "II.4"
sourceIds:
  - reviewed-source-id
---

import SourceCitation from "../../components/editorial/SourceCitation.astro";

A source-backed statement <SourceCitation index={1} citations={frontmatter.citations} />.

Another claim from a different passage <SourceCitation index={2} citations={frontmatter.citations} />.
```

The inline component reads the article's real citation array, without a second manual copy of the source ID or locator. Each `index` is **1-based** and should be used **exactly once**, corresponding to the frontmatter citation item's position. An out-of-range index fails the build. The layout renders matching notes and a bibliography automatically; authors do not hand-write the references section. MDX's `frontmatter` binding supplies the citation array.

Use source markers for **traceable quotations and factual claims**; retain ordinary quotation marks or `blockquote` for direct quotations. Describe **personal practice observations** separately and honestly, distinguishing observations from interpretations. Citing an ancient text does not establish that a modern procedure or experience is historically attested.

## Markup, accessibility and metadata

- `SourceCitation.astro` emits a focusable `[1]` / `[2]` superscript link whose accessible name includes the actual registry title and its specific locator. A link targets `#citation-note-N`.
- `ArticleReferences.astro` renders numbered Notes only when citation occurrences exist. Each note carries the source title, supported page/passage/section/folio locator, an optional editorial note, and an accessible return link back to `#citation-ref-N`.
- The Sources bibliography deduplicates repeated source IDs, ordered first by citation and then by optional additional `sourceIds`. It uses only verified metadata actually supplied: creator, title, translator, edition, publisher, period, archive and optional URL. Missing fields are omitted without guessing. Registered titles without URLs remain unlinked.
- An article with neither citations nor source IDs displays **no empty Notes or Sources section**. The existing three Greek-deity layout previews remain unmodified, with no invented bibliographies or citations. Grimoire sources are optional.

## Print behavior

Notes and the bibliography remain visible in print, with source entries kept together as practical. Verified registered URLs appear as printable text. The screen-only return arrows and sticky/mobile TOC controls are omitted. An uncited or URL-free reference does not gain fictitious details in print.

## Validation and acceptance tests

`npm run qa:content` includes `npm run test:references`: distinct page/passage locators for two uses of one source, unique bibliography, empty state, invalid index, missing source IDs, malformed locators, and unsafe source URLs.

`npm run test:references-fixtures` creates temporary real MDX articles in **both** collections and a temporary source registry. It demonstrates two different locators for one source, optional Grimoire citation, bibliography-only and no-reference pages, and draft exclusion. Negative Astro builds confirm unknown source IDs and invalid HTTP(S) source URLs actually fail. Test-only source files and content directories are restored in `finally`, and never committed or deployed.

`npm run test:references-browser` checks keyboard activation of return links, reference targets and the print media styles at 375px and 1440px. Both tests run under GitHub's Editorial Quality workflow, after the existing article and TOC acceptance tests.

No external citation database, made-up research, test-only bibliographic registry entries, new author identities, images or Prompt 18 related-reading features are included.

**Stopped after Prompt 17.**
