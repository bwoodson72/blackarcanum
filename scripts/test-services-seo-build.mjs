// SF-10: actual Services routes, shared metadata/sitemap policy and editorial-only search.
// All product/profile records and the .test origin exist only in the isolated test copy.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
import { buildSearchIndex } from "./build-pagefind.mjs";
const qa = createServicesFixture("seo", 4199, 9259);
const { root, fixture, write, prepare, build, close } = qa;
const origin = "https://mystagogia.test";
const env = { MYSTAGOGIA_SITE_URL: origin, MYSTAGOGIA_SEO_TEST: "1" };
const base = { title: "Synthetic reading fixture", summary: "Synthetic summary for isolated tests.",
  sphere: "love", kind: "reading", status: "published", approved: true, priceUsdCents: 12345,
  scope: "Test scope", inclusions: ["Test inclusion"], process: ["Test process"],
  turnaround: "Test timing", clientRequirements: ["Test requirement"] };
const rows = [
  { ...base, slug: "qa-seo-service", seoSummary: "Specific metadata for this synthetic reading.", relatedIds: ["qa-seo-related", "qa-seo-draft", "qa-seo-review"] },
  { ...base, slug: "qa-seo-related", title: "Synthetic ritual fixture", sphere: "money", kind: "spellwork" },
  { ...base, slug: "qa-seo-draft", status: "draft", approved: false },
  { ...base, slug: "qa-seo-review", status: "review", approved: false },
];
const fact = { text: "Synthetic practitioner background for testing only.", approved: true, verified: true, verificationNote: "PRIVATE_REVIEW_NOTE" };
function profile(status, approved = true) {
  write("src/data/practitioner.ts", "export const practitionerProfile = " + JSON.stringify({ status, approved,
    summary: fact, biography: [fact], disciplines: [{ text: "UNVERIFIED_PRIVATE_CLAIM", approved: true, verified: false }] }) + ";\n");
}
function catalog(draftsOnly = false) {
  for (const row of rows) write(`src/content/services/${row.slug}.mdx`, "---\n" +
    Object.entries(draftsOnly ? { ...row, status: "draft", approved: false } : row)
      .map(([k,v]) => `${k}: ${JSON.stringify(v)}`).join("\n") + "\n---\n");
}
function rebuild(environment = env) {
  fs.rmSync(path.join(fixture, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(fixture, ".astro"), { recursive: true, force: true });
  build(environment);
}
const read = name => fs.readFileSync(path.join(fixture, "dist", name), "utf8");
const exists = name => fs.existsSync(path.join(fixture, "dist", name));
const routes = ["services/", "services/love/", "services/money/", "services/protection-uncrossing/", "services/love/qa-seo-service/", "services/money/qa-seo-related/"];
function invisibleRecords() {
  for (const slug of ["qa-seo-draft", "qa-seo-review"]) assert.equal(exists(`services/love/${slug}/index.html`), false);
  const sitemap = exists("sitemap-0.xml") ? read("sitemap-0.xml") : "";
  for (const route of routes) {
    const html = read(route + "index.html");
    assert.doesNotMatch(html, /qa-seo-draft\/|qa-seo-review\/|PRIVATE_REVIEW_NOTE|UNVERIFIED_PRIVATE_CLAIM/);
    assert.doesNotMatch(html, /application\/ld\+json|data-pagefind-body|article:published_time|og:image/);
    assert.match(html, /property="og:type" content="website"/);
  }
  assert.doesNotMatch(sitemap, /qa-seo-draft|qa-seo-review/);
  assert.deepEqual(buildSearchIndex(path.join(fixture, "dist")), [], "Pagefind remains editorial-only even for approved Services");
  assert.equal(exists("pagefind/pagefind.js"), false);
}
try {
  prepare();
  for (const file of ["index.astro", "services/[...index].astro", "services/[sphere].astro", "services/[sphere]/[slug].astro", "services/practitioner/[...page].astro", "robots.txt.ts"]) {
    write("src/pages/" + file, fs.readFileSync(path.join(root, "src/pages", file), "utf8"));
  }
  write("astro.config.mjs", `import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { configuredSiteUrl, isIndexableBuiltPage } from './src/lib/seo-config.mjs';
const site = configuredSiteUrl();
export default defineConfig({ cacheDir: './.astro/cache/', ...(site ? { site } : {}),
  vite: { plugins: [tailwindcss()] }, integrations: [mdx(), ...(site ? [sitemap({ filter: url => isIndexableBuiltPage(url) })] : [])] });`);
  write("src/pages/about/index.astro", `---
import BaseLayout from "../../layouts/BaseLayout.astro";
---
<BaseLayout title="Technical SEO control"><h1>Isolated SEO control</h1></BaseLayout>`);
  catalog(); profile("draft"); rebuild();
  for (const route of routes) {
    const html = read(route + "index.html");
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html, /rel="canonical"|property="og:url"/);
  }
  assert.equal(exists("services/practitioner/index.html"), false);
  assert.doesNotMatch(read("services/index.html"), /href="\/services\/practitioner\/"/);
  assert.doesNotMatch(read("sitemap-0.xml"), /\/services\//);
  invisibleRecords();
  console.log("PASS: ordinary browsing stays visible; indexing-unapproved Services and draft profile excluded from canonical/sitemap/search");

  // Index approval is simulated only inside this temporary copy.
  write("src/data/services-release.ts", "export const servicesPublicReleaseApproved: boolean = true;\n");
  profile("published"); rebuild();
  const allRoutes = [...routes, "services/practitioner/"];
  const titles = new Set();
  for (const route of allRoutes) {
    const html = read(route + "index.html");
    if (route === "services/protection-uncrossing/") {
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.doesNotMatch(html, /rel="canonical"|property="og:url"/);
      assert.ok(!read("sitemap-0.xml").includes(`<loc>${origin}/${route}</loc>`));
    } else {
      assert.doesNotMatch(html, /name="robots" content="noindex/);
      assert.ok(html.includes(`rel="canonical" href="${origin}/${route}"`));
      assert.ok(html.includes(`property="og:url" content="${origin}/${route}"`));
      assert.ok(read("sitemap-0.xml").includes(`<loc>${origin}/${route}</loc>`));
    }
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1]; assert.ok(title?.includes("Mystagogia")); titles.add(title);
    const description = /name="description" content="([^"]+)"/.exec(html)?.[1]; assert.ok(description?.trim());
    assert.ok(html.includes(`property="og:description" content="${description}"`));
    assert.ok(html.includes(`name="twitter:description" content="${description}"`));
    assert.doesNotMatch(html, /application\/ld\+json|PRIVATE_REVIEW_NOTE|UNVERIFIED_PRIVATE_CLAIM/);
  }
  assert.equal(titles.size, allRoutes.length, "Each Services route has a distinct title");
  assert.match(read("services/love/qa-seo-service/index.html"), /name="description" content="Specific metadata for this synthetic reading\."/);
  assert.match(read("services/love/qa-seo-service/index.html"), /href="\/services\/money\/qa-seo-related\/"/);
  assert.match(read("services/practitioner/index.html"), /name="description" content="Synthetic practitioner background for testing only\."/);
  assert.match(read("robots.txt"), /Allow: \/\nSitemap: https:\/\/mystagogia.test\/sitemap-index.xml/);
  invisibleRecords();
  console.log("PASS: approved-origin fixtures have distinct metadata, exact canonical/OG URLs, sitemap entries and curated published relations; no commerce/person schema");

  // No approved origin: ignore Vercel's deployment hostname for canonical metadata.
  rebuild({ MYSTAGOGIA_SITE_URL: "", MYSTAGOGIA_SEO_TEST: "0", VERCEL_URL: "synthetic-preview.vercel.app" });
  for (const route of allRoutes) {
    const html = read(route + "index.html");
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html, /rel="canonical"|property="og:url"|synthetic-preview\.vercel\.app/);
  }
  assert.equal(exists("sitemap-0.xml"), false);
  assert.match(read("robots.txt"), /Disallow: \//);
  invisibleRecords();
  console.log("PASS: Vercel hostname cannot supply canonical URLs; unconfigured-origin build remains noindex and robots-disallowed");

  catalog(true); profile("review", false); rebuild();
  for (const route of ["services/love/qa-seo-service/", "services/money/qa-seo-related/", "services/practitioner/"]) assert.equal(exists(route + "index.html"), false);
  for (const route of routes.slice(0,4)) {
    const html = read(route + "index.html"); assert.doesNotMatch(html, /qa-seo-|href="\/services\/practitioner\/"/);
    if (route !== "services/") {
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.ok(!read("sitemap-0.xml").includes(`<loc>${origin}/${route}</loc>`));
    }
  }
  assert.doesNotMatch(read("sitemap-0.xml"), /qa-seo-|\/services\/practitioner\//);
  assert.match(read("index.html"), /href="\/services\/"/);
  assert.deepEqual(buildSearchIndex(path.join(fixture, "dist")), []);
  console.log("PASS: draft-only catalog and unapproved profile have no routes, links, sitemap or search entries; normal Services navigation remains visible");
} finally { await close(); }
