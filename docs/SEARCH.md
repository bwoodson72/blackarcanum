# Prompt 29 — Editorial Search

The static `/search/` page reuses `PageHero` and is linked from desktop header and mobile drawer. The page is noindex and has no Shop tab.

The accessible GET search form has search input and radio scopes All, Library, and Grimoire. Its `q` and `scope` parameters are shareable URLs. Debounced typing uses history replacement; explicit submit and filter switches push navigation state; browser Back/Forward restore form state. `aria-live` announces result, empty, and error states.

Only `/search/` loads `src/scripts/search-page.ts`. The client checks `pagefind/indexed-routes.json` for a real index, then dynamically imports the Pagefind browser API. Indexed article markup provides `data-pagefind-filter=collection:library` or `collection:grimoire`, excluding previews. Search uses Pagefind's relevance-ranked result order, grouped by collection. Snippets and titles use `textContent` rather than HTML. Result links are restricted to same-origin Library/Grimoire slugs found in the index manifest, preventing drafts, previews, or dead links.

The current preview-only website has no Pagefind assets, so the interface describes the archive as being prepared rather than claiming nonexistent published results. The page provides ordinary collection links without JavaScript. No Shop search or other integrations have been enabled.

## Verification

`npm run qa:fast` checks the built search page, navigation, scopes, noindex and lazy script isolation. `Deep Regression → articles` runs `test:pagefind-build`, then `test:search-browser` against the same temporary generated fixture site. Chromium at 375px and 1440px checks real Pagefind matches, scope filters, URL state, keyboard Enter, no draft/review/preview results, and no overflow. Responsive screenshots are uploaded as `search-responsive-qa`. The fixture files are never committed.

**Stopped after Prompt 29.**
