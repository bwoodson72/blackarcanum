// Exercise the actual SF-04 getStaticPaths route with temporary MDX products.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("sphere-pages", 4194, 9254);
const testFilters = process.argv.includes("--filters");
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
  write("src/pages/services/[sphere]/[slug].astro", fs.readFileSync(path.join(root, "src/pages/services/[sphere]/[slug].astro"), "utf8"));
  if (testFilters) {
    write("src/pages/single-kind.astro", `---
import SpherePage from "../components/services/SpherePage.astro";
import { getPublishedServices } from "../lib/services-public";
import { toPublishedSphereViews } from "../lib/services-presentation";
const products = (await getPublishedServices("love")).filter(p => p.kind === "reading");
const [sphere] = toPublishedSphereViews(products);
---
<SpherePage sphere={sphere} products={products} />`);
    write("src/pages/empty-grid.astro", `---
import BaseLayout from "../layouts/BaseLayout.astro";
import ServiceProductFilter from "../components/services/ServiceProductFilter.astro";
---
<BaseLayout title="Empty filter fixture" noindex><h1>Technical fixture</h1><ServiceProductFilter products={[]} /></BaseLayout>`);
  }
  const registryFile = path.join(fixture, "src/data/service-spheres.ts");
  const enabled = fs.readFileSync(registryFile, "utf8").replaceAll("visible: false, published: false", "visible: true, published: true");
  fs.writeFileSync(registryFile, enabled);
  products();
  // Ordinary content browsing is independent of commercial launch approval.
  cleanBuild();
  for (const sphere of ids) assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}/index.html`)), true, "Approved spheres are ordinarily browsable");
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
      assert.equal(data.count, "3 of 3 services · All"); assert.deepEqual(data.kinds, ["Reading", "Reading", "Spellwork"]);
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
      if (testFilters) {
        const baseline = await evaluate(`({ url: location.href, canonical: document.querySelector('link[rel="canonical"]')?.href,
          order: [...document.querySelectorAll('[data-service-card] a')].map(a=>a.getAttribute('href')) })`);
        for (const [kind, count, label] of [["reading", 2, "Readings"], ["spellwork", 1, "Spellwork"], ["all", 3, "All"]]) {
          await send("Emulation.setFocusEmulationEnabled", { enabled: true });
          await evaluate(`document.querySelector('[data-service-filter-kind="${kind}"]').focus()`);
          const top = await evaluate("document.querySelector('[data-service-filter-controls]').getBoundingClientRect().top");
          await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
          await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
          const filtered = await evaluate(`(() => ({
            url: location.href, canonical: document.querySelector('link[rel="canonical"]')?.href,
            order: [...document.querySelectorAll('[data-service-card] a')].map(a=>a.getAttribute('href')),
            selected: [...document.querySelectorAll('[data-service-filter-controls] button[aria-pressed="true"]')].map(b=>b.dataset.serviceFilterKind),
            kinds: [...document.querySelectorAll('[data-service-grid] > li:not([hidden]) [data-service-kind]')].map(c=>c.dataset.serviceKind),
            count: document.querySelector('[data-service-count]').textContent,
            live: document.querySelector('[data-service-count]').getAttribute('aria-live'),
            role: document.querySelector('[data-service-count]').getAttribute('role'),
            active: document.activeElement?.getAttribute('data-service-filter-kind'),
            outline: parseFloat(getComputedStyle(document.activeElement).outlineWidth),
            targets: [...document.querySelectorAll('[data-service-filter-controls] button')].map(b=>{const r=b.getBoundingClientRect(); return r.width>=44 && r.height>=44;}),
            top: document.querySelector('[data-service-filter-controls]').getBoundingClientRect().top,
            overflow: document.documentElement.scrollWidth > innerWidth,
            empty: !document.querySelector('[data-service-filter-empty]').hidden
          }))()`);
          assert.equal(filtered.url, baseline.url); assert.equal(filtered.canonical, baseline.canonical); assert.deepEqual(filtered.order, baseline.order);
          assert.deepEqual(filtered.selected, [kind]); assert.equal(filtered.kinds.length, count);
          if (kind !== "all") assert.ok(filtered.kinds.every(k=>k===kind));
          assert.equal(filtered.count, `${count} of 3 services · ${label}`); assert.equal(filtered.live, "polite"); assert.equal(filtered.role, "status");
          assert.equal(filtered.active, kind); assert.ok(filtered.outline >= 3); assert.ok(filtered.targets.every(Boolean));
          assert.ok(Math.abs(filtered.top - top) <= 4, `Filter controls remain stable: ${sphere}@${width} ${kind}: ${top} → ${filtered.top}`);
          assert.equal(filtered.overflow, false); assert.equal(filtered.empty, false);
          const ax = await send("Accessibility.getFullAXTree");
          const cardLinks = ax.result.nodes.filter(n=>!n.ignored && n.role?.value === "link" && n.name?.value?.includes("Synthetic"));
          assert.equal(cardLinks.length, count, "Hidden cards disappear from accessibility tree");
          const pressed = ax.result.nodes.filter(n=>!n.ignored && n.role?.value === "button" && n.properties?.some(p=>p.name === "pressed" && String(p.value?.value) === "true"));
          assert.equal(pressed.length, 1); assert.equal(pressed[0].name.value, label);
          if (kind === "spellwork") {
            // The next focusable item after the final filter button is the sole visible card.
            await evaluate("document.querySelector('[data-service-filter-kind=spellwork]').focus()");
            await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
            await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
            assert.equal(await evaluate("document.activeElement.getAttribute('href')"), data.links[2]);
          }
        }
        // Capture after the interaction assertions: full-page screenshotting can
        // temporarily alter Chrome's viewport/scroll state.
        await evaluate("document.querySelector('[data-service-filter-kind=spellwork]').click()");
        await capture(`services-filter-${sphere}-${width}.png`, width);
        await evaluate("document.querySelector('[data-service-filter-kind=all]').click()");
        console.log(`PASS: ${sphere}@${width}: filter subsets/pressed states/live count, native keyboard, focus/targets, stable controls, AX visibility, unchanged URL/order`);
      }
      await capture(`services-sphere-${sphere}-${width}.png`, width);
      // Native Enter follows the correct detail link, with no service-card JS.
      await evaluate("document.querySelector('.service-card__link').focus()");
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
      await waitFor(() => evaluate(`location.pathname === ${JSON.stringify(data.links[0])}`), "detail navigation");
      console.log(`PASS: ${sphere}@${width}: actual static path, breadcrumbs, heading, count, mixed types, exact prices, links, keyboard, responsive grid`);
    }
  }
  if (testFilters) {
    // With scripts disabled at navigation, initial HTML still has every card and link.
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    await send("Page.navigate", { url: origin + "/services/love/" });
    await waitFor(() => evaluate('document.readyState === "complete" && !!document.querySelector("[data-service-filter]")'), "no-JavaScript sphere");
    assert.equal(await evaluate("document.querySelector('[data-service-filter-controls]').hidden"), true);
    assert.equal(await evaluate("document.querySelectorAll('[data-service-grid] > li:not([hidden]) a').length"), 3);
    assert.equal(await evaluate("document.querySelector('[data-service-count]').textContent.trim()"), "3 services");
    await capture("services-filter-no-js-1440.png", 1440);
    await send("Emulation.setScriptExecutionDisabled", { value: false });
    await send("Page.navigate", { url: origin + "/single-kind/" });
    await waitFor(() => evaluate('location.pathname === "/single-kind/" && document.readyState === "complete" && !!document.querySelector("[data-service-filter]")'), "single-kind sphere");
    assert.equal(await evaluate("document.querySelectorAll('[data-service-filter-controls]').length"), 0);
    assert.equal(await evaluate("document.querySelectorAll('[data-service-grid] > li:not([hidden])').length"), 2);
    assert.equal(await evaluate("document.querySelector('[data-service-count]').textContent.trim()"), "2 services");
    await send("Page.navigate", { url: origin + "/empty-grid/" });
    await waitFor(() => evaluate('location.pathname === "/empty-grid/" && document.readyState === "complete" && !!document.querySelector("[data-service-filter]")'), "empty component fixture");
    assert.equal(await evaluate("document.querySelectorAll('[data-service-filter-controls], [data-service-card]').length"), 0);
    assert.equal(await evaluate("document.querySelector('[data-service-filter-empty]').hidden"), false);
    // Test a kind becoming absent after initialization without a second product array.
    await send("Page.navigate", { url: origin + "/services/love/" });
    await waitFor(() => evaluate('!!document.querySelector("[data-service-filter-ready]")'), "enhanced sphere");
    await evaluate("document.querySelector('[data-service-kind=spellwork]').closest('li').remove(); document.querySelector('[data-service-filter-kind=spellwork]').focus()");
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32, text: " " });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
    assert.equal(await evaluate("document.querySelector('[data-service-count]').textContent"), "0 of 2 services · Spellwork");
    assert.equal(await evaluate("document.querySelector('[data-service-filter-empty]').hidden"), false);
    assert.match(await evaluate("document.querySelector('[data-service-filter-empty]').textContent"), /No spellwork/);
    assert.equal(await evaluate("document.activeElement.dataset.serviceFilterKind"), "spellwork");
    await capture("services-filter-empty-result-1440.png", 1440);
    await evaluate("document.querySelector('[data-service-filter-kind=all]').click()");
    assert.equal(await evaluate("document.querySelector('[data-service-grid] > li:not([hidden])') !== null"), true);
    assert.equal(await evaluate("document.querySelector('[data-service-filter-empty]').hidden"), true);
    console.log("PASS: no-JS complete linked catalog, single-kind controls omitted, empty catalog, zero-result feedback and All recovery");
  }
  if (testFilters) fs.rmSync(path.join(fixture, "src/pages/single-kind.astro"));
  // A second real loader/build scenario: one empty sphere, one unpublished sphere.
  for (const file of fs.readdirSync(path.join(fixture, "src/content/services"))) {
    if (file.startsWith("qa-love-")) fs.rmSync(path.join(fixture, "src/content/services", file));
  }
  fs.writeFileSync(registryFile, enabled.replace('id: "money", label: "Money & Prosperity", order: 2, visible: true, published: true', 'id: "money", label: "Money & Prosperity", order: 2, visible: true, published: false'));
  cleanBuild();
  for (const sphere of ["money"]) {
    assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}/index.html`)), false);
    assert.equal(fs.existsSync(path.join(fixture, `dist/services/${sphere}`)), false, "No empty/unpublished category directory");
  }
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/protection-uncrossing/index.html")), true);
  assert.equal((await fetch(origin + "/services/love/")).status, 200);
  assert.match(fs.readFileSync(path.join(fixture, "dist/services/love/index.html"), "utf8"), /data-services-unavailable/);
  assert.equal((await fetch(origin + "/services/money/")).status, 404);
  console.log("PASS: empty approved sphere stays browsable; unpublished sphere emits no destination");
} finally { await close(); }
