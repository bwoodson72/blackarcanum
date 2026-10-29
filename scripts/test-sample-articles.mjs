// Regression checks for retained layout previews and approved Library articles.
// Run against the real (non-fixture) Astro build before CI swaps collections.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const expected = [
  {
    collection: "library",
    slug: "tyche-fortune-and-the-city",
    title: "Tyche: Fortune and the City",
  },
  {
    collection: "library",
    slug: "hekate-torches-and-crossroads",
    title: "Hekate: Torches and Crossroads",
  },
  {
    collection: "grimoire",
    slug: "hermes-petition-template",
    title: "Hermes: A Modern Petition Template",
  },
];

// Preview MDX is retained for visual/editorial QA, but not emitted as routes.
// Finished deity studies are distinct reviewed, published entries.
const finished = [{ collection: "library", slug: "hekate-crossroads-protection",
  title: "Hekate: The Ancient Greek Goddess of Crossroads, Protection, and Magic" },
  { collection: "library", slug: "hermes-trade-trickery-safe-passage",
    title: "Hermes: The Greek God of Trade, Trickery, and Safe Passage" },
  { collection: "library", slug: "tyche-goddess-fortune-prosperity-fate",
    title: "Tyche: The Greek Goddess of Fortune, Prosperity, and Fate" },
  { collection: "library", slug: "ploutos-wealth-abundance-prosperity",
    title: "Ploutos: The Greek God of Wealth, Abundance, and Prosperity" }];
