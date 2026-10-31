// SF-03: the real composition in isolated routes, never a production hub.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("hub", 4193, 9253);
const heroStyles = fs.readFileSync(path.join(root, "src/styles/page-hero.css"), "utf8");
try {
  prepare();
  const imports = `import ServicesHub from "../components/services/ServicesHub.astro";
import { serviceSpheres } from "../data/service-spheres";
import { toPublishedSphereViews } from "../lib/services-presentation";
import { serviceSchema } from "../lib/services-schema";
import { selectPublishedServices } from "../lib/services-catalog";
const registry = serviceSpheres.map(s => ({ ...s, visible: true, published: true }));
const entries = registry.map(s => { const data=serviceSchema.parse({ slug: "qa-hub-" + s.id,
 title: "Synthetic fixture", summary: "Test only", sphere: s.id, kind: "reading", status: "published", approved: true,
 priceUsdCents: 12345, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] }); return { id: data.slug, data }; });
const spheres = toPublishedSphereViews(selectPublishedServices(entries, registry), registry);`;
  write("src/pages/index.astro", `---\n${imports}\n---\n<ServicesHub spheres={spheres} />`);
  write("src/pages/empty.astro", `---\nimport ServicesHub from "../components/services/ServicesHub.astro";\n---\n<ServicesHub />`);
  for (const sphere of ["love", "money", "protection-uncrossing", "practitioner"]) {
    write(`src/pages/services/${sphere}/index.astro`, '<!doctype html><html lang="en"><title>QA only</title><h1>Isolated test destination</h1></html>');
  }
  // Existing shell links get test-only targets to check every link honestly.
  for (const slug of ["library", "grimoire", "about", "search"]) {
    write(`src/pages/${slug}/index.astro`, '<!doctype html><html lang="en"><title>QA only</title><h1>Isolated editorial destination</h1></html>');
  }
  write("src/pages/hero-regression.astro", `---
import BaseLayout from "../layouts/BaseLayout.astro";
import PageHero from "../components/site/PageHero.astro";
---
<BaseLayout noindex><PageHero mode="home" titleId="regression-title" title="Mystagogia" tagline={["Historical Research", "Practical Wisdom", "Living Tradition"]} description="Hero compatibility test" artSrc="/images/homepage/mystagogia-editorial-atlas.avif" /></BaseLayout>`);
  build();
  for (const name of ["index.html", "empty/index.html"]) {
    const html = fs.readFileSync(path.join(fixture, "dist", name), "utf8");
    assert.match(html, /noindex, nofollow/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /data-service-card|\$123|application\/ld\+json/);
    assert.doesNotMatch(html, /<form\b|<input\b|<iframe\b/);
  }
  const empty = fs.readFileSync(path.join(fixture, "dist/empty/index.html"), "utf8");
  assert.doesNotMatch(empty, /href="\/services\/|data-sphere-card|UNAPPROVED_TEASER/);
  assert.match(empty, /No services are open/);
  await startBrowser();
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const state of ["", "empty/"]) {
      await send("Page.navigate", { url: origin + "/" + state });
      await waitFor(() => evaluate('document.readyState === "complete" && !!document.querySelector("[data-services-hub]")'), "hub " + state);
      await evaluate('document.fonts.ready.then(() => true)');
      const data = await evaluate(`(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        headings: [...document.querySelectorAll('h1')].map(h=>h.textContent),
        heroArt: !!document.querySelector('.services-hero .page-hero__art'),
        cards: document.querySelectorAll('[data-sphere-card]').length,
        cardTop: document.querySelector('[data-sphere-card]')?.getBoundingClientRect().top,
        columns: document.querySelector('.service-grid') ? getComputedStyle(document.querySelector('.service-grid')).gridTemplateColumns.split(' ').length : 0,
        teaser: !!document.querySelector('[data-practitioner-teaser]'),
        unavailable: !!document.querySelector('[data-services-unavailable]'),
        forms: document.querySelectorAll('[data-services-hub] form, [data-services-hub] input').length,
        sphereLinks: [...document.querySelectorAll('[data-services-hub] a[href^="/services/"]')].map(a=>a.getAttribute('href')),
        targets: [...document.querySelectorAll('[data-services-hub] a, [data-services-hub] summary')].map(a=>{const r=a.getBoundingClientRect();return r.width>=44 && r.height>=44;}),
        hrefs: [...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))
      }))()`);
      assert.equal(data.overflow, false, `No overflow: ${state}@${width}`);
      assert.deepEqual(data.headings, ["Divination & Ritual Work"]); assert.equal(data.heroArt, false);
      assert.equal(data.cards, state === "empty/" ? 0 : 3);
      assert.equal(data.teaser, false); assert.equal(data.unavailable, state === "empty/");
      assert.equal(data.forms, 0); assert.ok(data.targets.every(Boolean));
      if (state === "empty/") assert.deepEqual(data.sphereLinks, []);
      else {
        assert.equal(data.columns, width >= 1280 ? 3 : width >= 768 ? 2 : 1);
        if (width === 375) assert.ok(data.cardTop < 850, "Spheres reached early on mobile: " + data.cardTop);
      }
      for (const href of data.hrefs) {
        if (href.startsWith('#')) assert.equal(await evaluate(`!!document.getElementById(${JSON.stringify(href.slice(1))})`), true);
        else if (href.startsWith('/')) assert.ok((await fetch(origin + href)).ok, "Real fixture link: " + href);
        else assert.fail("Unexpected external hub link: " + href);
      }
      const ax = await send("Accessibility.getFullAXTree");
      const disclosures = ax.result.nodes.filter(n => !n.ignored && n.role?.value === "DisclosureTriangle");
      assert.equal(disclosures.length, 4); assert.ok(disclosures.every(n => n.name?.value));
      // Native details must toggle using the keyboard with visible focus.
      await evaluate("document.querySelector('.services-hub__questions summary').focus()");
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32, text: " " });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
      assert.equal(await evaluate("document.querySelector('.services-hub__questions details').open"), true);
      assert.ok(await evaluate("parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 3"));
      const updatedAx = await send("Accessibility.getFullAXTree");
      assert.ok(updatedAx.result.nodes.some(n => n.role?.value === "DisclosureTriangle" && n.properties?.some(p => p.name === "expanded" && p.value?.value === true)));
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
      assert.equal(await evaluate("document.querySelector('.services-hub__questions details').open"), false);
      await evaluate("document.querySelector('.services-hero a').click()");
      await waitFor(() => evaluate('location.hash === "#service-spheres"'), "sphere anchor");
      assert.ok(await evaluate("document.querySelector('#service-spheres').getBoundingClientRect().top >= 60"), "Anchor remains below sticky header");
      await capture(`services-hub-${state ? state.replace('/', '-') : ''}${width}.png`, width);
      console.log(`PASS: hub ${state || 'populated'}@${width}: headings, hierarchy, links, unpublished state, native FAQ/AX/keyboard, anchors, targets`);
    }
    await send("Page.navigate", { url: origin + "/hero-regression/" });
    await waitFor(() => evaluate('!!document.querySelector(".home-hero") && document.readyState === "complete"'), "existing hero regression");
    const minHeight = await evaluate("parseFloat(getComputedStyle(document.querySelector('.home-hero')).minHeight)");
    assert.ok(Math.abs(minHeight - Math.min(688, Math.max(512, width * 0.45))) < 1, "Home hero height unchanged");
    assert.equal(await evaluate("!!document.querySelector('.home-hero .page-hero__art image')"), true);
  }
  assert.equal(fs.readFileSync(path.join(root, "src/styles/page-hero.css"), "utf8"), heroStyles);
  console.log("PASS: shared homepage hero retains approved height/artwork; hub fixtures never enter production");
} finally { await close(); }
