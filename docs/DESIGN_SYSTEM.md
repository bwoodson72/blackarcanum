# Mystagogia — Design System Reference

**Authority:** [Project specification v1.2](./SPECIFICATION.md), especially the approved visual direction, responsive architecture (§16), and token rules (§23). This guide is a concise implementation companion; if details diverge, follow the specification and flag the conflict.

## Identity and visual direction
- Final public brand: **Mystagogia**. Domain is not selected. Never expose the owner's real identity in public site output.
- Tone: classical esoteric editorial design—not novelty Halloween styling. Charcoal/near-black hero and navigation; warm parchment reading surfaces; restrained antique-gold ornaments.
- Approved mockups are retained in the separate Mystagogia project workspace. **They are visual references, not production-ready assets.** Do not invent historical provenance, use unlicensed artwork, or generate new art without explicit user approval of the image concept.

## Typography
| Role | Typeface | Use |
| --- | --- | --- |
| Display | Cormorant Garamond | Masthead, hero, editorial headings |
| Reading | Source Serif 4 | Long-form articles |
| Interface | Inter | Navigation, controls, metadata |

Fonts have **not** been installed. Source and self-host them during the appropriate execution prompt, including licensing, font-display behavior, subsets/weights as needed, fallback stacks, and layout-shift checks. Avoid committing unnecessary weights or external font dependencies.

## Approved starting palette
| Token role | Proposed color | Hex |
| --- | --- | --- |
| Dark masthead / charcoal | Charcoal | `#1A1A1A` |
| Dark secondary surface | Deep brown | `#2B261E` |
| Main reading surface | Parchment | `#F5EEDC` |
| Alternate warm surface | Aged paper | `#E0D4B8` |
| Ornament / accent | Antique gold | `#C4A962` |
| Supporting accent | Sage | `#6B705C` |
| Supporting accent | Oxide red | `#7F2D2D` |

These values are **initial references**, not blanket text colors. Verify accessible contrast, especially small gold text and interactive controls. Apply refinements through tokens, not scattered hardcoded values.

## Token discipline
- Use Tailwind CSS 4 `@theme` plus semantic CSS custom properties as the **single source of truth** for colors, fonts, type scale, spacing scales, borders, radii, shadows, and widths.
- Prefer semantic intent names: `--color-surface`, `--color-text-primary`, `--color-border-subtle`, `--color-accent-gold`, `--font-display`, `--font-reading`, `--font-interface`.
- Connect Starwind's variable mappings to these same semantic roles. **No separate default-blue visual system.**
- Do not duplicate lengthy utility strings across pages; use reusable component variants or shared styles where repetition is meaningful.
- Avoid recurring arbitrary values such as `bg-[#...]`, `text-[19px]`, and inline hex colors. Standard Tailwind utilities for layout/responsiveness are encouraged; isolated exceptions require an explanation.
- Changes to visual tokens should flow through the design system and be reviewed across homepage, article templates, and commerce UI.

## Responsive design baseline
- Mobile-first Tailwind breakpoints: base <640px, `sm` ≥640, `md` ≥768, `lg` ≥1024, `xl` ≥1280, `2xl` ≥1536.
- Test 375px, 768px, 1024px, 1280px and 1440px widths.
- Mobile uses a single reading column, compact menu drawer, stacked CTAs and featured content; no intrusive overlay while reading.
- Hub grids: 1/2/3 columns as space allows. Keep full three-column article layout **only when the reading column remains comfortable**, likely at ~1440px and above.
- Article reading width ~720px max; desktop TOC ~190px and context sidebar ~240px with sensible gaps. On smaller screens, collapsible ToC near the article top and related content below.
- Fluid type and spacing; article body ~17–18px mobile and ~19px desktop. Desktop reading measure roughly 65–75 characters; mobile horizontal gutters ~20px.
- Preserve characteristic ornamentation but simplify or remove interfering backgrounds on small screens; honor reduced-motion preferences.

## Editorial and media rules
- Astro-first components, minimal browser JavaScript, semantic and accessible markup.
- Historical/reference figures preserve full meaningful detail, with source attribution, rights metadata and optional enlargement. Card crops and decorative images may use constrained aspect ratios.
- No mandatory images in articles. No preset traditions/topics, fabricated research, invented product listings, or publication of drafts.
- Scope commerce styling to the approved apparel/merchandise concept when that phase is explicitly authorized.

## Implementation checks
Confirm tokens rather than hardcoded brand values; typography roles; responsive behavior; keyboard/focus support; contrast; no horizontal page overflow; and reduced-motion behavior. Record checks and changed files in the prompt handoff.
