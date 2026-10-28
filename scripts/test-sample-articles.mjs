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
assert.ok(homepage.includes('id="home-title"') && homepage.includes("The Study and Practice of Hidden Arts"));
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
const heroLinks = [...homepage.matchAll(/<a class="home-button" href="(\/(?:library|grimoire)\/)">([\s\S]*?)<\/a>/g)];
assert.deepEqual(heroLinks.map((link) => link[1]), ["/library/", "/grimoire/"],
  "Ornate hero buttons are real links to the two published hubs");
for (const [, href, body] of heroLinks) {
  assert.equal((body.match(/class="home-button__corner /g) ?? []).length, 4,
    "Every engraved button has four decorative corner details");
  assert.ok(body.includes('class="home-button__icon"') && body.includes('aria-hidden="true"'),
    "Decorative book or leaf artwork is hidden from assistive technology");
  assert.ok(body.includes('class="home-button__label"') &&
    body.includes('class="home-button__arrow"'), "Button label and arrow are readable HTML");
}
console.log("PASS: ornate hero CTA framing, real destinations, accessible icons and text");
console.log("PASS: Prompt 25 homepage gateway, intentional empty-state, newsletter and noindex");

const assetPath = "public/images/homepage/mystagogia-editorial-atlas.avif";
assert.ok(fs.existsSync(assetPath), "Approved homepage artwork must ship with the site");
const imageBytes = fs.readFileSync(assetPath);
assert.ok(imageBytes.length > 20000 && imageBytes.subarray(4, 12).toString("latin1").startsWith("ftypavif"),
  "Full image atlas must be a valid nonempty AVIF payload");
assert.equal((homepage.match(/href="\/images\/homepage\/mystagogia-editorial-atlas\.avif"/g) ?? []).length, 4,
  "Hero, Library, Grimoire and spotlight must all use real raster artwork");
for (const slice of ['viewBox="0 0 1400 560"', 'viewBox="0 560 466 179"',
                    'viewBox="466 560 466 179"', 'viewBox="932 560 466 179"']) {
  assert.ok(homepage.includes(slice), "The correct artwork-only viewport must render: " + slice);
}
assert.ok(!homepage.includes('home-path__books') && !homepage.includes('home-path__sigil') &&
  !homepage.includes('home-practice__seal') && !homepage.includes('home-hero__orbit'),
  "Decorative CSS placeholder shapes must no longer render");
console.log("PASS: full-bleed hero and all three real engraved artwork panels, no placeholders");
