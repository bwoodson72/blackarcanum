# Mystagogia — Editorial Production Workflow

Standing procedure for producing an illustrated Library article. Prepared October 29, 2026, against the current repository implementation. Read this together with [EDITORIAL_STYLE.md](EDITORIAL_STYLE.md) before researching, drafting, editing, or preparing article assets. The style document governs the writing; this document governs production. No previous ChatGPT conversation is required to follow either document.

## Scope and authorization

Start from the owner's current assignment. Establish the subject, intended collection, deliverable, and any limits already given. Reuse approvals that are explicit in the current assignment or recorded with the relevant local material; do not ask again for an action already authorized. A general workflow document is not authorization to create an article, download images, generate artwork, alter existing content, commit, push, or deploy. Artwork generation requires approval of its concept, and publication requires explicit owner approval. When a required permission or asset is missing, complete independent authorized preparation and report the specific outstanding item.

Work in the actual local repository, currently `/home/brian/WebstormProjects/occult-site`. Confirm the root, branch, and working changes before editing. Preserve unrelated work and the current master-only development convention in `AGENTS.md`; do not create a branch or PR by default. A later move of the repository changes its location, not its editorial conventions.

Keep article text, approved source records, media records, and web assets in their existing locations. Do not create a parallel image database, CMS, asset service, or publication mechanism. If intermediate research or review notes need to persist for another agent, save a plain local working note outside the public content collections and web asset folders, recording the brief, verified passages, unresolved claims, specific approvals, and asset locations. Keep scratch material out of the publication change. Do not put research notes or fictional examples into public MDX.

## 1. Establish the evidence and narrative

Read `AGENTS.md`, [SPECIFICATION.md](SPECIFICATION.md), both editorial documents, and the technical references relevant to the assignment. Read the substantive Hekate, Hermes, Tyche, and Ploutos Library articles as structural references, distinguishing them from entries marked `preview: true`. Follow their useful integration of stories, character, cult, and historical imagery without copying their wording, section sequence, paragraph weaknesses, or repeated conclusions.

Research the subject using primary historical texts and credible academic scholarship. Read the actual relevant passages, verify the edition or translation, and record precise locators and what each passage supports. Use inscriptions, archaeological publications, and authoritative collection records for material and cult evidence. Treat search summaries, supplied notes, and earlier AI prose as leads requiring verification. Distinguish myth, historical worship, literary interpretation, regional variants, later reception, and documented modern claims. Identify uncertainty and substantive scholarly disagreements without inventing a resolution.

Plan a narrative that develops the deity's distinctive character, mythology, powers, historical worship, and religious significance. Let the evidence determine emphasis and order. Write substantial connected paragraphs with sufficient historical development; an outline, correspondence list, or sequence of dramatic one-liners is not a finished article. Review the prose against the style standard, then audit the factual claims against the research. Keep original practice and personal gnosis in the Grimoire. Submit the draft for owner review as required by the assignment, preserving source references through revisions.

## 2. Register the verified sources

Reuse matching records in `src/data/sources.ts`; do not duplicate a source under a second ID simply because a new article cites it. Check that the existing record identifies the edition and translation actually used. A materially different edition may require its own accurately distinguished record. Source registration and review follow [EDITORIAL_REGISTRIES.md](EDITORIAL_REGISTRIES.md).

The actual `SourceRecord` requires `id` and `title`. Its optional fields are `creator`, `edition`, `translator`, `period`, `publisher`, `archive`, `stableUrl`, `rights`, and `kind` (`primary`, `scholarly`, or `practitioner`). Supply only verified values. `stableUrl`, if supplied, must be a valid HTTP(S) URL. Do not invent a link or metadata for a legitimate print source. Keep passage/page locators in the article's citations rather than in the shared record.

An article citation has `sourceId`, optional `note`, and optional `locator`. The locator accepts nonblank string fields `page`, `passage`, `section`, and `folio`; if present, at least one must be supplied. The schema allows citations without locators, but editorial standards require precise locators wherever they can be verified. A note explains use or uncertainty; it does not replace a missing supporting passage. All source IDs must resolve to approved records even in drafts.

## 3. Create MDX and frontmatter

Create an authorized Library article at `src/content/library/<descriptive-slug>.mdx`; Grimoire belongs in `src/content/grimoire/`. The loaders in `src/content.config.ts` accept MDX only and derive the entry ID from explicit frontmatter `slug`, not from the filename. Use matching descriptive filenames as the local convention and keep slugs unique within the collection. The route will be `/library/<slug>/` when publication is authorized and the entry is eligible.

