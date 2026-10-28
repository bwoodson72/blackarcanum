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
  assert.ok(!html.includes("article-header__hero"), "No image placeholder for text-only samples");
  assert.ok((html.match(/aria-label="Article contents"/g) ?? []).length === 2,
    "Long demo content should render the mobile and desktop TOC variants");

  const headingIds = new Set(
    [...html.matchAll(/<h[23]\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]),
  );
  const anchors = [...new Set(
    [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
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
