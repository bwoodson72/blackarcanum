# Prompt 06A — Native page fade transitions

Mystagogia uses **native cross-document View Transitions** for same-origin page navigation, not Astro's `<ClientRouter />`, a SPA, or a click interceptor. `src/styles/page-transitions.css` supplies the single `@view-transition { navigation: auto; }` opt-in through the existing `src/styles/global.css` import. Every page using `BaseLayout.astro` includes that global stylesheet; no route or adapter changes are needed.

The browser takes a snapshot of the outgoing document and fades it out while the incoming root fades in, each over **250ms**. `::view-transition-old(root)` and `::view-transition-new(root)` have opacity-only keyframes; the header is part of the same transition, without a persistent-element effect. The `prefers-reduced-motion: reduce` override disables animations on root transition pseudo-elements and their group.

**Support and fallback:** Cross-document transitions only occur when *both* pages opt in, the navigation is same-origin and browser-eligible, and the browser supports the feature. Otherwise normal link navigation, history, keyboard/focus, page load, metadata and scroll semantics are unchanged. This deliberately trades universal animated support for minimal JavaScript and predictable editorial navigation. No `astro:transitions` import, extra package, navigation interception, or Vercel routing change is required. Cross-origin destinations do not animate.

**Interactive components:** The Prompt 06 mobile menu is a native modal `<dialog>`. Ordinary document navigation destroys its old DOM and initializes a fresh instance on the destination page. Test opening and closing the drawer after navigation, Tab focus confinement, Escape and Close-button focus return, plus browser Back/Forward. Do not persist a dialog or overlay between pages.

**Implementation checks:** `npm ci`, `npm run typecheck`, `npm run build`, `npm audit --audit-level=high`. In a temporary local test build, add **two non-indexed BaseLayout pages** and exercise same-origin user-click navigation with `pageswap`/`pagereveal` instrumentation; test Back/Forward, 375px/1440px widths, reduced-motion disabled animation and no horizontal overflow. Remove temporary test pages and workflow before review. Final site still has only its approved public routes.

**Technical references:** [Astro guide](https://docs.astro.build/en/guides/view-transitions/) · [MDN MPA view transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) · [MDN `@view-transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40view-transition).

## Prompt 06A verification record — October 27, 2026

GitHub Actions [run 40588791972](https://github.com/bwoodson72/blackarcanum/actions/runs/40588791972) used two temporary `noindex` pages, created **only in the test runner**; they are not repository routes. Results:

- `npm ci`, `npm run typecheck` (0 errors / 0 warnings), `npm run build` (3 static routes including the two temporary fixtures), `npm audit --audit-level=high` (0 vulnerabilities): **passed**.
- Compiled CSS: one `@view-transition` opt-in; a 250ms opacity-only crossfade (CSS minifier may serialize `250ms` as `.25s`); explicit root reduced-motion overrides; matched metadata and functioning internal fixture links: **passed**.
- Headless **Google Chrome** at 375px and 1440px: actual clicked A→B navigation emitted `pageswap` and `pagereveal` with `viewTransition: true`; destination `animationName: mystagogia-page-fade-in`; no horizontal overflow: **passed**.
- Browser Back/Forward from both viewports, fresh page initialization, and mobile menu after a transition (focus transfer, Tab containment, Escape, focus restoration, Close): **passed**.
- Chrome reduced-motion emulation: `prefers-reduced-motion: reduce` matched; both root snapshot pseudo-elements had `animationName: none`; ordinary page navigation continued: **passed**.

**Limitation:** This run exercised Chrome's supported native transition implementation. Safari, Firefox, and older/unsupported browsers were not available in the CI test runner, so their runtime fallback was not directly exercised. They receive standard document navigation by browser design; no guarantee is made that every browser animates.
