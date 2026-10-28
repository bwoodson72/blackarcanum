# Prompt 26 — responsive accessibility and visual QA

**Scope:** Homepage, About, Library and Grimoire hubs, and representative Library/Grimoire article pages. Inspected the source, approved visual reference documentation and existing test system on October 28, 2026. No unrelated redesign or new public content.

## Coverage matrix

The fast `test:samples` suite now checks seven **real** generated URLs in the one normal Astro build: /`, /about/`, /library/`, /grimoire/`, and the three approved/noindex Greek-deity article previews. Checks include a unique main/H1, functional skip link, accessible desktop/mobile navigation structure, unique IDs, image alt attributes, live same-site links and in-page anchors, no invented sales/newsletter destinations, and contrast of six approved palette pairs at WCAG AA 4.5:1. It also checks the reduced-motion CSS guard.

The **existing** article browser runner now tests **375, 768, 1024, 1280 and 1440 CSS-pixel widths** on six template URLs in one fixture build and headless Chrome session:

| Template | Route | Inspect |
| --- | --- | --- |
| Homepage | /` | Heading, full-bleed hero, gateways, live links, sticky header, 5-width screenshots |
| About | /about/` | Heading, paragraphs, source/practice distinction, link/focus/overflow |
| Library hub | /library/` | Hero, archive, sticky header, responsive landmarks |
| Grimoire hub | /grimoire/` | Hero, archive, sticky header, responsive landmarks |
| Library article fixture | /library/qa-library-reading/` | 720px reading width, headings, TOC, breadcrumbs and accessible media |
| Grimoire article fixture | /grimoire/qa-grimoire-reading/` | Reading width, heading hierarchy, media containment and captions |

Shared browser checks cover no horizontal page overflow, one main/H1, skip-link target, initial header flow, correct desktop/mobile breakpoints, image alt attributes, no nested links and navigation targets ≥44px. Six additional full-page screenshots are captured for About, Library and Grimoire at 375px and 1440px in the same QA artifact. The 375px homepage check also opens the native mobile dialog and verifies modal state, focus entry, link target sizes and close-focus restoration. Existing browser tests cover article typographic line height and maximum width, mobile/tablet TOC and sticky header behavior; related media tests cover uncropped reference figures.

## Corrected defects

1. **Previously red CI (commit `fab90af`):** the homepage gateway assertion destructured an unprovided third regex capture and threw a `TypeError`. It now checks the **full matched markup**, preserving existing tests for ornament, label and working URL. This was a test defect; the Astro build completed successfully.
2. **Outdated About text:** the About page implied Library/Grimoire navigation would only appear later. Both hubs are live, so the copy now reflects their current availability.
3. **Incomplete viewport coverage:** article/homepage browser checks missed 1280px. Existing loops now include it and reuse their single browser instance.
4. **Insufficient cross-template smoke tests:** previously no shared fast validation of landmarks, duplicate IDs, link destinations and representative contrast; these run in the existing production-build checks, not a new CI workflow.

## Visual reference and limitations

Compare the five homepage screenshots (GitHub Actions artifact `homepage-responsive-qa` in the `articles` deep suite) with `docs/design-references/homepage-approved.webp` and the owner's later dark-gold mockup. The hero height and gold-on-charcoal theme, engraved borders, gateway image panels and actual content were preserved. The Library and Grimoire hub heroes share that design language; About remains intentionally editorial and less illustrated.

Remaining differences for visual review: CSS/SVG engraving details are approximate, illustrated crop/contrast can change at narrow widths, and color ratios computed against solid palette swatches **do not** certify readability over detailed backgrounds. Real device/screen-reader checks (NVDA/VoiceOver, browser zoom/touch and keyboard Escape/focus behavior on each platform) remain outstanding.

## Verification status and handoff

- Source/static syntax and staged checks are preliminary, not a substitute for the build.
- `npm run qa:fast` automatically runs on the single master commit and verifies the actual Astro build, seven real pages, TypeScript/ASTRO diagnostics and audit.
- The six-template **real browser** matrix is only run by **GitHub Actions → Deep Regression → Run workflow → `articles`**. The installed GitHub connector does not offer workflow-dispatch; this environment cannot clone the repo directly because GitHub DNS/network is unavailable. Therefore browser screenshots and actual visual acceptance are **not claimed as passed** until a reviewer runs that suite and inspects its artifacts.
- No public content or design asset was altered and no other prompts are authorized.

**Stopped after Prompt 26.**
