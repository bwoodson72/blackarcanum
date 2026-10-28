# Mystagogia — Astro Editorial Frontend

Mystagogia is an **in-development** Astro 7 editorial site exploring historical sources and contemporary esoteric practice. Its two collections are **the Library** (source-led research) and **the Grimoire** (methods and observations). The future merchandise Shop uses a separate Medusa backend and is **not enabled** in this repository. The public domain is **not approved**; the current Vercel URL is a development/preview deployment, **not a public launch**.

> **Release status:** NOT READY FOR PUBLIC LAUNCH. See [`docs/RELEASE_REVIEW.md`](docs/RELEASE_REVIEW.md) for the dated Prompt 31 pass/fail register and unresolved gates. The three retained MDX layout previews are now explicitly excluded from generated public routes; verify the deployed removal in current CI before release.

## Run locally

Required: Node.js **22.23.4+**, npm and the committed `package-lock.json`.

```sh
npm ci
npm run dev
npm run qa:fast      # 11 unit suites + newsletter mocks, Astro build, sample route checks, typecheck and npm audit
npm run build        # Astro production build, followed by guarded Pagefind post-build
npm run typecheck
npm run test:newsletter
```

The production build uses `@astrojs/vercel` with prerendered editorial pages and an on-demand newsletter API route. Static assets may live under `dist/client/` in the hybrid build; the Pagefind post-build step also prepares compatible QA paths and the Vercel static output. The index is **absent by design** when no finished, non-preview articles qualify.

## Current architecture

- `src/pages/index.astro`, `about.astro`, `library/`, `grimoire/`, `search/` — implemented editorial pages; `src/pages/api/newsletter.ts` — server-side Kit endpoint.
- `src/components/site/PageHero.astro` and `HeroAction.astro` — shared illustrated heroes and compact engraved actions; `NewsletterSection.astro` / `NewsletterForm.astro` — consent-aware homepage signup.
- `src/layouts/BaseLayout.astro` and `ArticleLayout.astro` — shared page, reading and metadata systems.
- `src/content/library` and `src/content/grimoire` — MDX content gated by status, date, preview flag and rights/source registries.
- `src/data/features.ts` and `src/data/topics.ts` — intentionally empty until specific editorial approval; no automatic 'latest' promotion.
- `src/lib/seo-config.mjs` — approval-gated canonicals and sitemap; `scripts/build-pagefind.mjs` — approved-article-only search index.
- `src/styles/starwind.css`, foundation and component styles — approved design tokens; `docs/design-references/` contains references, not production image sources.
- `docs/SPECIFICATION.md`, `docs/DESIGN_SYSTEM.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/NEWSLETTER.md`, `docs/SEO.md`, `docs/PAGEFIND.md`, `docs/SEARCH.md` — implementation standards.

## GitHub Actions and acceptance

Every `master` push runs `.github/workflows/editorial-quality.yml` (`npm ci` → `npm run qa:fast`). The most recent clean-install, build, typecheck and high/critical audit passed for `9399aaf` at [Editorial Quality run 40779280270](https://github.com/bwoodson72/blackarcanum/actions/runs/40779280270). That is **fast CI**, not release approval.

For complete responsive/keyboard/content acceptance, use **GitHub → Actions → Deep Regression → Run workflow → `all`**. The `articles` suite includes published/draft fixtures, real Pagefind search queries, SEO and screenshot checks. Other suites cover TOC, citations, related content and media. These runs are destructive **test fixtures**, not live editorial uploads. The post-review publication-gate change requests a complete `all` run via the commit's `[release-qa]` trigger. Review its actual status and screenshot artifacts before marking it passed; manual screen-reader checks remain pending. See [`docs/RELEASE_REVIEW.md`](docs/RELEASE_REVIEW.md).

## Environment configuration (Vercel)

Do not check `.env` files, real IDs or API keys into Git, screenshots, browser JS or build logs. Set secrets in Vercel **Project → Settings → Environment Variables**, scoped to the intended environment. Never use `PUBLIC_`/`VITE_` for server secrets.

| Name | Use | State |
| --- | --- | --- |
| `MYSTAGOGIA_SITE_URL` | Exact owner-approved `https://` production origin; enables public canonicals, sitemap and robots invitation | **Not approved / unset** |
| `KIT_V4_API_KEY` | Kit v4 server-only secret | **Not configured for Mystagogia** |
| `KIT_NEWSLETTER_FORM_ID` | Numeric ID of an existing Kit form | **Not configured** |
| `KIT_FORM_CONFIRMATION_VERIFIED` | Exact `true` only after double-opt-in form, approved sender, consent and privacy setup are verified | **Not verified / unset** |

`MYSTAGOGIA_SEO_TEST=1` is strictly for synthetic test-domain builds; never configure it in Vercel. Do not derive public canonicals from Vercel preview hostnames. With no approved domain, robots disallows crawlers and no sitemap or canonical is generated. With no verified Kit settings, the public newsletter remains visibly 'in preparation' and the server endpoint declines signup requests. Provider delivery and confirmation are **untested**; see `docs/NEWSLETTER.md`. The in-memory rate limiter is best-effort, not a distributed abuse defense.

## Unlaunched features and publication gates

Shop/Medusa/Printful/Stripe, a live newsletter signup, public domain, public SEO launch, and a finished article corpus are **not enabled**. No lead magnet, newsletter sender identity, store inventory, or author persona is implied. Search UI exists but correctly has no results when only previews are available. The three Tyche/Hekate/Hermes `preview: true` MDX files are retained for source review, but shared publication accessors now prevent them from generating page routes, archive cards or related links. They are not protected merely by `noindex`; real builds must confirm no preview files are deployed. The spec's contact/privacy/legal disclosure destinations are not yet implemented. Do not remove these blockers from the release checklist until actually resolved and retested.

## Controlled rollout and rollback

Work directly on **`master`** as previously approved; do not create feature branches. Vercel **automatically deploys** pushes to that branch. No separate manual deployment, domain change, promotion, or commerce action is authorized by Prompt 31. A documentation-only commit may still trigger the existing automatic Vercel build; that is not a launch.

Before public launch: (1) clear every `BLOCKED` item in `docs/RELEASE_REVIEW.md`; (2) run `npm ci`, `npm run qa:fast`, and a complete passing `Deep Regression → all` against the exact intended commit; (3) inspect saved 375/768/1024/1280/1440 screenshots and manual keyboard/screen-reader checks; (4) verify domain/robots/sitemap/Kit consent settings and only explicitly approved real content; (5) obtain explicit launch approval.

To roll back a **source change** in this master-only workflow, identify the last tested good SHA from Actions and use `git revert <bad-sha>` on `master`; verify the resulting CI run and Vercel deployment before calling it recovered. An **urgent Vercel platform rollback** can change automatic promotion behavior; use it only deliberately and restore normal auto-assignment afterward. Never use `git reset --hard` + forced push as the default rollback for this shared repo.

## Contribution and content safety

Public editorial content must use approved sources, owned/cleared imagery, accurate labels for personal observation, and explicit status/date gates. The owner's legal identity must not be inserted into public bylines, author schema, metadata or frontend markup. See `AGENTS.md` and the sequential `docs/IMPLEMENTATION_PROMPTS.md`. Execute one authorized prompt at a time.
