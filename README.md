# Mystagogia — Astro Frontend

This repository (`blackarcanum`) contains the **Astro frontend starter** for **Mystagogia**, an editorial website with separate Library and Grimoire sections and a future Shop. The site has **not** been implemented yet. Mystagogia is the final public brand; the production domain is still undecided.

The Medusa v2 commerce backend is maintained as a **separate repository and deployment**. Do not add Medusa to this Astro project or create a monorepo.

## Prerequisites

- Node.js **22.23.4 or later**, consistent with `package.json`.
- npm (the project uses the committed npm lockfile).

## Local development

From the repository root:

```sh
npm ci
npm run dev
```

Astro's development server ordinarily runs at `http://localhost:4321`.

## Repeatable checks

```sh
npm ci            # Clean install using package-lock.json
npm run build     # Production Astro build
npm run typecheck # Astro diagnostics for .astro, TypeScript and framework files
npm run preview   # Preview local production build
```

The `typecheck` script uses `astro check` and requires the project's `@astrojs/check` development dependency. The lockfile must remain synchronized with `package.json`; use a clean `npm ci` when verifying changes.

## Current structure

- `src/pages/index.astro` — untouched starter homepage (not the final Mystagogia design).
- `src/layouts/Layout.astro` — starter HTML shell.
- `src/styles/starwind.css` — currently contains Starwind's initial theme.
- `starwind.config.json` — Starwind is initialized; no individual components are installed.
- `docs/SPECIFICATION.md` — approved product/design/architecture requirements.
- `docs/DESIGN_SYSTEM.md` — semantic token and typography standards.
- `docs/design-references/` — approved visual previews; not production art assets.
- `docs/IMPLEMENTATION_PROMPTS.md` — sequential, separately authorized development tasks.
- `AGENTS.md` — coding-agent execution rules.

## Implementation process

Execute exactly **one approved numbered prompt** at a time, verify the changes, submit for review, and stop. Do not treat future prompts as authorization to implement their features. The project uses Astro 7, TypeScript, Tailwind CSS 4, Starwind UI, MDX, and optional Svelte islands. Styling must use centralized semantic design tokens; fonts and production art have not yet been installed.

## Vercel deployment and dependency security

The current frontend is **fully static**. Vercel deploys static Astro sites without `@astrojs/vercel`; the adapter was removed to eliminate an unused vulnerable dependency tree. The Vercel project is already linked to the GitHub repository. No production domain has been chosen.

When a later authorized prompt introduces on-demand API routes or server rendering (for example, secure Kit form submission), reassess the **latest compatible, security-patched** Vercel adapter and rerun `npm ci`, `npm run build`, `npm run typecheck` and `npm audit --audit-level=high` before enabling those routes. Do **not** reinstall vulnerable adapter versions or rely on a forced downgrade.

## Environment configuration

No production domain or integration credentials are supplied for this starter. Do not commit secrets or invent service endpoints. Deployment configuration, newsletter API keys, commerce APIs, and other environment settings belong to their respective later prompts.

## Baseline validation

Prompt 01 establishes dependency reproducibility, a production build, and Astro diagnostics. The run results and any unresolved blockers should be recorded in the Prompt 01 review/PR; a README alone is **not** evidence that commands passed.
