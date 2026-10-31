# Mystagogia — Coding Agent Instructions

This repository is the **Astro frontend** for Mystagogia (GitHub repository name: `blackarcanum`). It is a starter project, not a completed website. The Medusa commerce backend is a **separate project/repository**; do not add it here.

## Read before making changes
1. [docs/SPECIFICATION.md](docs/SPECIFICATION.md) — approved Mystagogia specification v1.2: **what** the project must accomplish.
2. [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — concise reference for tokens, type, responsive design and images.
3. [docs/IMPLEMENTATION_PROMPTS.md](docs/IMPLEMENTATION_PROMPTS.md) — **42** sequential tasks (v1.2, including Prompt 06A); only the task explicitly authorized now may be executed.
3a. [docs/SERVICES_FRONTEND_IMPLEMENTATION.md](docs/SERVICES_FRONTEND_IMPLEMENTATION.md) — later-authorized **Services frontend-only** extension with scoped SF-01–SF-11 prompts. Read it when explicitly assigned an SF prompt. It supplements older editorial/site guidance but does not authorize Shop/Medusa, payments, generated images, fictional products/prices or public Services launch. Its existence does not authorize executing any SF prompt.
4. [docs/design-references/README.md](docs/design-references/README.md) — approved visual references and production-art restrictions. Inspect relevant image previews for visual tasks.
5. **Before researching, outlining, writing, editing, or preparing assets for articles, every AI agent must read both [docs/EDITORIAL_STYLE.md](docs/EDITORIAL_STYLE.md) and [docs/EDITORIAL_WORKFLOW.md](docs/EDITORIAL_WORKFLOW.md).** Apply the style standard to chat drafts as well as repository content, and follow the workflow for sources, MDX, imagery, validation, and publication. Existing articles are structural references, not permission to repeat their prose weaknesses. These documents grant no authorization to create content, download or generate images, publish, commit, push, or deploy; follow the current explicit assignment.
6. Read the existing project configuration and affected source files before edits.

**Execution rule:** Work on **only one explicitly assigned numbered prompt at a time**. The existence of later prompts is not permission to execute them. Do not proceed automatically, deploy, publish content, purchase services, create artwork, or enable payments without express authorization. After the assigned prompt, run relevant checks, summarize changes/results/limitations, and **STOP** for review.

## Current approved development workflow (supersedes older review/branch conventions)

- The owner has explicitly authorized **working directly on `master`** for the development phase. Do not create feature branches or pull requests. Build each prompt's complete changes before moving the branch reference; use one atomic commit directly on `master` when possible.
- Complete tests and self-review for the assigned prompt and stop. A later prompt requires a new user instruction.
- Keep Vercel's existing **automatic deployments from `master` enabled**, as the owner explicitly requested. Do not manually trigger duplicate deployments; verify the automatic deployment status after the atomic commit. The team previously encountered Hobby deployment-rate limits, so minimize unnecessary builds.
- **Use the optimized CI workflow:** `npm run qa:fast` (one combined unit process, one real Astro build, real content checks, typecheck, and high/critical audit) is the routine master-push gate. Do not make each small change run the repeatedly rebuilding fixture/browser suites. Those are preserved in the separately triggered `Deep Regression` workflow (manual suite selection and weekly full run). Run the relevant deep suite when changes materially affect reading layout, TOC, citations, cross-links, or media rendering.
- Keep implementation narrowly scoped. Read needed files in batches, assemble and review one complete diff, make one atomic master commit, and inspect the resulting CI/deployment result. Avoid staging many intermediate GitHub trees, speculative test harnesses, repeated Vercel deployments, and rapid-fire CI status polling. See [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md).
- Keep **CI-only** test articles out of committed content collections; isolated runner fixtures must restore the real directories. The owner separately authorized **three public Greek-deity layout previews** on October 28, 2026. Those are intentionally committed, labeled `preview: true`, visible for layout testing, and `noindex` until replaced or withdrawn. Do not mistake them for completed editorial scholarship or practitioner reports.

## Rules for all changes
- Follow the latest approved specification. If a prompt conflicts with the specification or existing code, explain the conflict; do not silently override either. Later explicit user approval supersedes stale written guidance; update docs when asked.
- Use Astro components by default; introduce Svelte/browser-side JS only for necessary interactions. Use **selective** Starwind controls when helpful, styled consistently with Mystagogia.
- **Design tokens are mandatory.** Centralize recurrent visual decisions using Tailwind CSS 4 `@theme` and semantic CSS variables; map Starwind to the same tokens. Do not scatter arbitrary hex values, font sizes, inline styles or copy long repeated class strings. Ordinary utility classes for layout and responsive behavior are fine.
- Preserve accessible semantic HTML, keyboard controls, focus, contrast, mobile-first layouts, reduced motion, and image performance.
- Keep Library and Grimoire editorial content in typed MDX collections; public topics/categories must be explicitly authorized. Historical claims and images require sound attribution; do not fabricate sources.
- Never expose the owner's legal name or identity in **public-facing** copy, bylines, page titles, structured data, image metadata or newsletter identity. Mystagogia is the final public brand; the domain is TBD.
- Do not assume fonts/assets are installed. Source, license/prepare and self-host them in the relevant implementation step. Mockups in the project workspace are references, not reusable production assets.
- Do not introduce courses/Academy, placeholder offerings, made-up product prices, or public drafts. Do not build the commerce phase before separate authorization.
- Keep changes tightly scoped and preserve unrelated work. Add only dependencies required by the assigned step.

## Verification and handoff
- Execute relevant build, type checks and tests (or explain blockers). Review responsive output for visual work.
- Report the prompt ID, files modified, commands/results, relevant commit/PR, unresolved issues, and confirmation that work stopped after that prompt.
- If required assets, credentials, references, or external APIs are missing, document the blocker; do not fabricate substitutes.

## Local development
The existing project uses Astro, TypeScript, Tailwind CSS 4, Starwind, MDX, Svelte and Vercel. Check `package.json` for installed versions and scripts; do not scaffold a replacement app. Initial validation and script cleanup belong to **Prompt 01**, not this documentation setup.
