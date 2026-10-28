# Textual editorial blocks — Prompt 23

All four components are available in **Library** and **Grimoire** MDX articles without an import. They do not appear automatically in any page.

```mdx
<Callout title="Editorial context">
  A **short note**, optionally with markdown lists.
</Callout>

<Callout kind="caution">
  A **caution** only where the subject actually warrants one.
</Callout>

<SourceNote label="Evidence and translation">
  Explain the source and its limitations, linking to an independently verified source where applicable.
</SourceNote>

<QuoteBlock attribution="Verified speaker or text, edition and location">
  A **properly attributed** quotation.
</QuoteBlock>

<ContentCTA title="Continue exploring" label="Browse the Library" href="/library/">
  Read more in the **live Library archive**.
</ContentCTA>
```

- `Callout` accepts `kind="note"` (default) or `kind="caution"` only, plus an optional title. Both use an accessible labelled aside.
- `SourceNote` is an evidence/translation note, not an automatically generated reference. Bibliography and citation validation remain in the existing registry.
- `QuoteBlock` requires a nonblank attribution and uses a semantic blockquote and figcaption. Editors remain responsible for verifying quotation accuracy.
- `ContentCTA` requires a nonblank title/label and a known working destination. The only allowed href values currently are /`, /about/`, /library/`, and /grimoire/`. Unknown, external, promotional, and future destinations fail the build. Extend `src/lib/content-cta.ts` only after new routes actually exist.

The existing **temporary** MDX media fixture suite exercises nested prose, lists, attribution, existing internal links and responsive display in both collections. The existing browser suite checks 375/1024/1440px and link focus without adding another Chrome process or build. `test-editorial-schema.mjs` checks that unavailable routes are rejected. No new content, artwork, commerce, or newsletter destination is published.

**Stopped after Prompt 23.**
