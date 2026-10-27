# Mystagogia — Topic and Bibliography Registries (Prompt 10)

## Approval and scope

Mystagogia keeps **one typed, version-controlled topic registry** at `src/data/topics.ts` and one bibliographic source registry at `src/data/sources.ts`. Both contain **zero records** at this milestone. No subjects, texts, authors, archives, images or rights have been invented. The registries define approved **metadata**, not public routes or permission to publish content.

New topics and sources require explicit human review before they are committed:

1. **Topic approval:** Confirm an actual editorial subject and its label. Add a lowercase, stable, hyphen-separated `id` and an accurate `label` to `topics`. Set `enabled` only when new articles may use it. Set `showInBrowse` only if the subject is approved for later browsing interfaces. A `description` is optional. Supply `landingPage` only if the local page **already exists and has separately passed review**. Adding a registry item **never** creates a category page, navigation link, archive, tag index or feature.
2. **Source approval:** Verify the work actually exists and check its title and whatever bibliographic facts can be substantiated. Add a stable `id`, required `title`, and known `creator`, `edition`, `translator`, `period`, `publisher`, `archive`, stable HTTP(S) `stableUrl`, and `rights` terms as available. Optional `kind` distinguishes `primary`, `scholarly`, and `practitioner` evidence. **Omit unverified data** rather than fabricating it. An online link or licensing assumption is not mandatory for a legitimate print-only work.
3. **Article review:** Authors may use only existing approved topic IDs in `topics`, and existing source IDs in `sourceIds` or `citations[].sourceId`. Do not add labels, sources, topics or inferred authorship merely because a suggested article needs them. Check that the cited source supports each claim and that the specific edition/locator is correct. Publication still requires separate approval under Prompt 09 and later article-route work.

A topic's `enabled: false` flag means **do not add it to new article metadata**; a historical article may retain an existing, now-disabled topic ID to avoid breaking archives. `showInBrowse` is permission for a *future* directory to consider the topic, not an instruction to create one. This step creates no directory UI.

## Typed contracts

- `src/data/topics.ts` exports `Topic` and `topics: readonly Topic[] = []`. Required fields: `id`, `label`, `enabled`, `showInBrowse`. Optional: `description`, `landingPage`.
- `src/data/sources.ts` exports `SourceRecord` and `sources: readonly SourceRecord[] = []`. A source has a required `id` and `title`, plus optional bibliographic attributes including known creator/edition/translator/period/publisher/archive, `stableUrl`, `rights`, `kind`.
- `src/lib/editorial-citations.ts` exports `Citation`, `CitationLocator` and their Zod schemas. A citation contains `sourceId`, optional nonblank `note`, and optional `locator` with one or more of `page`, `passage`, `section`, `folio`. Locators use free text to preserve ranges, Roman numerals and folio recto/verso notation. Explicitly empty locators fail validation.
- `src/lib/editorial-identifiers.ts` centralizes the stable ID pattern used by articles, topics and sources.
- `src/lib/editorial-registry-validation.ts` checks unique registry IDs, ID formats, required labels/booleans, nonblank supplied source fields, and HTTP(S) stable URLs.
- `src/lib/editorial-schema.ts` invokes registry validation **on schema initialization** and uses the IDs in both registries to check all article `topics`, `sourceIds`, and `citations[].sourceId`. Unknown IDs or malformed locators fail MDX content parsing/build. `createEditorialSchema({topics, sources})` permits **in-memory test fixtures only**; the production export `editorialSchema` always reads the actual approved registries.

Example structure (these are **only abstract nonpublic examples**, not editorial approvals or files):

```ts
// Topic schema shape:
{ id: "test-topic", label: "Test topic", enabled: true, showInBrowse: false }

// Source schema shape:
{ id: "test-source", title: "Test-only work", creator: "Test creator" }

// Article's optional metadata:
// topics: ["test-topic"]
// citations: [{ sourceId: "test-source", locator: { page: "12–14", passage: "II.4" } }]
```

The full source record is reused across articles; the locator belongs to **each citation** so separate passages of the same work can be cited precisely. `sourceIds` remains available for general bibliography without specific passage locators. Later SourceNote/MDX presentation components can consume this model; they are **not** implemented here. Prompt 11 handles feature validation and broader cross-article QA.

## Verification — October 27, 2026

**PASS — [GitHub Actions run 40593550172](https://github.com/bwoodson72/blackarcanum/actions/runs/40593550172).** Test additions used temporary MDX fixture files and temporary changes to the registry in a throwaway CI checkout. None are in the final pull request.

- `npm ci`, `npm run test:content`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=high` all passed on **empty actual registries and empty article collections**. Typecheck: **26 files, 0 errors, 0 warnings, 0 hints**. Audit: **0 vulnerabilities**.
- The unit suite tested unique/duplicate topic and source IDs; missing titles/labels; invalid ID formats/URLs; valid and blank passage/page/folio locators; valid in-memory topic/source fixtures; and unknown topic, bibliography and citation source IDs.
- Build produced **only two already-approved routes**: `/` and `/about/`. No `/topics/` or article routes were added.
- **Negative MDX build tests:** a draft with an unknown topic failed with `Unknown topic ID`; a draft with unknown bibliography/citation source IDs failed with both `Unknown source ID` and `Unknown citation source ID`.
- **Positive MDX build test:** a temporary draft referencing locally injected, typed test-only topic/source IDs passed; it did not publish an article route.
- **Negative registry build test:** a duplicate ID temporarily injected into the topic registry caused the Astro build to fail with `Duplicate topic ID`.

**Deliberate limits:** No preapproved taxonomy, citations, topics, biography, art, route, product, source display component, or feature registry. No source-link or rights verification is performed automatically; editors must independently confirm each claim. Cross-article related-ID validation is reserved for Prompt 11.

**Stopped after Prompt 10.**
