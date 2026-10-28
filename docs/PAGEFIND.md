# Pagefind editorial indexing — Prompt 28

**Build order:** `npm run build` runs `astro build` then `node scripts/build-pagefind.mjs`. Pagefind CLI 1.5.2 and its platform-specific binaries are locked in `package.json` and `package-lock.json`. All Pagefind output is generated under `dist/pagefind/`, not committed to source. The search UI is explicitly out of scope.

## Indexable pages

Only finished, published, non-preview Library and Grimoire article pages can be indexed. The Content Collection's published-date/status checks determine which articles Astro builds. Explicit layout previews remain `noindex` and have no Pagefind marker. Draft/review entries are absent from output completely.

The shared ArticleLayout places `data-pagefind-body` on the article element only for a non-preview entry. The H1 is labeled as `data-pagefind-meta="title"` and the editorial summary as `description`. Article headings and MDX body remain within that region; the mobile TOC, references, related links and back-navigation are marked `data-pagefind-ignore`. The site header/footer, homepage, About, collection hubs, and any future commerce/legal routes do not carry indexing markers.

After Astro builds, `scripts/build-pagefind.mjs` walks the generated article HTML, checks that marker eligibility agrees with the rendered `noindex` metadata and verifies that no other route is marked. **If no finished article exists, the script deletes any old generated bundle and skips the Pagefind CLI**, avoiding the default whole-site indexing fallback. Otherwise the CLI indexes only explicitly marked pages and writes the static bundle with a deterministic `indexed-routes.json` audit list. Every manifest URL must point to generated article HTML.

## QA and safe rollout

Fast master CI verifies that the current preview-only production build does not produce a Pagefind index. `Deep Regression → articles` (or `all`) executes `npm run test:pagefind-build`: temporary published Library and Grimoire article fixtures with distinct known phrases, plus draft/review/preview fixtures with excluded phrases. It runs one real Astro+Pagefind build, checks the CLI output and manifest, confirms included known text and absence of unpublished routes, and removes all fixtures in a `finally` block. Actual interactive search queries are reserved for the later search UI/browser acceptance; this prompt creates no search page.

At the present editorial stage the default build's zero-result behavior is intentional and does not indicate a broken index. When finished articles are explicitly approved and published, Pagefind will generate a real bundle automatically.

**Stopped after Prompt 28.**