The current contract is `src/lib/editorial-schema.ts`, not the broader list of proposed fields in older milestones:

| Field | Current authoring rule |
| --- | --- |
| `slug`, `title`, `description`, `status` | Required. Slug is lowercase ASCII letters/digits separated by single hyphens. Title and description must be nonblank. Status is `draft`, `review`, or `published`. |
| `publishedAt` | Required valid date for `published`; do not invent a publication date for a draft. |
| `updatedAt` | Optional valid date; when both dates exist it must not precede `publishedAt`. Use for substantive published revisions. |
| `preview` | Optional boolean reserved for explicitly approved layout samples; not a private preview switch. |
| `topics` | Optional IDs from `src/data/topics.ts`; do not invent or enable categories. |
| `relatedIds` | Optional existing `library:<slug>` or `grimoire:<slug>` IDs. No self-links; public related links must resolve to eligible published entries. |
| `sourceIds` | Optional registered bibliography IDs, including additional sources not individually cited. |
| `citations` | Ordered citation occurrences, each with its own source ID and verified locator as appropriate. |
| `mediaIds` | Registered IDs for every image used by the article, including the hero and all figures/gallery items. |
| `featuredMediaId` | One approved editorial-role ID, also included in `mediaIds`; selects the hero and card image. |
| `hero` | Legacy optional `{ src, alt }` compatibility field. Use the media registry pathway for new work. |

The schema does not currently define separate `author`, `summary`, `series`, or SEO override fields. Do not invent frontmatter properties from specification proposals. The layout supplies the H1 and generates the table of contents from body headings; start body sections at `##`. Preserve Mystagogia's public anonymity in all prose, metadata, and credits.

This is syntax only, not a new article or evidence. Replace every example ID, claim, and locator with reviewed values before use; never save these placeholders into a live collection:

```mdx
---
slug: example-deity-study
title: "Example title"
description: "An accurate description of the actual article."
status: draft
mediaIds:
  - example-deity-approved-hero
  - example-deity-verified-artifact
featuredMediaId: example-deity-approved-hero
citations:
  - sourceId: verified-source-id
    locator:
      passage: "verified passage locator"
---

A supported statement with its matching note.<sup id="citation-ref-1"><a href="#citation-note-1" aria-label="Read source note 1">[1]</a></sup>

## A section about the relevant historical evidence

Develop the discussion before placing its relevant figure.

<ReferenceFigure id="example-deity-verified-artifact" lightbox />
```

Use `draft` while composing and `review` for the assembled review version. These states do not generate article routes. Omit unavailable optional references rather than adding unresolved IDs. The collection schema checks IDs even when an entry is unpublished.

## 4. Connect citations to rendered notes

Follow [ARTICLE_REFERENCES.md](ARTICLE_REFERENCES.md), checked against `src/lib/editorial-citations.ts`, `src/lib/article-references.ts`, and the existing articles. Each inline occurrence corresponds to one item in `citations`, numbered from 1 by array order. Cite a source again with another citation item when using a different passage; the bibliography automatically deduplicates source records. Do not hand-write a second Notes or Sources section in the body: `ArticleLayout.astro` passes the metadata to `ArticleReferences.astro`.

The raw superscript link shown above is the pattern used by the substantive Greek deity articles. Its visible number, `citation-ref-N` ID, and `#citation-note-N` target must all match the Nth citation item. Use each occurrence ID once and keep numbering in reading order. The generated note supplies the backlink. Manually audit these relationships after inserting or reordering paragraphs; the schema does not prove raw HTML marker accuracy.

`SourceCitation.astro` also exists with `index` and `citations` props, but unlike the figure components it is not automatically mapped in the current article routes. Older documentation shows an explicit import and `frontmatter.citations` usage; do not assume the component is globally available. Retain the current article pattern unless an alternative is deliberately verified in a real MDX render. Existing articles can contain numbering mistakes and are not permission to propagate them.

## 5. Select historical illustrations and approve the hero

Choose images because they substantiate or clarify the surrounding discussion, not to meet an arbitrary image count. For historical references, prefer reputable museums, archaeological institutions, and legitimate open-access archives. Verify the exact artifact and exact reproduction: its identification, attribution, date or period, collection, inventory number where known, photographer, source record, and reuse terms. Distinguish an ancient original from a Roman copy, modern cast, restoration, or reconstruction. Never transfer a catalog's description or license to a different photograph.