for (const collection of ["library", "grimoire"]) {
  const files = fs.readdirSync(path.join("src/content", collection))
    .filter((name) => name.endsWith(".mdx"));
  const slugs = [...expected, ...finished].filter((entry) => entry.collection === collection)
    .map((entry) => entry.slug + ".mdx");
  assert.deepEqual(files.sort(), slugs.sort(),
    "Only approved layout previews and completed articles may be committed");
}
const archive = Object.fromEntries(["library", "grimoire"].map((section) => [
  section, fs.readFileSync(path.join("dist", section, "index.html"), "utf8"),
]));
for (const section of ["library", "grimoire"]) {
  const html = archive[section];
  if (section === "grimoire") {
    assert.ok(html.includes('<meta name="robots" content="noindex, nofollow"') &&
      html.includes("The first entries are still to come."),
      "Empty Grimoire hub remains noindex and shows its genuine empty state");
  } else {
    assert.ok(finished.every(({slug,title}) =>
      html.includes('href="/library/' + slug + '/"') && html.includes(title)) &&
      !html.includes("The first studies are being prepared."),
      "Library archive displays the approved Greek deity studies instead of an empty state");
  }
  assert.ok(!html.includes("Layout previews"),
    "Preview section must not be exposed as an archive listing");
  assert.ok(html.includes('href="/library/"') && html.includes('href="/grimoire/"'),
    "Site navigation links to both archive gateways");
}
for (const { collection, slug, title } of expected) {
  const markdown = fs.readFileSync(path.join("src/content", collection, slug + ".mdx"), "utf8");
  assert.match(markdown, /^preview: true$/m);
  assert.match(markdown, /^status: published$/m);
  assert.match(markdown, /^publishedAt: 2026-10-28$/m);
  assert.ok(!/^hero:/m.test(markdown), "No unapproved hero artwork in preview MDX");
  assert.ok((markdown.match(/^#{2,3} /gm) ?? []).length >= 5,
    "Layout fixtures preserve heading/TOC test structure");
  for (const output of ["dist", "dist/client", ".vercel/output/static"]) {
    assert.ok(!fs.existsSync(path.join(output, collection, slug, "index.html")),
      "Private layout preview must never appear in deployed build output: " + output + "/" + slug);
  }
  assert.ok(!archive[collection].includes('href="/' + collection + '/' + slug + '/"') &&
    !archive[collection].includes(title),
    "Preview card and title must not leak through the archive: " + slug);
  if (slug === "tyche-fortune-and-the-city") {
    assert.match(markdown, /^featuredMediaId: tyche-fortune-city-illustration$/m,
      "Approved Tyche media mapping is preserved as source-only layout fixture");
  }
}
console.log("PASS: three retained layout MDX fixtures have no public routes, cards or search pages");
for (const { collection, slug, title } of finished) {
  const markdown = fs.readFileSync(path.join("src/content", collection, slug + ".mdx"), "utf8");
  assert.match(markdown, /^status: published$/m);
  assert.doesNotMatch(markdown, /^preview: true$/m);
  const htmlPath = path.join("dist", collection, slug, "index.html");
  assert.ok(fs.existsSync(htmlPath), "Finished article must generate a real HTML route");
  const html = fs.readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(title) && html.includes('data-pagefind-body'),
    "Finished article is readable and has the published search marker");
  assert.ok(html.includes("The Metropolitan Museum of Art") &&
    (slug === "hekate-crossroads-protection" ? html.includes("Carole Raddato") :
      (slug === "hermes-trade-trickery-safe-passage" ?
      html.includes("Sabouroff Painter") && html.includes("Hermes") :
      (slug === "tyche-goddess-fortune-prosperity-fate" ? html.includes("Incituna") && html.includes("Tyche") : html.includes("Bibi Saint-Pol") && html.includes("ArchaiOptix")))),
    "Historical reference image captions retain provenance and attribution");
  assert.ok(!html.includes("LAYOUT PREVIEW"), "Finished article must not present as a layout preview");
}
console.log("PASS: three finished Greek deity Library studies, references, and publication gates");

// Homepage now contains a deliberately curated finished Library feature.
const homepage = fs.readFileSync("dist/index.html", "utf8");
assert.ok(homepage.includes('id="home-title"') && homepage.includes("Practical Wisdom") &&
  homepage.includes("Living Tradition") && homepage.includes("Explore the crossroads of history"),
  "Homepage hero uses the approved mockup wording");
assert.equal((homepage.match(/<h1\b/g) ?? []).length, 1, "Homepage has a single H1");
for (const id of ["home-paths-heading", "home-research-heading", "home-practice-heading", "home-newsletter-heading"]) {
  assert.ok(homepage.includes('id="' + id + '"'), "Homepage section exists: " + id);
}
for (const href of ["/library/", "/grimoire/"]) {
  assert.ok(homepage.includes('href="' + href + '"'), "Homepage links to live archive: " + href);
}
assert.ok(!homepage.includes("data-home-features-empty") &&
  finished.every(({ slug }) => homepage.includes('href="/library/' + slug + '/"')) &&
  homepage.includes('class="article-card'),
  "Homepage shows all curated finished Library studies without an empty-state fallback");
for (const { collection, slug, title } of expected) {
  assert.ok(!homepage.includes('href="/' + collection + '/' + slug + '/"') &&
    !homepage.includes(title), "Layout previews must not be featured");
}
assert.ok(!homepage.includes('href="/shop/"') && !homepage.includes('href="/newsletter/"'),
  "Unimplemented Shop and newsletter routes must not be exposed");
assert.ok(homepage.includes('data-newsletter-form') && homepage.includes('data-newsletter-form hidden'),
  "Real Kit form is progressively enabled only after server config readiness");
assert.ok(homepage.includes('name="consent"') && homepage.includes('type="checkbox"'),
  "Explicit opt-in consent is required");
assert.ok(homepage.includes('name="email"') && homepage.includes('type="email"'),
  "Signup uses a labeled native email input");
assert.ok(homepage.includes("Newsletter in preparation"), "Unavailable newsletter state remains honest");
assert.ok(!homepage.includes('name="robots" content="noindex, nofollow"'),
  "Homepage is an article-curated route; robots.txt still prevents public discovery without an approved domain");
const heroLinks = [...homepage.matchAll(/<a class="hero-action" href="(\/(?:library|grimoire)\/)">([\s\S]*?)<\/a>/g)];
assert.deepEqual(heroLinks.map((link) => link[1]), ["/library/", "/grimoire/"],
  "Both compact homepage actions point to real archive destinations");
for (const [, href, body] of heroLinks) {
  assert.equal((body.match(/class="engraved-frame__corner /g) ?? []).length, 4,
    "Each reusable action renders four ornamental corners: " + href);
  assert.ok(body.includes('class="hero-action__icon"') && body.includes('aria-hidden="true"'),
    "Homepage decorative icon stays inline and hidden from assistive technology");
  assert.ok(body.includes('class="hero-action__label"') &&
    body.includes('class="hero-action__arrow"'),
    "Action retains real text and a decorative arrow");
}
const gatewayLinks = [...homepage.matchAll(/<a class="home-path__link" href="(\/(?:library|grimoire)\/)"[\s\S]*?<\/a>/g)];
assert.deepEqual(gatewayLinks.map((link) => link[1]), ["/library/", "/grimoire/"],
  "Each gateway image is a complete accessible link to its live archive");
for (const [body] of gatewayLinks) {
  assert.equal((body.match(/class="engraved-frame__corner /g) ?? []).length, 4,
    "Both image panels have four engraved gold corner ornaments");
  assert.ok(body.includes("home-path__tagline") && body.includes("home-path__arrow"),
    "Image panel titles and labels overlay the picture rather than a plain card");
}
for (const term of ["Historical Sources", "Academic Research", "Cultural Context",
  "Ritual Practice", "Techniques", "Personal Work"]) {
  assert.ok(homepage.includes(term), "Gateway descriptions match approved artwork: " + term);
}
assert.equal((homepage.match(/class="engraved-frame"/g) ?? []).length, 5,
  "Both hero links, both editorial image panels and the spotlight share etched frame");
assert.ok(!homepage.includes('class="home-path__body"><p'),
  "No detached parchment body beneath gateway artwork");
console.log("PASS: ornate hero CTA framing, real destinations, accessible icons and text");
console.log("PASS: Prompt 25 homepage gateways, curated Library feature, and disabled newsletter");

const assetPath = "public/images/homepage/mystagogia-editorial-atlas.avif";
assert.ok(fs.existsSync(assetPath), "Approved homepage artwork must ship with the site");
const imageBytes = fs.readFileSync(assetPath);
assert.ok(imageBytes.length > 300000 && imageBytes.subarray(4, 12).toString("latin1").startsWith("ftypavif"),
  "Full image atlas must be a valid nonempty AVIF payload");
assert.equal((homepage.match(/href="\/images\/homepage\/mystagogia-editorial-atlas\.avif"/g) ?? []).length, 4,
  "Hero, Library, Grimoire and spotlight must all use real raster artwork");
for (const slice of ['viewBox="0 0 2000 800"', 'viewBox="0 800 667 256"',
                    'viewBox="667 800 666 256"', 'viewBox="1333 800 667 256"']) {
  assert.ok(homepage.includes(slice), "The correct artwork-only viewport must render: " + slice);
}

assert.equal((homepage.match(/width="2000" height="1056"/g) ?? []).length, 4,
  "All four illustrations reference the true high-resolution atlas dimensions");
assert.ok(imageBytes.length < 1000000, "The sharp source stays below 1 MB");

assert.ok(!homepage.includes('home-path__books') && !homepage.includes('home-path__sigil') &&
  !homepage.includes('home-practice__seal') && !homepage.includes('home-hero__orbit'),
  "Decorative CSS placeholder shapes must no longer render");
console.log("PASS: full-bleed hero and all three real engraved artwork panels, no placeholders");
const homeCss = fs.readFileSync("src/styles/page-hero.css", "utf8");
assert.ok(homeCss.includes("min-height: clamp(32rem, 45vw, 43rem);"),
  "The approved homepage hero height is unchanged");
assert.ok(homeCss.includes("max-width: min(53vw, 51rem)") &&
  homeCss.includes("white-space: nowrap"),
  "Desktop homepage title and tagline get enough room to stay on one line");
assert.ok(homepage.includes("celestial-divider"), "Homepage uses the shared ornate celestial rule");
for (const collection of ["library", "grimoire"]) {
  const html = archive[collection];
  const name = collection === "library" ? "The Library" : "The Grimoire";
  assert.ok(html.includes('data-archive-hero="' + collection + '"'), 
    "Published hub uses shared editorial hero: " + collection);
  assert.ok(html.includes('class="celestial-divider"'),
    "Hub shares the homepage celestial ornament");
  assert.ok(html.includes('<h1>' + name + '</h1>'),
    "Hub retains exactly the expected accessible page title");
  assert.ok(html.includes('class="archive-hero__tagline"') &&
    html.includes('class="archive-hero__lead"'),
    "Hub uses matching headline/tagline and italic lead typography");
  const headingId = collection === "library" ? "library-listing-heading" : "grimoire-list-heading";
  assert.ok(html.includes('href="#' + headingId + '"'),
    "Framed archive CTA targets a real heading in the current page");
  assert.ok(html.includes('id="' + headingId + '"'),
    "Hub anchor destination exists in the real archive markup");
  assert.ok(html.includes('/images/homepage/mystagogia-editorial-atlas.avif'),
    "Hub reuses the approved full-bleed engraved artwork");
}
console.log("PASS: homepage height preserved; matching celestial/hub heroes and working archive links");


const headerSource = fs.readFileSync("src/components/site/SiteHeader.astro", "utf8");
assert.match(headerSource, /position:\s*sticky;/, "Site navigation must remain visible on scroll");
assert.match(headerSource, /top:\s*0;/, "Sticky header anchors to viewport top");
assert.match(headerSource, /scroll-padding-top:\s*5rem;/,
  "Anchor targets must not disappear behind sticky navigation");
for (const html of [homepage, archive.library, archive.grimoire]) {
  assert.ok(html.includes('class="site-header"'), "All main routes share persistent navigation");
}
console.log("PASS: persistent header and anchor offset are shared by all main routes");


// Prompt 26 fast QA: real generated pages, no extra build or browser process.
const qaPages = [
  ["/", "dist/index.html"],
  ["/about/", "dist/about/index.html"],
  ["/search/", "dist/search/index.html"],
  ["/library/", "dist/library/index.html"],
  ["/grimoire/", "dist/grimoire/index.html"],
];
const knownRoutes = new Set(qaPages.map(([url]) => url));
for (const [url, filename] of qaPages) {
  assert.ok(fs.existsSync(filename), "Missing public route " + url);
  const html = fs.readFileSync(filename, "utf8");
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, "One main landmark: " + url);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, "One H1: " + url);
  assert.ok(html.includes('id="main-content"') &&
    html.includes('href="#main-content"') && html.includes("Skip to content"),
    "Working skip-link target: " + url);
  assert.ok(html.includes('aria-label="Primary navigation"') &&
    html.includes('aria-label="Mobile primary navigation"') &&
    html.includes('aria-controls="mobile-navigation-dialog"') &&
    html.includes('aria-labelledby="mobile-navigation-title"'),
    "Desktop/mobile navigation semantics: " + url);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, "Duplicate element IDs: " + url);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    assert.match(img, /\balt="[^"]*"/, "Image missing alt: " + url);
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (!href || /^(https?:|mailto:|tel:)/.test(href)) continue;
    assert.ok(!href.startsWith("//"), "Protocol-relative link on " + url);
    const [page, fragment] = href.split("#", 2);
    if (page && page.startsWith("/")) {
      const pathname = page.split("?")[0];
      assert.ok(knownRoutes.has(pathname) ||
        fs.existsSync(path.join("dist", pathname.replace(/^\/+/, ""))),
        "Broken internal link: " + url + " -> " + href);
    }
    if (!page && fragment) {
      assert.ok(ids.includes(decodeURIComponent(fragment)), "Broken anchor " + url + " -> " + href);
    }
  }
  assert.ok(!/<a\b[^>]*href="\/(?:shop|newsletter|subscribe)\//.test(html),
    "No fabricated destination: " + url);
}
assert.ok(fs.readFileSync("dist/about/index.html","utf8")
  .includes("Both sections are available through the"), "About navigation copy must be accurate");

const colorTokens = fs.readFileSync("src/styles/starwind.css", "utf8");
const color = (name) => {
  const result = colorTokens.match(new RegExp("--color-" + name + ":[ ]*(#[0-9a-fA-F]{6})[ ]*;"));
  assert.ok(result, "Missing palette token " + name);
  return result[1];
};
const lum = (hex) => {
  const parts = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255)
    .map(v => v <= 0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4);
  return .2126*parts[0]+.7152*parts[1]+.0722*parts[2];
};
for(const [front, back] of [
  ["antique-gold","charcoal"], ["parchment","charcoal"],
  ["aged-paper","charcoal"], ["oxide-red","parchment"],
  ["sage-ink","parchment"], ["charcoal","parchment"],
]) {
  const a=lum(color(front)), b=lum(color(back));
  assert.ok((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)>=4.5,
    "WCAG AA token contrast failed: "+front+" / "+back);
}
const reduced=fs.readFileSync("src/styles/page-transitions.css","utf8");
assert.ok(reduced.includes("@media (prefers-reduced-motion: reduce)") &&
  reduced.includes("animation: none !important"), "Honor reduced motion");
