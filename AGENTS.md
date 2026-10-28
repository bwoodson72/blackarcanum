# Mystagogia — Coding Agent Instructions

This repository is the **Astro frontend** for Mystagogia (GitHub repository name: `blackarcanum`). It is a starter project, not a completed website. The Medusa commerce backend is a **separate project/repository**; do not add it here.

## Read before making changes
1. [docs/SPECIFICATION.md](docs/SPECIFICATION.md) — approved Mystagogia specification v1.2: **what** the project must accomplish.
2. [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — concise reference for tokens, type, responsive design and images.
3. [docs/IMPLEMENTATION_PROMPTS.md](docs/IMPLEMENTATION_PROMPTS.md) — **42** sequential tasks (v1.2, including Prompt 06A); only the task explicitly authorized now may be executed.
4. [docs/design-references/README.md](docs/design-references/README.md) — approved visual references and production-art restrictions. Inspect relevant image previews for visual tasks.
5. Read the existing project configuration and affected source files before edits.

**Execution rule:** Work on **only one explicitly assigned numbered prompt at a time**. The existence of later prompts is not permission to execute them. Do not proceed automatically, deploy, publish content, purchase services, create artwork, or enable payments without express authorization. After the assigned prompt, run relevant checks, summarize changes/results/limitations, and **STOP** for review.

## Current approved development workflow (supersedes older review/branch conventions)

- The owner has explicitly authorized **working directly on `master`** for the development phase. Do not create feature branches or pull requests. Build each prompt's complete changes before moving the branch reference; use one atomic commit directly on `master` when possible.
- Complete tests and self-review for the assigned prompt and stop. A later prompt requires a new user instruction.
- Development is local-first: **do not intentionally trigger a Vercel production deployment** during prompt work. GitHub's existing Vercel integration may independently attempt an automatic deployment when `master` moves; that integration should be disabled separately before it can be guaranteed no deployment will occur.
- Do not create test articles inside the committed public content collections. Integration fixtures belong only in isolated test runners and must restore the real content directories.

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
