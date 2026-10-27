# Mystagogia — Design Token Contract (Prompt 02)

**Authority:** [Specification v1.2](./SPECIFICATION.md), [design system](./DESIGN_SYSTEM.md).  
**Source:** `src/styles/starwind.css` is the **only stylesheet importing Tailwind**; `src/styles/global.css` imports it as the sole app CSS entry. Starwind's configured stylesheet remains `src/styles/starwind.css`. This Prompt 02 contract is retained; Prompt 03 subsequently added self-hosted fonts documented in [FONTS.md](./FONTS.md).

## Approved palette — immutable source values

| Tailwind utility family | CSS theme token | Value |
| --- | --- | --- |
| `bg-charcoal`, `text-charcoal` | `--color-charcoal` | `#1A1A1A` |
| `bg-deep-brown` | `--color-deep-brown` | `#2B261E` |
| `bg-parchment` | `--color-parchment` | `#F5EEDC` |
| `bg-aged-paper` | `--color-aged-paper` | `#E0D4B8` |
| `text-antique-gold` | `--color-antique-gold` | `#C4A962` |
| `text-sage` | `--color-sage` | `#6B705C` |
| `text-oxide-red` | `--color-oxide-red` | `#7F2D2D` |

Do not alter the approved source hexes to force contrast. The semantic tones `--color-muted-ink: #615B4F`, `--color-sage-ink: #5D604D`, and `--color-border-paper: #B4A789` are **derived functional tones**. Gold is decorative on parchment and suitable for normal foreground text **on charcoal**, not as small text on parchment.

## Semantic utilities, state and Starwind mappings

Utilities inherit light mode from `:root` and the contextual overrides under `.dark`. Starwind aliases reference the same semantic variables; there is **no separate Starwind palette**.

| Intent | Tailwind token / utility | Light value or palette role | Dark value or palette role | Starwind variable / utility |
| --- | --- | --- | --- | --- |
| Page canvas | `--color-surface` / `bg-surface` | parchment | charcoal | `--background` / `bg-background` |
| Secondary panel | `--color-surface-secondary` / `bg-surface-secondary` | aged paper | deep brown | `--card` / `bg-card` |
| Inverse canvas | `--color-surface-inverse` | charcoal | parchment | Use explicit inverse pair for mastheads |
| Primary ink | `--color-text-primary`, `--color-ink` | charcoal | parchment | `--foreground`, `--card-foreground` |
| Muted readable ink | `--color-text-muted` | muted-ink | aged paper | `--muted-foreground` |
| Inverse ink | `--color-text-inverse` | parchment | charcoal | Match inverse surface explicitly |
| Decorative border | `--color-border-subtle` | border-paper | translucent aged paper | `--border`, `--sidebar-border` |
| Contrast border | `--color-border-strong` | oxide red | antique gold | `--input` |
| Gold ornament | `--color-accent-gold` | antique gold | antique gold | not a text color on parchment |
| Action accent | `--color-accent-interactive` | oxide red | antique gold | `--primary-accent`, `--secondary-accent` |
| Action accent ink | `--color-accent-interactive-foreground` | parchment | charcoal | pair with action accent |
| Primary button | `--color-button-primary` | charcoal | antique gold | `--primary`, `--sidebar-primary` |
| Primary button ink | `--color-button-primary-foreground` | parchment | charcoal | `--primary-foreground` |
| Secondary button | `--color-button-secondary` | aged paper | deep brown | `--secondary` |
| Secondary button ink | `--color-button-secondary-foreground` | charcoal | parchment | `--secondary-foreground` |
| Focus indicator | `--color-focus-ring` | oxide red | antique gold | `--outline`, `--sidebar-outline` |
| Quiet panel / accent | `--color-muted`, `--color-accent` | aged paper | deep brown | `--muted`, `--accent` |
| Popover | `--color-popover` | parchment | charcoal | `--popover` |
| Information / success | `--color-info`, `--color-success` | darkened sage with parchment ink | same accessible pair | `--info[-foreground]`, `--success[-foreground]` |
| Warning | `--color-warning` | antique gold / charcoal | same | `--warning[-foreground]` |
| Error | `--color-error` | oxide red / parchment | same | `--error[-foreground]` |
| Sidebar panel | `--color-sidebar` | aged paper | deep brown | `--sidebar-background`, additional sidebar roles map to the same primary/panel/ink variables |

