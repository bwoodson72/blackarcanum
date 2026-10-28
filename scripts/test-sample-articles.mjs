// Regression checks for the three owner-approved public layout samples.
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

for (const collection of ["library", "grimoire"]) {
  const files = fs.readdirSync(path.join("src/content", collection))
    .filter((name) => name.endsWith(".mdx"));
  const slugs = expected
    .filter((entry) => entry.collection === collection)
    .map((entry) => entry.slug + ".mdx");
  assert.deepEqual(files.sort(), slugs.sort(),
    "Only the three explicitly authorized Greek-deity preview MDX files may be committed");
}

const archive = Object.fromEntries(["library", "grimoire"].map((section) => [
  section, fs.readFileSync(path.join("dist", section, "index.html"), "utf8"),
]));

for (const section of ["library", "grimoire"]) {
  const html = archive[section];
  assert.ok(html.includes('<meta name="robots" content="noindex, nofollow"'),
    "Preview-only archives must not be search indexed");
  assert.ok(html.includes("Layout previews"), "Archive must label samples");
  assert.ok(html.includes('href="/library/"') && html.includes('href="/grimoire/"'),
    "Site navigation should link to both active sections");
}

for (const { collection, slug, title } of expected) {
  const markdown = fs.readFileSync(path.join("src/content", collection, slug + ".mdx"), "utf8");
  const generated = path.join("dist", collection, slug, "index.html");
  assert.ok(fs.existsSync(generated), "Expected sample article page: " + generated);
  const html = fs.readFileSync(generated, "utf8");

  assert.match(markdown, /^preview: true$/m);
  assert.match(markdown, /^status: published$/m);
  assert.match(markdown, /^publishedAt: 2026-10-28$/m);
  assert.ok(!/^hero:/m.test(markdown), "No unapproved artwork or hero");
  assert.ok((markdown.match(/^#{2,3} /gm) ?? []).length >= 5,
    "Sample should exercise generated heading navigation");

  assert.ok(html.includes("<title>" + title + " | Mystagogia</title>"));
  assert.ok(html.includes('<meta name="robots" content="noindex, nofollow"'),
    "Every temporary sample article must be noindex");
  assert.ok(html.includes("LAYOUT PREVIEW"), "Article header must clearly label the sample");
  assert.ok(html.includes("Temporary sample content for design review"));
  if (slug === "tyche-fortune-and-the-city") {
    assert.match(markdown, /^featuredMediaId: tyche-fortune-city-illustration$/m,
      "Tyche explicitly selects one approved featured-image ID");
    assert.match(markdown, /^  - tyche-fortune-city-illustration$/m,
      "The featured image must also be declared in mediaIds");
    assert.ok(html.includes("article-header__hero--registered"),
      "Tyche receives the registered responsive article hero");
    assert.ok(html.includes('data-media-variant="hero"'),
      "The hero uses the Astro image renderer, not an unreviewed raw URL");
    assert.ok(html.includes("Modern AI-generated artistic interpretation of Tyche"),
      "The caption clearly distinguishes a modern depiction from an antique artifact");
    assert.ok(html.includes('type="image/avif"') && html.includes('type="image/webp"'),
      "The registered image has optimized modern responsive sources");
    assert.ok(html.includes("city-wall crown"),
      "Accessible alt text comes from the actual registry record");
    assert.ok(archive[collection].includes('data-media-variant="card"'),
      "The Library archive renders a cropped, optimized Tyche thumbnail");
  } else {
    assert.ok(!html.includes("article-header__hero"),
      "Hekate and Hermes remain text-only without empty image placeholders");
  }
  assert.ok((html.match(/aria-label="Article contents"/g) ?? []).length === 2,
    "Long demo content should render the mobile and desktop TOC variants");

  const headingIds = new Set(
    [...html.matchAll(/<h[23]\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]),
  );
  // Restrict to contents navigation; the site-wide #main-content skip link
  // is not a heading link and must never be treated as one.
  const tocMarkup = [...html.matchAll(/<nav\b[^>]*aria-label="Article contents"[^>]*>[\s\S]*?<\/nav>/g)]
    .map((match) => match[0]).join("\n");
  const anchors = [...new Set(
    [...tocMarkup.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
  )];
  assert.ok(headingIds.size >= 5 && anchors.length >= 5);
  for (const slugId of anchors) {
    assert.ok(headingIds.has(slugId), "TOC href must target real article heading: " + slugId);
  }
  assert.ok(archive[collection].includes('href="/' + collection + '/' + slug + '/"'),
    "Sample should appear as a working archive link");
  assert.ok(archive[collection].includes("Layout preview"), "Card should label the sample");
  console.log("PASS: " + collection + "/" + slug +
    " published preview, noindex, visible label, generated TOC, internal archive link");
}

console.log("PASS: three Greek-deity samples visible, clearly temporary and excluded from indexing");

// Prompt 25: honest homepage in the absence of any curated feature IDs.
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
assert.ok(homepage.includes("data-home-features-empty"),
  "Empty curated registry must not cause a newest-article fallback");
assert.ok(!homepage.includes('class="article-card'),
  "Uncurated layout previews must not appear as featured research");
assert.ok(!homepage.includes('href="/shop/"') && !homepage.includes('href="/newsletter/"'),
  "Unimplemented Shop and newsletter routes must not be exposed");
assert.ok(!/<form\b/.test(homepage), "No pretend subscription form");
assert.ok(homepage.includes("Newsletter in preparation"), "Newsletter slot is honest");
assert.ok(homepage.includes('name="robots" content="noindex, nofollow"'),
  "Homepage remains noindex until real editorial features are curated");
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
console.log("PASS: Prompt 25 homepage gateway, intentional empty-state, newsletter and noindex");

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
  ...expected.map(({ collection, slug }) => [
    "/" + collection + "/" + slug + "/",
    path.join("dist", collection, slug, "index.html"),
  ]),
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
  assert.ok(!/<a\b[^>]*href="\/(?:shop|search|newsletter|subscribe)\//.test(html),
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
console.log("PASS: Prompt 26 seven-route semantics, skip/nav/links, alt text, contrast and reduced motion");


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


// Prompt 28: current layout previews must not produce an accidental search index.
const {eligibleArticles,verifyMarkers}=await import("../scripts/build-pagefind.mjs");
assert.deepEqual(eligibleArticles(),[]);
assert.doesNotThrow(()=>verifyMarkers("dist",[]));
assert.equal(fs.existsSync("dist/pagefind"),false,
  "Do not index noneditorial pages when only noindex previews exist");
assert.equal(fs.existsSync(".vercel/output/static/pagefind"),false,
  "Preview deployments must not contain an old Pagefind index");
console.log("PASS: Pagefind empty-site indexing fails closed");


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
for(const [section, slug] of [["library","tyche-fortune-and-the-city"],
  ["grimoire","hermes-petition-template"]]) {
  const sample=fs.readFileSync("dist/"+section+"/"+slug+"/index.html","utf8");
  assert.ok(!sample.includes('data-pagefind-filter="collection:'),
    "Preview articles do not expose Pagefind filters");
}
console.log("PASS: Prompt 29 search page, navigation, noindex, scopes, no Shop, lazy browser API and safe snippets");
