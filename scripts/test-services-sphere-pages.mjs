// Exercise the actual SF-04 getStaticPaths route with temporary MDX products.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("sphere-pages", 4194, 9254);
const ids = ["love", "money", "protection-uncrossing"];
const labels = ["Love & Relationships", "Money & Prosperity", "Protection & Uncrossing"];
function cleanBuild() {
  fs.rmSync(path.join(fixture, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(fixture, ".astro"), { recursive: true, force: true });
  build();
}
function products() {
  for (const sphere of ids) {
    for (const [index, kind] of ["reading", "reading", "spellwork", "draft", "review"].entries()) {
      const data = { slug: `qa-${sphere}-${index}`, title: `Synthetic ${kind} fixture ${index}`, summary: "Technical QA only. This is not an actual offering.",
        sphere, kind: kind === "spellwork" ? "spellwork" : "reading", status: ["draft", "review"].includes(kind) ? kind : "published",
        approved: true, priceUsdCents: 12345 + index, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] };
      write(`src/content/services/${data.slug}.mdx`, "---\n" + Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n") + "\n---\n\nIsolated synthetic test content.\n");
    }
  }
}
try {
  prepare();
  write("src/pages/services/[sphere].astro", fs.readFileSync(path.join(root, "src/pages/services/[sphere].astro"), "utf8"));
  write("src/pages/index.astro", '<!doctype html><html lang="en"><title>QA</title><h1>Isolated sphere-route QA</h1></html>');
  write("src/pages/services/index.astro", `---
import ServicesHub from "../../components/services/ServicesHub.astro";
import { getPublishedServices } from "../../lib/services-public";
import { toPublishedSphereViews } from "../../lib/services-presentation";
const spheres = toPublishedSphereViews(await getPublishedServices());
---
<ServicesHub spheres={spheres} />`);
  // SF-06 detail templates are NOT implemented here; route targets are test-only stubs.
  write("src/pages/services/[sphere]/[slug].astro", `---
import { getPublishedServices } from "../../../lib/services-public";
export const getStaticPaths = async () => (await getPublishedServices()).map(p => ({ params: { sphere: p.sphere, slug: p.id }, props: { title: p.title } }));
const { title } = Astro.props;
---
<!doctype html><html lang="en"><head><meta name="robots" content="noindex, nofollow"/><title>Technical destination</title></head><body><h1>{title}</h1></body></html>`);
  const registryFile = path.join(fixture, "src/data/service-spheres.ts");
  const enabled = fs.readFileSync(registryFile, "utf8").replaceAll("visible: false, published: false", "visible: true, published: true");
  fs.writeFileSync(registryFile, enabled);
  products();
  // Populated catalog does not imply permission to release Services.
  cleanBuild();
  for (const sphere of ids) assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}/index.html`)), false, "Unapproved release excludes sphere route");
  write("src/data/services-release.ts", "// Isolated test copy only.\nexport const servicesPublicReleaseApproved: boolean = true;\n");
  const detailFile = path.join(fixture, "src/pages/services/[sphere]/[slug].astro");
  const detailSource = fs.readFileSync(detailFile, "utf8");
  fs.rmSync(detailFile);
  cleanBuild();
  for (const sphere of ids) assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}/index.html`)), false, "No sphere links to absent detail template");
  write("src/pages/services/[sphere]/[slug].astro", detailSource);
  const hubFile = path.join(fixture, "src/pages/services/index.astro");
  const hubSource = fs.readFileSync(hubFile, "utf8");
  fs.rmSync(hubFile);
  cleanBuild();
  for (const sphere of ids) assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}/index.html`)), false, "No sphere links to absent hub");
  write("src/pages/services/index.astro", hubSource);
  cleanBuild();
  for (const sphere of ids) {
    const html = fs.readFileSync(path.join(fixture, `dist/services/${sphere}/index.html`), "utf8");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/data-service-card[ >]/g) || []).length, 3);
    assert.doesNotMatch(html, /qa-[a-z-]+-[34]\//, "Draft/review links omitted");
    assert.match(html, /noindex, nofollow/);
    assert.doesNotMatch(html, /<form\b|<input\b|application\/ld\+json|rel="canonical"/);
  }
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/future")), false);
  await startBrowser();
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const [index, sphere] of ids.entries()) {
      await send("Page.navigate", { url: `${origin}/services/${sphere}/` });
      await waitFor(() => evaluate(`document.readyState === "complete" && document.querySelector('[data-services-sphere="${sphere}"]') !== null`), "sphere route");
      await evaluate('document.fonts.ready.then(() => true)');
      const data = await evaluate(`(() => ({
        pathname: location.pathname,
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: [...document.querySelectorAll('h1')].map(h=>h.textContent),
        breadcrumb: document.querySelector('[aria-label="Breadcrumb"]').textContent.replaceAll(/\\s+/g,' ').trim(),
        ancestor: document.querySelector('[aria-label="Breadcrumb"] a').getAttribute('href'),
        current: document.querySelector('[aria-label="Breadcrumb"] [aria-current="page"]').textContent,
        currentLinked: !!document.querySelector('[aria-label="Breadcrumb"] [aria-current="page"]').closest('a'),
        columns: getComputedStyle(document.querySelector('[data-service-grid]')).gridTemplateColumns.split(' ').length,
        count: document.querySelector('[data-service-count]').textContent,
        kinds: [...document.querySelectorAll('.service-card__kind')].map(n=>n.textContent),
        prices: [...document.querySelectorAll('.service-card__price')].map(n=>n.textContent.trim()),
        links: [...document.querySelectorAll('[data-service-card] a')].map(a=>a.getAttribute('href')),
        images: document.querySelectorAll('[data-service-card] img').length,
        nested: document.querySelectorAll('[data-service-grid] a a, [data-service-grid] a button').length,
        targets: [...document.querySelectorAll('[data-services-sphere] a')].map(a=>{const r=a.getBoundingClientRect();return r.width>=44 && r.height>=44;})
      }))()`);
      assert.equal(data.pathname, `/services/${sphere}/`); assert.equal(data.overflow, false);
      assert.deepEqual(data.h1, [labels[index]]); assert.equal(data.ancestor, "/services/");
      assert.equal(data.current, labels[index]); assert.equal(data.currentLinked, false);
      assert.equal(data.columns, width >= 1280 ? 3 : width >= 768 ? 2 : 1);
      assert.equal(data.count, "3 services"); assert.deepEqual(data.kinds, ["Reading", "Reading", "Spellwork"]);
      assert.deepEqual(data.prices, ["$123.45 USD", "$123.46 USD", "$123.47 USD"]);
      assert.deepEqual(data.links, [0, 1, 2].map(i => `/services/${sphere}/qa-${sphere}-${i}/`));
      assert.equal(data.images, 0); assert.equal(data.nested, 0); assert.ok(data.targets.every(Boolean));
      assert.ok((await fetch(origin + data.ancestor)).ok);
      for (const href of data.links) assert.ok((await fetch(origin + href)).ok, "No dead detail link");
      await send("Emulation.setFocusEmulationEnabled", { enabled: true });
      await evaluate("document.querySelector('.service-card__link').focus()");
      assert.ok(await evaluate("parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 3"));
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      assert.equal(await evaluate("document.activeElement.getAttribute('href')"), data.links[1]);
      await capture(`services-sphere-${sphere}-${width}.png`, width);
      // Native Enter follows the correct detail link, with no service-card JS.
      await evaluate("document.querySelector('.service-card__link').focus()");
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
      await waitFor(() => evaluate(`location.pathname === ${JSON.stringify(data.links[0])}`), "detail navigation");
      console.log(`PASS: ${sphere}@${width}: actual static path, breadcrumbs, heading, count, mixed types, exact prices, links, keyboard, responsive grid`);
    }
  }
  // A second real loader/build scenario: one empty sphere, one unpublished sphere.
  for (const file of fs.readdirSync(path.join(fixture, "src/content/services"))) {
    if (file.startsWith("qa-love-")) fs.rmSync(path.join(fixture, "src/content/services", file));
  }
  fs.writeFileSync(registryFile, enabled.replace('id: "money", label: "Money & Prosperity", order: 2, visible: true, published: true', 'id: "money", label: "Money & Prosperity", order: 2, visible: true, published: false'));
  cleanBuild();
  for (const sphere of ["love", "money"]) {
    assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}/index.html`)), false);
    assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}`)), false, "No empty/unpublished category directory");
  }
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/protection-uncrossing/index.html")), true);
  assert.equal((await fetch(origin + "/services/love/")).status, 404);
  assert.equal((await fetch(origin + "/services/money/")).status, 404);
  console.log("PASS: empty/unpublished spheres emit no pages or directories; only the populated approved sphere remains");
} finally { await close(); }
