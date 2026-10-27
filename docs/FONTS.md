# Mystagogia — Self-Hosted Font Inventory (Prompt 03)

**Status:** Three open-license font families vendored as WOFF2 in `public/fonts/`. Original full OFL license texts are preserved under `docs/font-licenses/`. The original source font packages are **not** runtime npm dependencies. This document records the specific Fontsource variable builds and their upstream Google Fonts origins.

| Role | Family | Vendored Fontsource package version | Weight range | Selected styles & subsets | Fallback |
| --- | --- | --- | --- | --- | --- |
| Display headings | Cormorant Garamond | `@fontsource-variable/cormorant-garamond@5.3.0` | 300–700 | Normal + italic; Latin, Latin Extended | Georgia → Times New Roman → serif |
| Editorial reading | Source Serif 4 | `@fontsource-variable/source-serif-4@5.3.1` | 200–900 | Normal + italic; Latin, Latin Extended, Greek | Georgia → Times New Roman → serif |
| UI/navigation/forms | Inter | `@fontsource-variable/inter@5.3.0` | 100–900 | Normal; Latin, Latin Extended, Greek, Greek Extended | Segoe UI → Arial → sans-serif |

**Provenance and rights** (all distributed under the [SIL Open Font License 1.1](https://openfontlicense.org/)):
- Cormorant Garamond: Google Fonts upstream `https://github.com/google/fonts/tree/main/ofl/cormorantgaramond`; original project `https://github.com/CatharsisFonts/Cormorant`. Exact copy of the package's license: [cormorant-garamond-OFL.txt](./font-licenses/cormorant-garamond-OFL.txt).
- Source Serif 4: Google Fonts upstream `https://github.com/google/fonts/tree/main/ofl/sourceserif4`; original project `https://github.com/adobe-fonts/source-serif`. Full notice: [source-serif-4-OFL.txt](./font-licenses/source-serif-4-OFL.txt).
- Inter: Google Fonts upstream `https://github.com/google/fonts/tree/main/ofl/inter`; original project `https://github.com/rsms/inter`. Full notice: [inter-OFL.txt](./font-licenses/inter-OFL.txt).
- Webfont distribution and generated Latin/Greek WOFF2 subsets: `https://github.com/fontsource/font-files` / `https://fontsource.org`. The source binaries were vendored from the **pinned** npm packages above via a one-time GitHub Action; no `@fontsource` package is required by the application.

## Files and selection

`public/fonts/` contains **14 files**, totaling approximately **526 KiB** at rest. They use WOFF2 only (variable `wght` font axis): two Cormorant styles × 2 subsets (4 files); two Source Serif styles × 3 subsets (6); one Inter style × 4 subsets (4). Each file was verified to have a `wOF2` header. Explicit `unicode-range` rules select subsets on demand rather than downloading them all. Other scripts and absent font styles fall back to the system stack. Greek Extended is present for Inter; Source Serif's separate `greek-ext` build was not supplied by this selected package.

## CSS usage

`src/styles/global.css` loads **`starwind.css` first, then `fonts.css`**. Font files resolve locally from `/fonts/*.woff2`; every `@font-face` has `font-display: swap`. The single Tailwind import still lives only in `starwind.css`.

- Headings (`h1`–`h6`): `font-family: var(--font-display)`. Initial heading fluid sizes use the existing Prompt 02 tokens; component-specific headings may later override size without overriding family.
- Article reading: opt in with `class="reading-content"` or `data-reading-content`. This deliberately **does not** apply the reading face globally to every semantic `<article>` (which will also be used for cards).
- Body, navigation, buttons, labels, inputs, selects and textareas: `var(--font-interface)`; body already inherits the interface role from Prompt 02.
- To request a font in a component: Tailwind `font-display`, `font-reading`, or `font-interface` utilities from the existing `@theme` definitions.

The shell preloads only the main **Latin Inter** and **Latin Cormorant Garamond** faces, because they are part of the normal interface and heading experience; Source Serif is loaded only on pages that render editorial reading. Font preloading may be refined after real templates and performance profiles exist. If users disable downloads or a WOFF2 file fails, local serif/sans fallbacks preserve readability. `font-display: swap` avoids invisible text at the cost of a possible brief metric change; test layout shift with actual article layouts in later visual prompts.

## Validation requirements

Run `npm ci`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=high`. Verify each `url("/fonts/...")` exists locally and that no `fonts.googleapis.com`, `fonts.gstatic.com`, or other font CDN dependency appears in built CSS/HTML. Test a **temporary, uncommitted** page with a heading, an editorial reading block and a button, inspect resulting CSS font-family declarations, verify local WOFF2 served with status 200, and check font loading in a browser where available. The starter's page copy and layout must not be changed to manufacture a visual screenshot.
