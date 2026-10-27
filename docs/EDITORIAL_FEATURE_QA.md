# Mystagogia — Curated Feature Selection and Editorial QA (Prompt 11)

## Approved editorial picks

`src/data/features.ts` is the only registry for curated editorial placements. It has four typed fields, all **intentionally empty**:

| Placement | Type | Meaning |
| --- | --- | --- |
| `homepageLibrary` | Ordered Library ID array | Future homepage research slots. |
| `primaryGrimoire` | Grimoire ID or `null` | Single primary Grimoire feature. |
| `libraryHub` | Ordered Library ID array | Optional Library hub features. |
| `grimoireHub` | Ordered Grimoire ID array | Optional Grimoire hub features. |

Only **explicit stable entry IDs** from published Library or Grimoire MDX files may be selected. Entry data must have `status: published` and a valid `publishedAt`. The list order is editorially meaningful; no query for newest/latest/most popular content is allowed as a substitute. Repeated IDs within the same placement are invalid, and an ID in the wrong collection does not resolve.

An editor must first approve and publish an actual piece (separate publication approval). Then, and only then, they may approve an ID and its position in the corresponding feature array. Feature changes must be checked with the QA command below and reviewed before merge.

## Empty behavior

`resolveFeatureSections()` returns **no keys** for empty placement arrays or a `null` primary feature. Future templates should render a feature section only if its resolved property exists. There are no placeholder cards, fake article titles, automatic latest fallbacks or fabricated art. A selected feature that is unavailable or unpublished **throws** instead of silently disappearing.

At this stage the homepage remains the existing noindex project-in-development shell. Prompt 11 changes only its frontmatter to invoke the editorial build gate; it does not insert visual feature sections or edit the public page body. Later homepage and hub prompts will consume the registry when editorial material exists.

## Validation API and commands

- `src/lib/editorial-qa.ts` contains `validateEditorialIntegrity(input)` and `resolveFeatureSections(input)`. Both accept normalized articles plus topic, source and feature registries, making the logic independently testable. Every violation yields a deterministic, sorted, descriptive error.
- `src/lib/editorial-build-qa.ts` bridges actual Astro `getCollection("library")` / `getCollection("grimoire")` records and the approved registries to those validators.
- `src/pages/index.astro` awaits `checkEditorialBuild()` during static generation. This intentionally ensures that `npm run build`, including ordinary deployment builds, fails for any broken content relationships or feature picks. It does **not** render articles, link to unimplemented pages, or change the homepage appearance.
- `npm run test:editorial` runs permanent isolated feature/integrity regression tests.
- **`npm run qa:content`** runs the existing schema tests, these integrity tests, and a complete Astro build against the *real MDX collections*. This is the primary editorial prepublication check. Existing `npm run typecheck` remains a separate TypeScript/Astro type safety step.

The integrity validator enforces: required date on published entries; `updatedAt >= publishedAt` when both exist; valid update dates; unique collection-scoped entry IDs; all related-article IDs resolve; no self-relations; no published article referencing unpublished related content; all topic IDs, source IDs, and citation source IDs resolve to reviewed registries; and featured ID existence/collection/publication status. Drafts and review articles are checked for broken references too, even though they are not publicly accessible. Future article routes must continue using the published-only helpers from Prompt 09.

Source and topic schema correctness and bibliographic metadata rules remain those of Prompt 10. No registry topic, source or article has been introduced by Prompt 11.

## Acceptance evidence — October 27, 2026

Verified using temporary GitHub Actions workflow [run LINK_PENDING]. The temporary workflow and its in-run MDX fixtures are not part of the reviewed PR.

The checks cover a clean install, `npm run qa:content`, `npm run typecheck`, `npm audit --audit-level=high`, exactly two generated existing public routes, no feature placeholders in the empty homepage, and both positive and negative build tests. Positive fixtures create real temporary Library/Grimoire MDX entries selected in ordered features; negative fixtures must fail production builds for unpublished featured entries, missing featured IDs, unknown related IDs, and dates with `updatedAt` preceding `publishedAt`.

Browser visual QA is not applicable: this prompt adds no new rendered UI or artwork.

**Stopped after Prompt 11.**
