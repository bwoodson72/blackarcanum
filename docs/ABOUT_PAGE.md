# Mystagogia — About Page (Prompt 08)

## Route and purpose

`src/pages/about.astro` publishes `/about/` as a public, brand-centered introduction to Mystagogia. The page explains its intended editorial work, the Library's historical/source-led research, the Grimoire's practice/experiment/firsthand-observation writing, and the distinction between historical accounts, interpretations, and personal experiences. It also describes how readers will navigate to each section when those sections open.

This page intentionally does **not** claim Mystagogia has published articles that do not yet exist. It does not identify the owner, invent institutional credentials, use mockup artwork as production artwork, or imply a working email signup. There are no biography, contact, legal, or newsletter placeholders.

## Navigation and layout

- `src/lib/site-navigation.ts` activates only the real `/about/` route in desktop navigation and the mobile menu. The footer derives its About link from the same approved `primaryNavigation` registry; it retains Home separately.
- Library, Grimoire, Shop, Search, Subscribe, Contact, Privacy and Terms remain unlinked pending real routes and approved content.
- The About page uses `BaseLayout` metadata (`About | Mystagogia`, a truthful description, OG/Twitter text) without guessing a canonical site/domain or a social image. This top-level route needs no breadcrumbs.
- Charcoal hero, parchment reading surfaces, aged-paper comparison section and CSS ornament use the existing brand tokens and self-hosted typography. The two editorial path panels stack on mobile and form two columns from 768px.
- No new image assets, packages, services, scripts, or global styles.

## Prompt 08 acceptance record — October 27, 2026

**PASS — [GitHub Actions run 40591237470](https://github.com/bwoodson72/blackarcanum/actions/runs/40591237470)** (temporary workflow/QA fixture removed before PR review):

- `npm ci` completed.
- `npm run typecheck`: **0 errors, 0 warnings, 0 hints**.
- `npm run build` completed, producing `dist/about/index.html` and preserving `dist/index.html`.
- `npm audit --audit-level=high`: **0 vulnerabilities**.
- Built HTML assertions passed: About title/description, public indexability, Library/Grimoire distinction, working Home link, About in three navigation locations, active-page accessibility attribute, no unpublished links, and no owner identity.
- Actual headless Chrome checks on `/about/` at **375, 768, 1024, 1440px** passed: **no horizontal overflow**; reading text `17px / 17.92px / 18.56px / 19px`, Cormorant headings and Source Serif reading font; one-column panels at 375px and two columns at wider viewports; expected mobile/desktop navigation visibility; and three About links.
- Chrome also opened the mobile dialog at 375px, confirmed the About destination inside it, and closed the dialog.
- All checks ran against the temporary local build output. This is Chrome-only automated QA, not a cross-browser/manual visual approval for Firefox or Safari.

**No Prompt 09 work performed.**
