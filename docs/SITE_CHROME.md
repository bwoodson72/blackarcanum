# Mystagogia — Footer and Breadcrumbs (Prompt 07)

## Site footer

`src/components/site/SiteFooter.astro` is rendered by `BaseLayout.astro` once, **after** the main landmark on every page. Its charcoal, antique-gold and aged-paper style follows the approved homepage/footer reference without copying illustrative artwork, social icons, or unverified navigation links. The footer uses the existing `Container` component, a stacked layout below 768px, and a two-column identity/navigation composition from 768px onward. A small factual brand description and the current copyright year are the only non-navigation copy. All colors/fonts/spacing reference the shared design tokens.

Navigation is data-driven from `src/lib/site-navigation.ts`: a working Home destination plus `primaryNavigation` when implemented routes are activated. `footerInformationLinks` stays empty until approved **real** contact/policy routes exist; the information column is omitted entirely in that state. Shop, newsletter, social networks, contact, privacy and terms links must **not** be added speculatively. No public author identity is exposed.

## Breadcrumbs

`src/components/site/Breadcrumbs.astro` exports the tuple type `BreadcrumbTrail`. Every trail must contain at least one ancestor `{ label, href }` with a root-relative href and a final current page `{ label }` without a link. The component emits `nav aria-label="Breadcrumb"`, `ol`, native ancestor links, purely decorative separators (`aria-hidden`), and `aria-current="page"` on the current item's text. The current page is not a self-link.

Use BaseLayout's optional `breadcrumbs={...}` prop **only on real nested pages with verified ancestor routes**. The existing temporary root homepage deliberately has no trail. Do not infer breadcrumb levels from URL segments, which may not correspond to published indexes. Future article templates should supply accurate trails from their actual collections when those routes exist. This step does not add `BreadcrumbList` structured data without real article routes.

## Accessibility and responsiveness

Footer link targets have a minimum height of 44px with an antique-gold 3px focus-visible outline and discernible labels. Its text color is parchment or aged paper on charcoal, not low-contrast tiny gold text on parchment. Breadcrumb links use contextual interactive ink on a light surface and a visible focus ring. The footer is part of the existing native page crossfade, with no additional animations.

**Acceptance checks:** `npm ci`, `npm run typecheck`, `npm run build`, `npm audit --audit-level=high`; inspect generated markup and nav landmarks; check links resolve to real routes; verify 375px/768px/1440px responsive column counts and no overflow; verify a temporary **noindex** nested-page fixture renders Home → parent → current and keyboard focus contrast in a real browser. Remove any temporary fixture and one-time test workflow before PR review. Do not implement Prompt 08.

## Prompt 07 validation record — October 27, 2026

[GitHub Actions run 40590247521](https://github.com/bwoodson72/blackarcanum/actions/runs/40590247521) — **passed**:

- `npm ci`; `npm run typecheck` (**0 errors / 0 warnings**); `npm run build`; `npm audit --audit-level=high` (**0 vulnerabilities**).
- Three generated routes tested: the existing `/` homepage and two **temporary, non-indexed** nested fixtures `/chrome-parent/` and `/chrome-parent/child/` created by CI only. They do not appear in the PR diff or production site.
- On all three pages, one header, one footer, one main landmark; no invented contact/privacy/terms links, no owner identity, and valid footer Home links. The homepage has no breadcrumbs; nested fixtures show ordered trails with an unlinked `aria-current="page"` ending.
- Headless Chrome: at **375px**, footer grid = **1 column**, no horizontal scroll; at **768px / 1440px**, footer grid = **2 columns**, no overflow.
- Real keyboard Tab reached the footer's Home link. Computed text contrast **15.04:1** against charcoal, focus ring **7.62:1** against charcoal, with a solid **3px** outline.
- Chrome confirmed that a breadcrumb ancestor URL is correctly focusable and points to an existing tested parent route.

The fixture routes and one-time workflow were not committed to the final implementation. Only Chrome was exercised; browser-specific visual QA on Firefox and Safari remains for later whole-site review.
