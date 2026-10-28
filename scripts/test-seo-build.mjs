/**
 * Targeted integration acceptance: one build with an explicitly synthetic
 * .test origin and temporary published/draft fixtures, then restore both.
 * Never executes during a normal master push or production deployment.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";

const published = "src/content/library/qa-seo-publication.mdx";
const draft = "src/content/library/qa-seo-draft.mdx";
const origin = "https://mystagogia.test";
for (const path of [published, draft]) {
  assert.ok(!existsSync(path), "Refusing to overwrite existing editorial content: " + path);
}
const fixture = (slug, status) => [
  "---",
  "slug: " + slug,
  "title: Synthetic SEO Fixture",
  "description: This is temporary CI metadata, not a public Mystagogia article.",
  "status: " + status,
  ...(status === "published" ? ["publishedAt: 2026-10-28"] : []),
  "---",
  "",
  "Synthetic SEO integration fixture. Not real content.",
  "",
].join("\n");
try {
  // This synthetic article explicitly references existing rights-cleared artwork.
  const publication = fixture("qa-seo-publication", "published")
    .replace("status: published",
      "status: published\nmediaIds:\n  - tyche-fortune-city-illustration\nfeaturedMediaId: tyche-fortune-city-illustration");
  writeFileSync(published, publication);
  writeFileSync(draft, fixture("qa-seo-draft", "draft"));

  const result = spawnSync("npm", ["run", "build"], {
    encoding: "utf8", timeout: 180_000,
    env: {...process.env, MYSTAGOGIA_SITE_URL: origin, MYSTAGOGIA_SEO_TEST: "1"},
  });
  if (result.status !== 0) {
    throw new Error("SEO site-origin build failed:\n" +
      (result.stdout ?? "").slice(-5000) + "\n" + (result.stderr ?? "").slice(-5000));
  }
  const read = (path) => readFileSync("dist/" + path, "utf8");
  const index = read("sitemap-index.xml"), sitemap = read("sitemap-0.xml");
  assert.ok(index.includes(origin + "/sitemap-0.xml"));
  assert.ok(sitemap.includes(origin + "/about/"));
  assert.ok(sitemap.includes(origin + "/library/"));
  assert.ok(sitemap.includes(origin + "/library/qa-seo-publication/"));
  assert.ok(!sitemap.includes("qa-seo-draft") &&
    !sitemap.includes("tyche-fortune-and-the-city") &&
    !sitemap.includes("hekate-torches-and-crossroads") &&
    !sitemap.includes("hermes-petition-template"),
    "Sitemap must not expose unpublished/preview content");
  assert.ok(!sitemap.includes("<loc>" + origin + "/</loc>") &&
    !sitemap.includes("<loc>" + origin + "/grimoire/</loc>"),
    "Noindex homepage and preview-only Grimoire must be excluded");
  assert.ok(!existsSync("dist/library/qa-seo-draft/index.html"));
  assert.ok(!existsSync("dist/library/page/1/index.html"));
  const html = read("library/qa-seo-publication/index.html");
  assert.ok(html.includes('<link rel="canonical" href="' + origin +
    '/library/qa-seo-publication/"'));
  assert.ok(html.includes('property="og:type" content="article"'));
  assert.ok(html.includes('property="article:published_time"'));
  assert.ok(html.includes('property="og:image" content="' + origin + '/_astro/'),
    "Only the explicitly approved registered article hero may become an OG image");
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  const script = /<script type="application\/ld\+json">([^<]*)<\/script>/.exec(html);
  assert.ok(script, "Indexable Article needs JSON-LD");
  const data = JSON.parse(script[1]);
  assert.equal(data["@type"], "Article");
  assert.equal(data.headline, "Synthetic SEO Fixture");
  assert.equal(data.mainEntityOfPage["@id"], origin + "/library/qa-seo-publication/");
  assert.ok(data.datePublished.startsWith("2026-10-28"));
  assert.ok(data.image?.startsWith(origin + "/_astro/"),
    "Article schema uses the same approved, optimized actual image");
  assert.equal(data.author, undefined);
  assert.equal(data.publisher, undefined);
  for (const [collection, slug] of [
    ["library", "tyche-fortune-and-the-city"],
    ["library", "hekate-torches-and-crossroads"],
    ["grimoire", "hermes-petition-template"],
  ]) {
    assert.ok(!existsSync("dist/" + collection + "/" + slug + "/index.html"),
      "Preview MDX is not a public page, regardless of sitemap filtering");
  }
  const listing = read("library/index.html");
  assert.ok(listing.includes('<link rel="canonical" href="' + origin + '/library/"'));
  const robots = read("robots.txt");
  assert.ok(robots.includes("Allow: /") && robots.includes("Sitemap: " +
    origin + "/sitemap-index.xml"));
  console.log("PASS: approved-site build sitemap, robots, canonical, Article schema, preview/draft exclusion");
} finally {
  for (const path of [published, draft]) {
    if (existsSync(path)) unlinkSync(path);
  }
}