console.log("PASS: Prompt 26 public-route semantics, skip/nav/links, alt text, contrast and reduced motion");


// Prompt 27: no fictional production site origin. Test configured URL rules
// directly and check generated HTML/robots in the existing single build.
const { configuredSiteUrl, isIndexableBuiltPage } =
  await import("../src/lib/seo-config.mjs");
assert.equal(configuredSiteUrl(undefined, false), undefined);
assert.equal(configuredSiteUrl("https://mystagogia.test", true), "https://mystagogia.test");
for (const bad of [
  "http://example.org", "https://blackarcanum.vercel.app",
  "https://example.com", "https://mystagogia.test",
  "https://fake.invalid", "https://example.org/extra/",
]) assert.throws(() => configuredSiteUrl(bad, false), /approved HTTPS origin/);
assert.ok(!fs.existsSync("dist/sitemap-index.xml") &&
  !fs.existsSync("dist/sitemap-0.xml"),
  "No public sitemap may be published without approved site configuration");
assert.ok(fs.readFileSync("dist/robots.txt","utf8").includes("Disallow: /"),
  "Unapproved preview domain remains undiscoverable to crawlers");
assert.equal(isIndexableBuiltPage("https://mystagogia.test/about/"), true,
  "About is an eligible real public page when a domain is approved");