Check the particular image's copyright, license, or permission, including attribution and derivative requirements. An ancient object does not make a modern photograph public domain. Record traceable source and rights evidence, omit unknown optional details, and keep uncertain rights `pending` or `restricted`. Do not download or copy an image into the approved media folders until the action and particular image are authorized and the reuse basis has been checked. If a necessary image cannot be cleared, report it as missing rather than substituting unrelated art or claiming clearance.

Before developing a hero concept, research the deity's traditional appearance, attributes, clothing, objects, and iconography. Propose a specific depiction grounded in those findings, clearly identifying creative choices. The hero is modern editorial artwork, not archaeological or historical evidence. Obtain owner approval of the concept before generation. Use an available image-generation capability when supported, following its applicable instructions; if unavailable, identify the missing asset. Do not invent a generated file, silently use another deity's hero, or replace the approved concept with stock art.

Review the resulting image for the approved attributes, coherent anatomy and objects, composition, and fit with the site's design. Obtain approval of the particular result before incorporation into approved media. Record the approval and any available generation identifier accurately; do not invent one. If an earlier chat's image is unavailable, identify that access limitation and use an actual attached or accessible local asset. Do not assume that a conversation reference includes its image files.

## 6. Optimize and register approved images

Save approved hero sources as optimized WebP under `src/assets/media/editorial/greek-deities/`. Use descriptive lowercase kebab-case filenames beginning with the deity's name followed by the specific depiction, such as the naming pattern `<deity>-<specific-depiction>.webp`. Historical references belong under `src/assets/media/reference/greek-deities/`, using descriptive subject/artifact names. The registry permits JPG, JPEG, PNG, WebP, AVIF, and SVG; retain a format that preserves essential detail in reference imagery rather than applying destructive compression indiscriminately.

Use locally available image tooling; `sharp` currently resolves from this repository's installed dependencies. Inspect dimensions and orientation, convert the actual source to WebP for the hero, and compare the result visually at intended display sizes. Choose compression for acceptable detail and file size, preserve natural proportions, avoid upscaling, and remove unwanted private metadata. There is no mandatory quality setting or byte limit in the schema. Do not add an image service or conversion subsystem. Recheck tool availability rather than installing dependencies automatically.

Do not crop out artifact edges, inscriptions, or other essential reference details, or retouch historical evidence into a different object. Keep lawful archival masters separately under `media-originals/` only when repository redistribution is permitted; otherwise use approved private storage and omit `originalFile`. A public Git repository exposes a committed master even when the website does not serve it. Do not put masters in `public/` or imported asset directories.

Add or reuse exactly one `MediaRecord` per source image in `src/data/media.ts`, using the real interface and validation in `src/lib/media-registry.ts`:

| Fields | Required use |
| --- | --- |
| `id`, `sourceFile` | Unique stable lowercase-kebab-case ID; actual safe repo-relative file under `src/assets/media/<role>/...`. One file cannot have multiple registry IDs. Reuse IDs across articles. |
| `role`, `origin` | Hero: `editorial` and `modern-artwork`. Historical figure: `reference` and `historical-reproduction`. Role must agree with the source folder. Other supported values are `decorative` for role and the same two origin values. |
| `alt`, `decorative` | Hero and reference images need meaningful image-specific alt text and `decorative: false`. Decorative records alone use empty alt and `true`. |
| `caption` | Required for references. Supply a hero caption identifying it as modern artwork and giving appropriate credit: the current article header displays the caption but does not separately render the rights credit line. |
| `creator`, `date`, `period`, `repository`, `sourceUrl` | Record verified details only. Historical/reference records require a traceable HTTP(S) `sourceUrl`. Include verified inventory/collection details in the caption or repository text; there is no separate inventory-number property. Distinguish artifact creator from photographer in the caption/credit as appropriate. |
| `originalFile` | Optional real master path under `media-originals/`, only if lawfully retained and redistributable in the repository. |
| `rights` | Required object described below. |

