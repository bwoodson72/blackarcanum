# Prompt 31 — Editorial frontend release review

**Reviewed:** 2026-10-28 (America/New_York)  
**Reviewed source SHA:** `9399aaf28282159b88cb545df4a8d8a755c043b1` (`master`)  
**Decision:** **NOT READY FOR A PUBLIC EDITORIAL LAUNCH.** The in-development frontend may remain at its existing Vercel preview/production URL without announcing a release.  
**Scope:** Read-only checks of source, workflow history, deployment metadata and configured variable *names*. README/report documentation updated only; no editorial content, live provider credentials, Shop code, domain settings or application runtime behavior changed. No manual deployment initiated.

## Evidence examined

- [Editorial Quality run 40779280270](https://github.com/bwoodson72/blackarcanum/actions/runs/40779280270), for `9399aaf`: **completed SUCCESS**. `Install locked dependencies once` (`npm ci`) succeeded; `Unit, published-content, build, typecheck and security checks` (`npm run qa:fast`) succeeded. `qa:fast` invokes existing unit suites + mocked newsletter tests, production build/Pagefind, sample route assertions, Astro typecheck and `npm audit --audit-level=high`. This is evidence that the **normal fast checks passed**, not evidence for every browser test.
- Vercel deployment corresponding to `9399aaf`: **READY** (`blackarcanum-pyiead4ao-brians-projects-ac1293a7.vercel.app`). This is an existing automated development deployment, **not** a launch approval.
- Latest observed `Deep Regression` run in GitHub history was [40750966023](https://github.com/bwoodson72/blackarcanum/actions/runs/40750966023), SUCCESS on **earlier SHA `5fe80cab…`** and triggered by an MDX/media push. It does **not** establish that the current search/newsletter implementation passed the full `all` suite.
- GitHub tree at reviewed SHA: **three** `src/content/**/*.mdx` records, each `status: published`, `preview: true`; no non-preview finished entries. `src/data/features.ts` and `src/data/topics.ts` are empty, intentionally. Search index is therefore empty by design.
- Vercel project's environment-variable *metadata* query returned **no configured variables** for the selected project (no decrypted values were requested). The latest repository docs also record no approved public domain, Kit form or sender. Treat live Kit readiness and actual confirmation delivery as **not verified**, rather than assuming a real newsletter.
- Public-identity spot-check of default-branch GitHub indexed source for the owner's given and family names returned no matches. Source spot-checks of `BaseLayout`, About, site footer and article layout show brand-based wording and no hardcoded author identity. **This is a limited source review, not a comprehensive provenance or data-leak proof.**

## Release checklist

| Gate | Result | Evidence / disposition |
| --- | --- | --- |
| Locked dependency install | **PASS** | Current Editorial Quality run: `npm ci`. |
| Astro production build and output | **PASS** | Current CI passed; eight prerendered public pages plus server Kit endpoint are expected. On-demand endpoint correctly shifts Astro output into hybrid mode. |
| Astro/TypeScript diagnostics | **PASS** | Included in successful `qa:fast`. |
| High/critical dependency security audit | **PASS** | Included in successful `qa:fast` (`npm audit --audit-level=high`); not a substitute for penetration testing. |
| Published-content status/date/media gates | **PASS (fast)** | `qa:units`, `test:samples`, schema and registry checks included in CI. Deep positive/negative fixture acceptance still required. |
| Hero and action consistency | **PASS (fast)** | Same `PageHero`/`HeroAction` used across Home, About and hubs; built route tests passed. Original homepage hero dimensions preserved. |
| Design tokens / representative WCAG palette contrasts | **PASS (static)** | Fast route tests compare selected solid-color pairs and verify reduced-motion rules; artwork-backed text and real focus accessibility require manual review. |
| SEO preview hygiene | **PASS (preview)** | No approved domain; robots disallows crawling, sitemap and public canonical omitted, previews/search have `noindex` where designated. **Not an approved SEO launch.** |
| Pagefind empty-site behavior | **PASS (preview)** | Normal build intentionally emits no searchable index from the three layout previews. |
| Newsletter secret separation / disabled state | **PASS (mocked)** | Server-only Kit key, readiness endpoint, consent/origin/rate-limit/honeypot checks and provider-error tests passed; public form remains hidden without credentials. |
| Public author identity / topic approval spot-check | **PASS (limited source review)** | No owner-name matches in inspected default-branch code search; approved topic/featured registries remain empty. Do not promote placeholder articles as finished. |
| Full responsive browser checks (375/768/1024/1280/1440) | **PENDING** | Tests exist but not executed against current SHA in `Deep Regression → all`; screenshot artifacts not reviewed. |
| Live Pagefind search, draft/review/preview exclusion and dead-link fixture | **PENDING** | `test:pagefind-build`, `test:search-browser` and SEO fixtures require current targeted deep run. |
| Article media, citations, related, TOC and keyboard regressions | **PENDING** | Deep `toc`, `citations`, `related`, `media` suites were not all run for reviewed SHA. |
| Manual responsive visual matching and accessible device checks | **PENDING** | Real screenshots/OS browser zoom, touch, NVDA/VoiceOver and decorative-art contrast not accepted. |
| Public demo/test content removed | **BLOCKED** | Three MDX records with `preview: true` are **still live as noindex article routes** (Tyche, Hekate, Hermes). `noindex` does not make a route private. Must remove or deny these public routes for launch and update route tests intentionally. |
| Finished owner-approved editorial corpus | **BLOCKED** | No finished non-preview articles or curated homepage features. Publishing placeholders would contradict editorial standards. |
| Production domain / SEO rollout | **BLOCKED** | No owner-approved `MYSTAGOGIA_SITE_URL`; no canonical/sitemap release or crawler invitation should be enabled. |
| Privacy, contact and applicable disclosure pages | **BLOCKED** | No finished `/privacy/` or `/contact/` routes; site footer hides unimplemented policy/contact links. Approve proper pages before audience collection or public release. |
| Live Kit consent + confirmation email and provider acceptance | **BLOCKED** | No verified Mystagogia form/sender/credentials. Unit tests are mocked; production provider delivery was not exercised. Confirm opt-in behavior and sender/privacy approval before setting `KIT_FORM_CONFIRMATION_VERIFIED=true`. |
| Commerce/shop readiness | **OUT OF SCOPE** | No Medusa/Printful/Stripe storefront, product catalog, or checkout activated. Requires separate authorization. |

## Remediation order and release acceptance

1. **Hide or remove public demo article routes** without deleting useful MDX fixtures arbitrarily. Reconcile the current fixture-based CI assertions with the new release publication gate. After the change, re-run fast and deep suites.
2. **Approve and publish substantive Library/Grimoire material**, then set explicit featured entry IDs; validate source provenance and cleared media. Do not fill the homepage by latest-article fallback.
3. **Finish privacy/contact/legal requirements** and approve newsletter sender, consent copy, Kit form and confirmation behavior. If signups are not launching, leave Kit disabled.
4. **Complete full Deep Regression → all on the intended SHA** and inspect the screenshot artifacts at five widths. Review keyboard, mobile drawer, scroll, focus, image contrast, reading layout and screen reader behavior manually.
5. **Approve a real domain** and separately validate canonical URLs, robots, sitemap, Pagefind production output and Kit API availability at the intended origin; do not silently enable crawler indexing.
6. Request **explicit release approval** after every blocker is closed. Release verification must be tied to the precise commit and domain; older CI does not grant launch approval.

## Deployment and rollback policy

The user-approved workflow is direct work on `master` with Vercel Git auto-deployment. This release-review prompt does **not** initiate a manual Vercel deploy, promotion, rollback, public domain assignment or content publishing. A docs-only commit to `master` can still trigger the **existing automatic** deployment; that is not a controlled public launch. Do not change this automation without authorization.

To undo a problematic application change, revert its commit on `master` and verify CI and the new Vercel deployment. For an emergency, use Vercel rollback deliberately, knowing it may suspend automatic alias assignment until restored. Record the tested SHA and the incident before claiming recovery.

**Stopped after Prompt 31.**

## Post-review hardening — preview route exclusion (2026-10-28)

**Source change:** Shared `getPublishedLibraryEntries`, `getPublishedGrimoireEntries`, single-entry accessors and the related-reading adapter now explicitly reject `preview: true` even when the MDX status is `published`. The Tyche, Hekate and Hermes fixtures remain in Git for development, but production builds no longer generate their HTML or archive-card URLs. This fixes the underlying *public accessibility* defect; `noindex` alone was insufficient. Normal hubs show their truthful empty states.

**Acceptance:** Updated the fast sample smoke tests to require all three preview routes to be absent from `dist`, `dist/client` and Vercel's static bundle. Updated SEO and Pagefind integration fixtures to test **no preview HTML at all**, while checking indexable published entries and unpublished draft/review exclusion. The same change arranges one automatic full Deep Regression run on the commit tagged `[release-qa]`. Record the completed current-SHA CI run and visually review screenshots before changing the corresponding **PENDING** entries to **PASS**. Prior Prompt 31 checklist is a dated snapshot at `9399aaf`, not a statement that the old preview exposure persists after this fix.

**Still blocked for a public editorial launch:** finished owner-approved content and curated features, a real approved domain, privacy/contact and applicable disclosures, and a separately approved live Kit form/sender/confirmation flow. Real-device accessibility/contrast review also remains required. The Shop is still out of scope.


**Deep run 40782109663 (2026-10-28):** All article-route and 375/768/1024/1280/1440 responsive checks passed; Pagefind published/hidden fixture indexing also passed. The run then failed in the search browser test because the Enter-key assertion inspected the previous completed result before the submitted URL had updated. The acceptance script now waits for URL state and excludes initial SSR status from its completion predicate. **The full suite must be rerun at the new SHA; this note does not claim search is cleared.**

**Deep run 40782465089:** Five-width article responsiveness and published/draft Pagefind index filtering again passed, but the stricter test showed Enter did not submit on the headless Chromium test input. This is treated as a functional keyboard acceptance gap. The search client now explicitly routes non-composing Enter keydowns to `form.requestSubmit()`, and the browser test sends a full native CDP key event sequence. Full `[release-qa]` regression is required on this next SHA before declaring keyboard acceptance complete.