for (const slug of expected) {
  assert.equal(isIndexableBuiltPage("https://mystagogia.test/" +
    slug.collection + "/" + slug.slug + "/"), false,
    "Noindex design preview must not enter a sitemap");
}
assert.equal(isIndexableBuiltPage("https://mystagogia.test/library/qa-seo-draft/"), false);
for (const [, filename] of qaPages) {
  const html = fs.readFileSync(filename,"utf8");
  assert.ok(!html.includes('rel="canonical"'), "No fabricated canonical URL");
  assert.ok(!html.includes('property="og:url"'), "No fictional OG origin");
  assert.ok(!html.includes('type="application/ld+json"'),
    "No public Article structured data without an approved origin");
}
console.log("PASS: Prompt 27 no-domain robots, no sitemap/canonical, preview exclusion, site URL validation");


// Prompt 28: only the finished Hekate article enters Pagefind; preview routes remain absent.
const {eligibleArticles,verifyMarkers}=await import("../scripts/build-pagefind.mjs");
const indexedRoutes = finished.map(({ slug }) => "/library/" + slug + "/");
assert.deepEqual(eligibleArticles(), indexedRoutes);
assert.doesNotThrow(()=>verifyMarkers("dist", indexedRoutes));
assert.deepEqual(JSON.parse(fs.readFileSync("dist/pagefind/indexed-routes.json", "utf8")),
  indexedRoutes, "Pagefind index contains only the approved article");