Other Starwind tokens (`card-foreground`, `popover-foreground`, `accent-foreground`, `sidebar-primary-foreground`, `sidebar-accent-foreground`, and `sidebar-outline`) follow the corresponding text/button/focus roles, not invented colors. `--radius` and `--radius-{xs,sm,md,lg,xl,2xl,3xl}` are derived from `--radius-card`. Standard form input borders use `--border-strong`; use a visible focus outline in components.

## Typography, spacing and elevation

The typeface tokens are now backed by **self-hosted WOFF2 files** from Prompt 03. Refer to [FONTS.md](./FONTS.md) for license notices, loading, coverage, and fallback verification.

| Role | Token / utility | Defined behavior |
| --- | --- | --- |
| Display typography | `--font-display` / `font-display` | Cormorant Garamond → Georgia fallback |
| Reading typography | `--font-reading` / `font-reading` | Source Serif 4 → Georgia fallback |
| UI typography | `--font-interface` / `font-interface` | Inter → Segoe UI / Arial fallback |
| UI/body/lead/heading/display sizes | `--text-ui`, `--text-body`, `--text-lead`, `--text-heading`, `--text-display` | `text-*` utilities; line-heights encoded via `--text-*--line-height`; fluid where needed |
| Horizontal gutter | `--spacing-gutter` | `px-gutter`, fluid 20–40px |
| Section breathing room | `--spacing-section` | `py-section`, fluid 56–96px |
| Article rail spacing | `--spacing-article-gap` | `gap-article-gap` |
| Reading width | `--container-reading` | `max-w-reading` = 45rem / 720px |
| Wide content | `--container-wide` | `max-w-wide` = 80rem / 1280px |
| TOC/context rails | `--container-toc`, `--container-aside` | 190px / 240px layout references |
| Controls/cards/pills | `--radius-control`, `--radius-card`, `--radius-pill` | `rounded-control`, `rounded-card`, `rounded-pill` |
| Panel/elevated shadow | `--shadow-panel`, `--shadow-elevated` | `shadow-panel`, `shadow-elevated` |

## Contrast audit

Ratios below use the WCAG relative-luminance formula for **opaque swatches**. Normal-size text should meet **4.5:1**, large text **3:1**. Decorative borders are not a text alternative; input/control focus indicators require appropriate visibility.

| Text / foreground | Background | Contrast | Suitable use |
| --- | --- | --- | --- |
| Charcoal | Parchment | 15.04:1 | Main reading text (AAA) |
| Deep brown | Parchment | 12.97:1 | High-priority reading text (AAA) |
| Muted ink `#615B4F` | Parchment | 5.82:1 | Secondary text (AA) |
| Muted ink `#615B4F` | Aged paper | 4.58:1 | Secondary text on panels (AA) |
| Parchment | Charcoal | 15.04:1 | Dark-panel headings, main primary buttons (AAA) |
| Charcoal | Antique gold | 7.62:1 | Dark-mode primary button label (AAA) |
| Antique gold | Charcoal | 7.62:1 | Gold headings/links on dark hero (AAA) |
| Parchment | Oxide red | 7.84:1 | Interactive accent/error surfaces (AAA) |
| Parchment | Darkened sage `#5D604D` | 5.59:1 | Info/success text (AA) |
| Antique gold | Parchment | **1.97:1** | **Fail — decoration only; not normal text** |
| Raw sage `#6B705C` | Parchment | **4.43:1** | **Fail for normal text — use muted-ink or sage-ink** |

Contrast values reflect defined flat pairs, **not an audit of finished pages**. Visual and interaction checks occur after UI components exist. Do not ship decorative gold as small body text on parchment.

## Validation expectations

1. `npm ci`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=high` must pass.
2. Build an **ephemeral, non-committed** token probe that exercises utilities such as `bg-surface`, `text-text-primary`, `bg-primary`, `font-display`, `text-body`, `max-w-reading`, `rounded-card`, `shadow-panel`, and `gap-article-gap`, and inspect compiled CSS for their definitions.
3. Confirm no Tailwind import in `global.css` or default-blue Starwind palette in `starwind.css`.
4. No components, fonts, fake editorial content, or homepage redesigns are authorized by Prompt 02.