`rights.status` is `pending`, `cleared`, or `restricted`. Publication clearance requires a verified `basis` (`public-domain`, `cc-license`, `permission`, or `owned`), specific `license` or permission statement, and `creditLine`. Historical/reference images also require `sourceUrl` and a separate rights-evidence field, `rights.evidenceUrl`, pointing to the actual terms. Catalog evidence and rights evidence are distinct requirements; one page may document both only when it genuinely does so. For modern editorial artwork, valid `rights.evidenceUrl` or an accurate `rights.evidenceNote` is accepted; use `owned` only when that basis is established. Never treat owner approval alone as proof of copyright ownership or permission.

Unknown metadata must not be fabricated, and uncertain rights must not be marked `cleared` to pass checks. Pending metadata may exist for research, but published references to it fail validation and figure rendering requires clearance. Register only real assets with accurate paths; missing images and unregistered files are detected. Do not create speculative records pointing to nonexistent files. See [MEDIA_REGISTRY.md](MEDIA_REGISTRY.md) for the underlying system.

## 7. Place and inspect the figures

Declare every used ID in `mediaIds`, and set `featuredMediaId` to the approved editorial hero. Listing `mediaIds` alone inserts no images. The article header and archive cards use the featured image; do not insert a duplicate hero at the beginning of the body. Astro generates responsive variants through the existing media components. Hero composition remains uncropped; archive cards crop to 3:2, so check both views. Reference images preserve their proportions and original encoding format through responsive rendering.

Both article routes already map the MDX figure components; no import or custom `components` export is needed:

| Component | Appropriate use |
| --- | --- |
| `<ReferenceFigure id="registered-reference-id" lightbox />` | Historical discussion; registry caption, provenance, source link, credit, and reuse terms. Omit `lightbox` for a static figure. Reference captions cannot be overridden. |
| `<ArticleImage id="registered-editorial-id" />` | Additional approved modern editorial art; optional contextual `caption` without replacing the credit. |
| `<FullWidthImage id="registered-editorial-id" />` | Deliberate editorial breakout using the existing responsive layout, not a way to crop historical evidence. |
| `ImageGallery` | 2–12 ordered distinct registered IDs in `items`, with a meaningful group `label`. |
| `CompareImages` | Exactly two distinct items, `left` and `right`, each with a meaningful `label`; optional `title`. |

Place figures beside the relevant analysis rather than collecting them arbitrarily at the end. All gallery/comparison IDs must also be declared in `mediaIds`. Only editorial items permit contextual caption overrides; only reference items permit `lightbox: true`; decorative images are not accepted as article figures. Use the exact existing item syntax in [MDX_FIGURES.md](MDX_FIGURES.md) and [MDX_MULTI_IMAGE.md](MDX_MULTI_IMAGE.md). Do not bypass rights checks with raw image URLs, direct low-level image imports, or an invented gallery system.

## 8. Validate locally and present a reviewable package

Use the runtime required by `package.json` (currently Node `>=22.23.4`) and the existing lockfile/dependencies. Inspect changes and run `git diff --check`. For routine authorized article production, the normal complete gate is:

```sh
npm run qa:fast
```

This runs `qa:content` (combined unit suites plus newsletter tests, one Astro/Pagefind build, and `test:samples`), then `typecheck`, then the high/critical dependency audit. `qa:units` already includes the content schema, editorial integrity, references, media registry/display, and real media-file checks. Focused diagnosis can use `npm run test:content`, `npm run test:editorial`, `npm run test:references`, `npm run test:media`, or `npm run test:media-files`; do not rerun all checks repeatedly without a new failure or change. Report network/tool/runtime blockers as blockers, not successful checks.

**Current content-check limitation:** `scripts/test-sample-articles.mjs` compares the exact collection filenames against explicit lists of the three retained layout previews and four finished deity articles. Adding even a schema-valid draft causes `test:samples`, and therefore `qa:content`/`qa:fast`, to fail until the acceptance expectations are deliberately updated for authorized content. Diagnose this separately from a schema or build failure. Do not delete the draft, publish it early, loosen the assertion indiscriminately, or claim the gate passed. Any acceptance-test update must be narrowly reviewed and within the owner's authorized scope; a documentation-only assignment does not authorize it.

**Rendering limitation:** `src/lib/editorial-public.ts` admits only `published` entries with a valid `publishedAt` and `preview !== true`. Drafts, review entries, and retained layout previews have no public article route. `preview: true` does not expose a local draft viewer, and a future `publishedAt` is not a scheduling mechanism: there is no comparison with today's date. A successful build does not prove an excluded draft's MDX figures have rendered. Do not mark the working article published just to obtain a preview. If review requires rendering before publication authorization, obtain permission for a disposable local copy with a temporary publication state solely for rendering, using existing routes and build tools, never a remote deployment. Keep that state out of the real repository and publication diff; if permission or a suitable review environment is unavailable, report rendered review as pending. Do not introduce a permanent preview system as part of article production.

