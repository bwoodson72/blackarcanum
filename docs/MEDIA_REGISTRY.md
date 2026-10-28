# Mystagogia — Central Media Registry (Prompt 19)

**Status:** Infrastructure only. No images, media IDs or artwork have been approved. The live registry at `src/data/media.ts` is intentionally empty, and the Tyche, Hekate and Hermes layout previews remain text-only.

## File organization

| Location | Purpose | Public delivery |
| --- | --- | --- |
| `src/assets/media/editorial/` | Approved editorial/hero/card image sources | Astro image pipeline in Prompt 20 |
| `src/assets/media/reference/` | Source images of manuscripts, figures, diagrams and artifacts | Astro reference renderer in later prompts |
| `src/assets/media/decorative/` | Approved original ornaments and decorative artwork | Astro image pipeline later |
| `media-originals/` | Optional high-resolution archival masters (.tif, .tiff, .psd, etc.), segregated from the website output | **Never bundled or served by the site** |
| `src/data/media.ts` | One version-controlled metadata record per approved image | No direct UI or image rendering yet |

Images must be approved before being copied into `src/assets/media`. No browsing, scraping, bulk download, or generation is part of this prompt. Keep originals if they exist, and use a separate web-friendly source in `src/assets/media`. Do not place masters in `public/` or any folder imported by the Astro image pipeline. Note that a file committed to a **public GitHub repository is public even if it is not served by the website**. Never commit confidential, restricted, or otherwise nonredistributable masters; retain those securely outside the repository instead, and do not point `originalFile` at a location the build cannot validate. Files in `public/` should be reserved for deliberately unmodified direct delivery later.

**Naming:** lower-case, hyphen-delimited paths without spaces, punctuation or traversal; choose descriptive artifact/subject filenames, such as `src/assets/media/reference/greek-art/ancient-relief-01.png`. The media registry ID is also stable lower-case kebab-case; once referenced, do not rename it casually. Valid source extensions are .jpg, .jpeg, .png, .webp, .avif and .svg. Optional masters under `media-originals/` may also be .tif/.tiff/.psd. Avoid placing web-source files directly in the role folder without descriptive names.

## Required metadata

The typed `MediaRecord` in `src/data/media.ts` records:

- **Identity:** `id`, `sourceFile` and optional `originalFile`. These paths must be local, not URLs or paths into `public/`.
- **Visual purpose:** `role` (`editorial`, `reference` or `decorative`) and `origin` (`historical-reproduction` or `modern-artwork`). A modern image *depicting* an ancient deity is modern artwork, **not** a historical artifact.
- **Accessibility:** `alt`, and `decorative` true/false. For `role: "decorative"`, use `alt: ""` and `decorative: true`. Every other image requires meaningful nonblank alt text.
- **Figures:** `caption` (required for `reference`), and optional real `creator`, `date`, `period`, `repository`, `sourceUrl`. Unknown creator/date/period must be **omitted** rather than guessed. Historical reproductions and reference images need a traceable HTTP(S) `sourceUrl`.
- **Reproduction rights:** a `rights` record with mandatory `status` (`pending`, `cleared`, or `restricted`), plus a concrete `basis` (`public-domain`, `cc-license`, `permission`, `owned`), `license` statement, `creditLine` and evidence. **An ancient or public-domain underlying object does not automatically make a modern photograph or digital scan freely reusable.** Evaluate the particular image's copyright/reuse terms.

A `cleared` record must include a specific rights basis, statement and credit line. Historical/reference records additionally need an HTTP(S) **rights `evidenceUrl`**, separate from the artifact's source catalog URL. For modern editorial/decorative art directly owned by the publisher, an internally documented `evidenceNote` may be used instead of a public evidence URL. Unknown or unsafe URL schemes are rejected.

The **rights status can remain `pending` or `restricted`** while reviewing an image. Such metadata can be registered for research, but `mediaPublicationIssues()` rejects use of it by an article marked `published`. Never change status to `cleared` merely to satisfy a build, and never treat a claim of public-domain status without evidence as clearance.

## Adding and reusing an image later

1. Obtain **explicit editorial approval for the particular image** and verify that its reproduction/derivative is permitted. Record the catalog URL and the exact license/permission basis separately.
2. Put a web-source image in the appropriate `src/assets/media/<role>/...` folder. Preserve a high-resolution original separately under `media-originals/...` if available and lawful to retain.
3. Add **one** `MediaRecord` in `src/data/media.ts`. A source image cannot be registered under multiple IDs. Assign its stable ID to any number of Library or Grimoire articles through `mediaIds:` in their MDX frontmatter; **no article is required to have an image**.
4. Run `npm run test:media`, `npm run test:media-files`, `npm run qa:content` and `npm run typecheck`. The registry rejects unsafe source paths, nonexistent files, undeclared masters, invalid rights, missing descriptions/figure captions and unknown article media IDs.
5. Until Prompt 20, `mediaIds` is a **metadata-only link**. This prompt deliberately does **not** render the image, replace the older optional raw `hero` field, or generate responsive variants; those changes require the next approved prompt. The older `hero` field is retained for backward compatibility with existing tests and is not itself a new provenance-approved image mechanism.

## Validation and tests

- `src/lib/media-registry.ts` is a pure validator and ID resolver. It enforces safe local paths, rights clearance, captions, alt/decorative semantics, stable IDs, and source-file uniqueness, with a supplied file inventory.
- `src/lib/media-asset-inventory.ts` discovers actual optimized-source files at Astro **build time** using a Vite file glob. The editorial build gate rejects nonexistent registry paths and blocks publication of uncleared referenced media. The glob deliberately excludes high-resolution masters.
- `scripts/test-media-files.mjs` checks real files (including optional original masters), rejects symlink escapes and unregistered image files, and supports a clean empty registry/directory.
- `scripts/test-media-registry.mjs` uses **in-memory-only** positive and negative records to verify types and rules, legal reuse evidence, missing source/original paths, no-data articles and cross-collection reuse. It adds no artifacts or test metadata to the live registry.
- `scripts/test-media-build.mjs` temporarily injects a **metadata-only** missing-image record, verifies that an actual Astro production build fails for that missing asset, and restores the exact registry file in `finally`. No image is created, and the run is isolated in CI from live content builds.

There is no new media display component, lightbox, gallery, catalog of historical figures, external image service, image purchase, license assertion or generated image in Prompt 19.

**Stopped after Prompt 19.**