assert.ok(fs.existsSync("dist/pagefind/pagefind.js") &&
  fs.existsSync(".vercel/output/static/pagefind/pagefind.js"),
  "Finished article Pagefind index is bundled into Vercel output");
console.log("PASS: Pagefind indexes only published editorial content");


// Shared hero refactor: all four routes render the SAME prop-driven component.
const heroTemplates = [
  ["/", homepage, "home-hero", "Mystagogia"],
  ["/about/", fs.readFileSync("dist/about/index.html", "utf8"), "about-hero", "About Mystagogia"],
  ["/library/", archive.library, "library-hero", "The Library"],
  ["/grimoire/", archive.grimoire, "grimoire-hero", "The Grimoire"],
];
for (const [route, html, marker, heading] of heroTemplates) {
  assert.equal((html.match(/class="page-hero /g) ?? []).length, 1,
    "One shared prop-driven hero on " + route);
  assert.ok(html.includes(marker), "Hero retains route identity " + route);
  assert.ok(html.includes("<h1") && html.includes(heading),
    "Hero shows the route's own title: " + route);
  assert.ok(html.includes('class="celestial-divider"') &&
    html.includes('class="page-hero__art"') &&
    html.includes('class="page-hero__actions"'),
    "Every hero has shared ornament, full-bleed artwork and framed actions: " + route);
  assert.ok(html.includes('/images/homepage/mystagogia-editorial-atlas.avif'),
    "Every hero uses the approved original art: " + route);
}
const heroCss = fs.readFileSync("src/styles/page-hero.css", "utf8");
assert.ok(heroCss.includes("min-height: clamp(32rem, 45vw, 43rem)") &&
  heroCss.includes("padding-block: clamp(3.75rem, 7vw, 6rem)"),
  "Approved homepage hero height and spacing must not change");
assert.ok(!fs.existsSync("src/components/editorial/ArchiveHero.astro") &&
  !fs.existsSync("src/styles/archive-hero.css"),
  "Legacy duplicate archive hero implementation must be removed");
console.log("PASS: all four heroes use shared PageHero props and one stylesheet");

// Compact hero action component: same engraving, small icons and min-height
// on Home, About, Library and Grimoire. No per-route tall button class.
const heroActionCss = fs.readFileSync("src/styles/hero-action.css", "utf8");
const heroActionSource = fs.readFileSync("src/components/site/HeroAction.astro", "utf8");
const sharedHeroSource = fs.readFileSync("src/components/site/PageHero.astro", "utf8");
assert.ok(heroActionCss.includes("min-height: 3.25rem;") &&
  !heroActionCss.includes("min-height: 5rem;"),
  "Hero CTA is the approved compact 3.25rem version");
assert.ok(heroActionSource.includes('<a class="hero-action" href={href}>') &&
  heroActionSource.includes("<EngravedFrame />"),
  "Action markup and ornamental frame belong to one reusable component");
assert.ok(sharedHeroSource.includes("<HeroAction {...action} />") &&
  !sharedHeroSource.includes('class="home-button"') &&
  !sharedHeroSource.includes('class="archive-hero__action"'),
  "PageHero delegates all action rendering to the reusable component");
for (const [route, html] of heroTemplates) {
  const actions = [...html.matchAll(/<a class="hero-action" href="([^"]+)">([\s\S]*?)<\/a>/g)];
  const expectedCount = route === "/library/" || route === "/grimoire/" ? 1 : 2;
  assert.equal(actions.length, expectedCount, "All heroes render shared actions: " + route);
  for (const [, href, body] of actions) {
    assert.ok(href.startsWith("/") || href.startsWith("#"), "Action points to real route/anchor: " + route);
    assert.equal((body.match(/class="engraved-frame__corner /g) ?? []).length, 4,
      "Every hero action uses the exact same ornamental frame: " + route);
  }
}
console.log("PASS: one compact HeroAction component shared by all four routes");


// Prompt 29: search is a real navigation destination with no Shop tab.
const searchPage = fs.readFileSync("dist/search/index.html", "utf8");
assert.ok(searchPage.includes('name="robots" content="noindex, nofollow"'),
  "Search result pages must not appear in external search engines");
assert.ok(searchPage.includes('data-search-page') &&
  searchPage.includes('role="search"') &&
  searchPage.includes('data-search-input') &&
  searchPage.includes('data-search-results') &&
  searchPage.includes('aria-live="polite"'),
  "Accessible, shareable editorial search UI exists");
for(const scope of ['value="all"', 'value="library"', 'value="grimoire"'])
  assert.ok(searchPage.includes(scope), "Search scope exists: "+scope);
assert.ok(!searchPage.includes('value="shop"') &&
  !searchPage.includes('href="/shop/"'), "Shop search is not enabled");
assert.ok(homepage.includes('href="/search/"') &&
  archive.library.includes('href="/search/"') &&
  archive.grimoire.includes('href="/search/"'),
  "Search is reachable through shared global navigation");
const searchClient = fs.readFileSync("src/scripts/search-page.ts","utf8");
assert.ok(searchClient.includes('"/pagefind/pagefind.js"') &&
  searchClient.includes('"/pagefind/indexed-routes.json"'),
  "Search is lazy-loaded through static Pagefind API only");
assert.ok(searchClient.includes("document.createElement") &&
  !searchClient.includes(".innerHTML"), "Results are rendered as safe text, not HTML");
assert.ok(searchClient.includes("history[method]") &&
  searchClient.includes("popstate"), "Queries and scopes can be shared and navigated");
for (const { collection, slug } of expected) {
  assert.ok(!fs.existsSync(path.join("dist", collection, slug, "index.html")),
    "Unpublished preview must not enter Pagefind: " + slug);
}
console.log("PASS: Prompt 29 search page, navigation, noindex, scopes, no Shop, lazy browser API and safe snippets");