For an authorized local rendered review, use `npm run dev -- --host 127.0.0.1` or build then `npm run preview -- --host 127.0.0.1`. Review the actual article and archive card at phone, tablet, and desktop sizes. Check heading/TOC navigation, citation targets and backlinks, notes and bibliography, hero and card compositions, image relevance, readable captions/credits/reuse links, natural reference ratios, no overflow, and keyboard lightbox behavior if enabled. Verify the selected file is actually displayed, not merely registered. Stop temporary review servers after use unless requested otherwise.

For changes to shared layout, citation logic, related-reading logic, or media rendering, run the relevant existing deep regression suite described in [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) and `.github/workflows/deep-regression.yml`. Available local pairs include `test:references-fixtures`/`test:references-browser` and `test:media-render-fixtures`/`test:media-render-browser`; media regression also includes `test:media-build`. These fixture tools temporarily replace content or registry files and rebuild: use a disposable checkout, not the owner's active work with uncommitted articles. They validate shared behavior, not the historical truth or visual quality of a specific new article. Routine content work does not require every deep suite.

Present the completed article, source and media changes, review results, exact checks passed or blocked, missing assets/rights, and the specific approval still needed. Automated checks cannot establish historical accuracy, image permissions, or editorial quality. A finished illustrated package requires both editorial review and actual visual review; label incomplete stages honestly.

## 9. Publish only when explicitly authorized

Owner approval must cover the final text, selected imagery, and publication. Obtain any still-missing authorization before changing publication status or taking Git/deployment actions. Reuse permission already expressly given; do not make the owner approve the same action repeatedly. The lifecycle is draft → review → published; later substantive revisions use `updatedAt` without inventing a new original publication date. Do not add a topic, related link, homepage feature, or collection-hub feature merely because the article exists. `src/data/features.ts` is curated and requires explicit selection.

When publication preparation is authorized, set `status: published`, supply the actual publication date, leave layout-preview mode absent/false, and repeat the relevant checks against the final eligible entry. Check that the article appears in the intended archive and Pagefind output, that drafts/previews remain excluded, and that links and media work. Do not claim an approved production domain, sitemap, or search-engine discoverability without checking the current site configuration; see [SEO.md](SEO.md) and [PAGEFIND.md](PAGEFIND.md). A code/content build can succeed while broader launch requirements remain unresolved.

Only with authorization to commit and push, review the full diff, stage only the intended files, and make one coherent commit directly on `master` under the existing convention. Recheck branch/remote state first and preserve unrelated local commits; never blindly push an ahead branch containing unreviewed work. Push only the authorized history. Vercel automatically deploys from `master`, so permission to publish through that push must account for the deployment it triggers. Do not manually launch a duplicate deployment or change hosting configuration.

After an authorized push, verify the resulting Editorial Quality checks and automatic deployment, then inspect the published article and images at the actual deployed URL. Report the commit, deployment result, and remaining issues. If CI or deployment fails, report the failure and perform only fixes within the authorized scope; do not claim publication succeeded. This document describes those future steps and grants no permission to perform them now.

## Technical references and maintenance

Use the existing technical documentation for implementation detail rather than duplicating it elsewhere: [ARTICLE_REFERENCES.md](ARTICLE_REFERENCES.md), [MDX_FIGURES.md](MDX_FIGURES.md), [MDX_MULTI_IMAGE.md](MDX_MULTI_IMAGE.md), [MEDIA_REGISTRY.md](MEDIA_REGISTRY.md), and [MEDIA_RENDERER.md](MEDIA_RENDERER.md).

Some documents and code comments describe historical milestones: claims that registries are empty, only Tyche has artwork, figures are unimplemented, or layout previews remain public are outdated. The current source and runtime behavior govern technical details. Recheck `src/lib/editorial-schema.ts`, `src/data/sources.ts`, `src/data/media.ts`, `src/lib/media-registry.ts`, `src/lib/editorial-public.ts`, the article routes/components, `package.json`, and relevant checks when those change. This workflow is the production entry point, not a second schema or asset-management system. If implementation prevents a required step, record the precise limitation and seek an authorized fix rather than bypassing it.
