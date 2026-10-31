// Real SF-06 detail routes, MDX, optional media and curated relations in isolation.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("details", 4195, 9255);
const rows = [
  { slug: "qa-detail-reading", sphere: "love", kind: "reading", availability: "open", mediaId: "qa-detail-image", relatedIds: ["qa-detail-spellwork", "qa-detail-draft", "qa-detail-review"] },
  { slug: "qa-detail-spellwork", sphere: "money", kind: "spellwork", availability: "unavailable" },
  { slug: "qa-detail-closed", sphere: "protection-uncrossing", kind: "reading", availability: "closed" },
  { slug: "qa-detail-uncurated", sphere: "love", kind: "reading", availability: "closed" },
  { slug: "qa-detail-draft", sphere: "love", kind: "reading", status: "draft" },
  { slug: "qa-detail-review", sphere: "love", kind: "reading", status: "review" },
].map((row, index) => ({
  title: `Synthetic service fixture ${index}`, summary: "Technical QA only. Not an actual service offering.",
  status: "published", approved: true, priceUsdCents: 12345 + index, scope: `SCOPE_${row.slug}`,
  inclusions: [`INCLUSION_${row.slug}`], process: [`PROCESS_ONE_${row.slug}`, `PROCESS_TWO_${row.slug}`],
  turnaround: `TIMING_${row.slug}`, clientRequirements: [`REQUIREMENTS_${row.slug}`], seoSummary: `SEO_${row.slug}`, ...row,
}));
function mdx(row, body = `## Fixture context\n\n**MDX description for ${row.slug}.**`) {
  return "---\n" + Object.entries(row).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n") + "\n---\n\n" + body + "\n";
}
function cleanBuild() {
  fs.rmSync(path.join(fixture, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(fixture, ".astro"), { recursive: true, force: true });
  build();
}
try {
  prepare();
  for (const file of ["services/[sphere].astro", "services/[sphere]/[slug].astro"]) {
    write("src/pages/" + file, fs.readFileSync(path.join(root, "src/pages", file), "utf8"));
  }
  write("src/pages/index.astro", '<!doctype html><html lang="en"><title>QA</title><h1>Technical fixtures only</h1></html>');
  write("src/pages/services/index.astro", `---
import ServicesHub from "../../components/services/ServicesHub.astro";
import { getPublishedServices } from "../../lib/services-public";
import { toPublishedSphereViews } from "../../lib/services-presentation";
const spheres = toPublishedSphereViews(await getPublishedServices());
---
<ServicesHub spheres={spheres} />`);
  const registryFile = path.join(fixture, "src/data/service-spheres.ts");
  fs.writeFileSync(registryFile, fs.readFileSync(registryFile, "utf8").replaceAll("visible: false, published: false", "visible: true, published: true") + '\n(approvedServiceMediaIds as string[]).push("qa-detail-image");\n');
  // Existing technical-media fixture convention: neutral pixels, never real artwork.
  write("src/assets/media/editorial/qa-detail-image.svg", '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480"><rect width="720" height="480" fill="black"/></svg>');
  fs.appendFileSync(path.join(fixture, "src/data/media.ts"), `\n(media as MediaRecord[]).push({ id: "qa-detail-image", sourceFile: "src/assets/media/editorial/qa-detail-image.svg", role: "editorial", origin: "modern-artwork", alt: "Neutral technical detail image fixture", decorative: false, rights: { status: "cleared", basis: "owned", license: "Technical fixture", creditLine: "Test only", evidenceNote: "Isolated neutral test pixels only" } });`);
  for (const row of rows) write(`src/content/services/${row.slug}.mdx`, mdx(row));
  cleanBuild();
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/love/qa-detail-reading/index.html")), true, "Approved offerings are normally browsable independently of commercial launch");
  write("src/data/services-release.ts", "// Isolated test copy only.\nexport const servicesPublicReleaseApproved: boolean = true;\n");
  const hubFile = path.join(fixture, "src/pages/services/index.astro");
  const hubSource = fs.readFileSync(hubFile, "utf8");
  fs.rmSync(hubFile);
  cleanBuild();
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/love/qa-detail-reading/index.html")), false, "Missing ancestor means no product pages");
  write("src/pages/services/index.astro", hubSource);
  cleanBuild();
  for (const row of rows) {
    const exists = fs.existsSync(path.join(fixture, `dist/services/${row.sphere}/${row.slug}/index.html`));
    assert.equal(exists, row.status === "published", `Publication gate: ${row.slug}`);
  }
  await startBrowser();
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const row of rows.slice(0, 3)) {
      await send("Page.navigate", { url: `${origin}/services/${row.sphere}/${row.slug}/` });
      await waitFor(() => evaluate(`document.readyState === "complete" && document.querySelector('[data-service-detail="${row.slug}"]') !== null`), "real detail route");
      await evaluate('document.fonts.ready.then(() => true)');
      const data = await evaluate(`(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: [...document.querySelectorAll('h1')].map(h=>h.textContent),
        title: document.title, description: document.querySelector('meta[name=description]').content,
        robots: document.querySelector('meta[name=robots]').content, canonical: !!document.querySelector('link[rel=canonical]'),
        ancestorLinks: [...document.querySelectorAll('[aria-label="Breadcrumb"] a')].map(a=>a.getAttribute('href')),
        current: document.querySelector('[aria-label="Breadcrumb"] [aria-current="page"]').textContent,
        kind: document.querySelector('[data-detail-kind]').textContent,
        price: document.querySelector('[data-detail-price]').textContent.trim(),
        scope: document.querySelector('#service-scope').parentElement.textContent,
        inclusions: document.querySelector('#service-inclusions').parentElement.textContent,
        process: [...document.querySelectorAll('#service-process + ol li')].map(n=>n.textContent),
        timing: document.querySelector('#service-turnaround').parentElement.textContent,
        requirements: document.querySelector('#service-requirements').parentElement.textContent,
        mdx: document.querySelector('[data-detail-description] strong')?.textContent,
        availability: document.querySelector('[data-detail-availability]').textContent,
        related: [...document.querySelectorAll('[data-related-services] a')].map(a=>a.getAttribute('href')),
        image: { count: document.querySelectorAll('.service-detail__media img').length, alt: document.querySelector('.service-detail__media img')?.alt,
          loaded: !!document.querySelector('.service-detail__media img')?.naturalWidth },
        controls: document.querySelectorAll('[data-service-detail] button, [data-service-detail] form, [data-service-detail] input, [data-service-detail] select').length,
        schema: document.querySelectorAll('script[type="application/ld+json"]').length,
        width: document.querySelector('.service-detail__body').getBoundingClientRect().width
      }))()`);
      assert.equal(data.overflow, false); assert.deepEqual(data.h1, [row.title]); assert.equal(data.current, row.title);
      assert.equal(data.title, `${row.title} — Services | Mystagogia`); assert.equal(data.description, row.seoSummary);
      assert.equal(data.robots, "noindex, nofollow"); assert.equal(data.canonical, false);
      assert.deepEqual(data.ancestorLinks, ["/services/", `/services/${row.sphere}/`]);
      assert.equal(data.kind, row.kind === "reading" ? "Reading" : "Spellwork");
      assert.equal(data.price, `$123.${String(row.priceUsdCents % 100).padStart(2, '0')} USD`);
      assert.ok(data.scope.includes(row.scope)); assert.ok(data.inclusions.includes(row.inclusions[0]));
      assert.deepEqual(data.process, row.process); assert.ok(data.timing.includes(row.turnaround));
      assert.ok(data.requirements.includes(row.clientRequirements[0])); assert.equal(data.mdx, `MDX description for ${row.slug}.`);
      assert.match(data.availability, /Purchasing is not yet available/);
      if (row.availability === "closed") assert.match(data.availability, /closed to new requests/);
      if (row.availability === "unavailable") assert.match(data.availability, /currently unavailable/);
      assert.equal(data.controls, 0); assert.equal(data.schema, 0); assert.ok(data.width <= 720);
      assert.deepEqual(data.related, row.slug === "qa-detail-reading" ? ["/services/money/qa-detail-spellwork/"] : []);
      assert.equal(data.image.count, row.mediaId ? 1 : 0);
      if (row.mediaId) { assert.equal(data.image.alt, "Neutral technical detail image fixture"); assert.equal(data.image.loaded, true); }
      for (const href of [...data.ancestorLinks, ...data.related]) assert.ok((await fetch(origin + href)).ok, "Live ancestor/related fixture link: " + href);
      await send("Emulation.setFocusEmulationEnabled", { enabled: true });
      await evaluate("document.querySelector('[aria-label=Breadcrumb] a').focus()");
      assert.ok(await evaluate("parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 3"));
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      assert.equal(await evaluate("document.activeElement.getAttribute('href')"), `/services/${row.sphere}/`);
      await capture(`services-detail-${row.kind}-${row.availability}-${width}.png`, width);
      if (data.related.length) {
        await evaluate("document.querySelector('[data-related-services] a').focus()");
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
        await waitFor(() => evaluate('location.pathname === "/services/money/qa-detail-spellwork/"'), "curated cross-sphere link");
      }
      console.log(`PASS: ${row.slug}@${width}: actual MDX, sections, price/type/metadata, breadcrumbs, optional media, curated related links, no fake checkout, keyboard/overflow`);
    }
  }
  // H1 guard is tested through the real MDX route, not a text-only approximation.
  write("src/content/services/qa-detail-reading.mdx", mdx(rows[0], "# Invalid second h1"));
  assert.throws(() => cleanBuild(), /Service MDX must not define h1/);
  console.log("PASS: normal visibility, missing ancestor/draft/review exclusion and duplicate-H1 build rejection; fixtures isolated");
} finally { await close(); }
