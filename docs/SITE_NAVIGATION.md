# Prompt 06 — Responsive Site Navigation

The public header is `src/components/site/SiteHeader.astro`, included once by `BaseLayout.astro` before the main landmark. Its child components are `DesktopNavigation.astro` and `MobileNavigation.astro`. Shared link data lives in `src/lib/site-navigation.ts`.

**Only live links may appear.** At this stage, the homepage (`/`) is the only implemented public route. Therefore the Mystagogia wordmark links to Home; the mobile drawer has a Home link; and desktop section links and Search/Subscribe actions remain absent. Library, Grimoire, About, Shop, Search and Subscribe must be activated in this registry only after those routes and their functionality have been reviewed. Shop additionally requires a separate commerce launch decision. Never expose disabled placeholders, fake links, or routes to 404s.

The header follows the approved charcoal/antique-gold masthead and Cormorant Garamond/Inter roles. The wordmark is live text rather than the unapproved illustrative logo from the mockup; the menu and close icons are generic, original line SVGs. There are no added image assets or dependencies.

At viewports narrower than 1024px, a 44px mobile menu trigger opens a native modal `dialog`. The trigger uses `aria-haspopup="dialog"`, `aria-controls`, and synchronized `aria-expanded`; the panel is labelled and includes a native Close button. The browser's modal dialog provides background inertness, Tab focus confinement, and Escape cancellation. Closing via Escape, Close or the backdrop restores focus to the trigger; resizing into desktop also closes the panel. All interactive elements have visible keyboard focus rings and touch-friendly targets. At desktop widths the menu button disappears and approved active navigation would occupy the desktop bar.

**Tests:** `npm ci`, `npm run typecheck`, `npm run build`, `npm audit --audit-level=high`; screen widths 375/768/1024/1440; no horizontal scroll or visible desktop/mobile overlap; open, focus, Tab, Escape, close, resize, focus return; all served links point to real pages; no personal name in public output. Do not create filler routes or activate incomplete functionality to satisfy the header test.

Prompt 07 will address the footer and breadcrumbs. This prompt has not implemented them.
