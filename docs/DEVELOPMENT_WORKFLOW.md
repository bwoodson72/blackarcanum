# Development workflow — streamlined checks

**Approved October 28, 2026.** The site still deploys automatically from `master`. This change affects development verification only: it does not authorize a later numbered prompt, publication, artwork, or a commerce launch.

## Two levels of verification

**For every push to `master`:** `.github/workflows/editorial-quality.yml` runs **one** `npm ci` and `npm run qa:fast`. That single command runs the **same 11 unit suites** together in one Node process, then performs **one** actual Astro production build, checks the three published Greek-deity preview pages and rendered markup, runs Astro/TypeScript diagnostics, and checks high/critical dependency vulnerabilities. All existing individual `npm run test:*` commands remain available. The older baseline workflow runs on pull requests only; it no longer performs a duplicate build/typecheck on every push. Superseded master-push CI runs are automatically canceled.

**For meaningful cross-feature changes or weekly regression:** `.github/workflows/deep-regression.yml` keeps the full real-MDX fixture and headless Chrome acceptance suites, but they do **not** run after every routine code/content edit. Select **Actions → Deep Regression → Run workflow → suite** and choose `articles`, `toc`, `citations`, `related`, `media`, or `all`. A full run is also scheduled weekly on Sunday at 09:00 UTC. This is the same substantive acceptance coverage previously run on every push, not deleted tests.

A targeted deep run first builds and validates the true site, then runs just the requested fixture/browser scripts; the scripts continue to restore temporary content and image records. The deep suite may take longer because it deliberately rebuilds negative/positive fixtures. It is independent of Vercel's automatic deployments and must not be interpreted as an automatic rollout trigger.

## Which checks to run

- **Content text, metadata, copy or an already-approved image:** `npm run qa:fast`, plus a direct review of the affected live URL after the one normal Vercel deployment.
- **Shared article layout, heading/TOC behavior:** `npm run qa:fast`; select `articles` or `toc` from Deep Regression for a full responsive/keyboard acceptance.
- **Citation/bibliography/related-reading logic:** `npm run qa:fast`, plus the matching `citations` or `related` suite.
- **Media asset pipeline or responsive image component:** `npm run qa:fast`, plus `media` suite.
- **Multiple related foundational systems or a release review:** full `all` deep suite.

When a targeted visual change requires an immediate browser check, run its existing named test rather than inventing another full suite. Keep the current approved master-only workflow, no feature branches or PRs for ordinary implementation, no manual duplicate Vercel deployments.

## Operating rules

1. Read the affected files together; make one focused change and one atomic commit if possible. Do not build new fixture systems for every small feature when existing tests can be extended.
2. Keep the fast workflow fast and deterministic: **no CI-only MDX folder swapping, destructive test fixtures, Chrome process startup or extra site builds in the push path**.
3. Check the completed GitHub Actions result and Vercel production alias once per commit. Inspect failure logs **only on failure**; avoid tight status polling. Fix the underlying cause or request one targeted rerun for a demonstrably transient runner/browser failure.
4. When a prompt explicitly requires deeper accessibility/visual acceptance, execute its relevant deep checks before calling it verified; moving that coverage to an opt-in workflow is not permission to skip required tests.
5. The browser fixture scripts have previously shown intermittent Chrome startup problems. They are retained for the deep suite, not treated as blocking infrastructure on every text/image deployment.

**Previous push path:** two overlapping jobs, two production builds, 11 additional fixture steps (many rebuilding Astro), and five distinct browser checks. **New push path:** one job, one production build, 11 fast unit suites plus content/type/security checks; destructive fixture/browser suites only on demand or weekly. Runtime savings depend on runner load and dependencies; this is a structural reduction rather than a claimed benchmark.
