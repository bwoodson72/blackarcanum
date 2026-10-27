# Mystagogia — Foundation Component Contract (Prompt 05)

**Source:** `src/components/foundation/`, using central design tokens in `src/styles/starwind.css` and one action rule set in `src/styles/foundation.css`. The latter is imported once from `src/styles/global.css`. No additional Starwind components were installed, because ordinary CSS/HTML suffices for these non-complex primitives.

| Component | Typed props | Semantic behavior |
| --- | --- | --- |
| `Container.astro` | `width?: 'wide' \| 'reading' \| 'full'` (default `wide`), `as?: 'div' \| 'section' \| 'article' \| 'aside'` (default `div`), plus native HTML attributes such as `id`, `class` | Fluid `px-gutter`. Wide max width **80rem ≈ 1280px**, reading max width **45rem ≈ 720px**, full has no maximum but retains safe mobile gutters. Choose a semantic tag only when warranted. |
| `SectionHeading.astro` | **`title: string`**; optional `eyebrow`, `description`, `id`, `as?: 'h1' \| 'h2' \| 'h3'`, `align?: 'start' \| 'center'`, `ornament?: boolean`, `class` | Defaults to `h2` and start alignment. Omits absent optional text without empty elements. `id` attaches to heading for `aria-labelledby`. Uses the approved display/reading/UI faces and contrast-aware ink. |
| `Ornament.astro` | `variant?: 'rule' \| 'diamond'` (default `rule`), optional `class` | Pure CSS line/diamond geometry. Decorative `aria-hidden=true`. Does not use copyrighted imagery or introduce a brand mark. |
| `ActionLink.astro` | Native anchor attributes with **required `href`**, `variant?: 'primary' \| 'secondary'`, `size?: 'default' \| 'compact'` | Real `<a href>` navigation; opens external `target=_blank` safely with `rel=noopener noreferrer`. Does not pretend to be a button. |
| `ActionButton.astro` | Native button attributes, `type?: 'button' \| 'submit' \| 'reset'`, variants and sizes as above | Native `<button>`; default `type=button` to avoid accidental form submission. Supports native `disabled`, names, values and ARIA attributes. |

Action visuals use **one** `.foundation-action` base style and primary/secondary/size modifiers in `foundation.css`, rather than duplicated Tailwind strings or separate button colors. All colors and borders come from approved semantic roles; dark mode works through parent `.dark` token overrides. Keyboard focus-visible outline uses `--focus-ring` with a 3px outline and offset; hover/active are subtle and disabled buttons cannot be activated. Reduced-motion removes action transitions. Intrinsically responsive flex/padding and fluid gutters avoid horizontal overflow.

## Scope and verification

Prompt 05 does **not** place components on public pages. A **temporary non-indexed test route**, removed after CI, covers every Container width at 375/768/1280 CSS viewports, heading option variants, both Ornament variants, and primary/secondary anchor and button styles. It asserts the semantic elements and keyboard-focus states; retains the Prompt 04 skip-link behavior. Tests must pass `npm ci`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=high`. No screenshot or generated art substitutes for genuine approved artwork. Shared navigation belongs to Prompt 06, not here.
