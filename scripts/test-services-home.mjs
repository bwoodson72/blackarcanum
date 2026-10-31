// Actual homepage: preserve its editorial composition and gate a live Services invitation.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("home", 4198, 9258);
const widths = [375, 768, 1024, 1280, 1440];
const spheres = ["love", "money", "protection-uncrossing"];
const snapshots = new Map();
const rows = spheres.map((sphere, index) => ({ slug: "qa-home-" + sphere, title: "Synthetic homepage fixture", summary: "Technical QA only", sphere,
  kind: index === 1 ? "spellwork" : "reading", status: "published", approved: true, priceUsdCents: 12345, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] }));
function products(status = "published") {
  for (const row of rows) write(`src/content/services/${row.slug}.mdx`, "---\n" + Object.entries({ ...row, status }).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join("\n") + "\n---\n");
}
function cleanBuild() {
  fs.rmSync(path.join(fixture, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(fixture, ".astro"), { recursive: true, force: true }); build();
}
async function visit(width) {
  await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: origin });
  await waitFor(() => evaluate('location.pathname === "/" && document.readyState === "complete" && !!document.querySelector(".home-hero")'), "actual homepage");
  await evaluate('document.fonts.ready.then(()=>true)');
}
async function originalParts() {
  return evaluate(`Object.fromEntries(['.home-hero','.home-paths','.home-research','.home-practice','.home-newsletter'].map(selector=>[selector,document.querySelector(selector).outerHTML]))`);
}
try {
  prepare();
  for (const file of ["index.astro", "services/[...index].astro", "services/[sphere].astro", "services/[sphere]/[slug].astro", "services/practitioner/[...page].astro"]) {
    write("src/pages/"+file, fs.readFileSync(path.join(root, "src/pages", file), "utf8"));
  }
  // Existing real editorial content/curation/media remain intact; only these link targets are stubs.
  for (const name of ["library", "grimoire", "about", "search"]) write(`src/pages/${name}/index.astro`, '<!doctype html><html lang="en"><title>Editorial target</title><h1>Technical fixture</h1></html>');
  const registry = path.join(fixture, "src/data/service-spheres.ts");
  const enabled = fs.readFileSync(registry, "utf8").replaceAll("visible: false, published: false", "visible: true, published: true");
  fs.writeFileSync(registry, enabled); products();
  cleanBuild(); // Source remains release-closed: even valid products must not promote Services.
  const closedHtml = fs.readFileSync(path.join(fixture, "dist/index.html"), "utf8");
  assert.doesNotMatch(closedHtml, /data-home-services|href="\/services\/"/);
  await startBrowser();
  for (const width of widths) { await visit(width); snapshots.set(width, await originalParts()); }
  write("src/data/services-release.ts", "export const servicesPublicReleaseApproved: boolean = true;\n");
  cleanBuild();
  for (const width of widths) {
    await visit(width);
    assert.deepEqual(await originalParts(), snapshots.get(width), "Hero, gateways, curated research, Grimoire and newsletter markup unchanged");
    const data = await evaluate(`(() => {
      const section=document.querySelector('[data-home-services]');
      const practice=document.querySelector('.home-practice'); const newsletter=document.querySelector('.home-newsletter');
      return { overflow: document.documentElement.scrollWidth>innerWidth,
        h1: [...document.querySelectorAll('h1')].map(h=>h.textContent),
        heroHeight: parseFloat(getComputedStyle(document.querySelector('.home-hero')).minHeight),
        art: document.querySelector('.home-hero image').getAttribute('href'),
        gateways: [...document.querySelectorAll('.home-path__link')].map(a=>a.getAttribute('href')),
        order: !!(practice.compareDocumentPosition(section)&Node.DOCUMENT_POSITION_FOLLOWING) && !!(section.compareDocumentPosition(newsletter)&Node.DOCUMENT_POSITION_FOLLOWING),
        links: [...section.querySelectorAll('a')].map(a=>a.getAttribute('href')),
        targets: [...section.querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect();return r.height>=44 && r.width>=44;}),
        priceOrAvailability: /\\$|available now|guaranteed/i.test(section.textContent),
        images: section.querySelectorAll('img, image, video').length,
        nested: section.querySelectorAll('a a, a button').length,
        scripts: section.querySelectorAll('script').length,
        title: section.querySelector('h2').textContent,
        liveNav: document.querySelectorAll('.desktop-navigation a[href="/services/"]').length,
        columns: getComputedStyle(document.querySelector('.home-services__inner')).gridTemplateColumns.split(' ').length
      };
    })()`);
    assert.equal(data.overflow, false); assert.deepEqual(data.h1, ["Mystagogia"]);
    assert.ok(Math.abs(data.heroHeight-Math.min(688,Math.max(512,width*0.45)))<1);
    assert.equal(data.art, "/images/homepage/mystagogia-editorial-atlas.avif");
    assert.deepEqual(data.gateways, ["/library/", "/grimoire/"]); assert.equal(data.order, true);
    assert.deepEqual(data.links, ["/services/", ...spheres.map(s=>`/services/${s}/`)]);
    assert.ok(data.targets.every(Boolean)); assert.equal(data.priceOrAvailability, false); assert.equal(data.images, 0);
    assert.equal(data.nested, 0); assert.equal(data.scripts, 0); assert.equal(data.title, "Divination & Ritual Work");
    assert.equal(data.liveNav, 1); assert.equal(data.columns, width>=1024?2:1);
    for (const href of data.links) assert.ok((await fetch(origin+href)).ok, "Actual live target: "+href);
    await send("Emulation.setFocusEmulationEnabled", { enabled: true });
    await evaluate("document.querySelector('[data-home-services] a').focus()");
    assert.ok(await evaluate("parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=3"));
    for (const href of data.links.slice(1)) {
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      assert.equal(await evaluate("document.activeElement.getAttribute('href')"), href);
      assert.ok(await evaluate("parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=3"));
    }
    await capture(`services-home-${width}.png`, width);
    // A direct browser capture of the invitation region, not an edited image.
    const box=await evaluate("(() => {const r=document.querySelector('[data-home-services]').getBoundingClientRect();return {x:0,y:r.top+scrollY,width:innerWidth,height:r.height,scale:1};})()");
    const shot=await send("Page.captureScreenshot", { format:"png", captureBeyondViewport:true, clip:box });
    const output=process.env.SERVICES_SCREENSHOTS || path.join(fixture,"screenshots");
    fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,`services-home-invitation-${width}.png`),Buffer.from(shot.result.data,"base64"));
    await evaluate("document.querySelector('[data-home-services] a').focus()");
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text:"\r" });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
    await waitFor(()=>evaluate("location.pathname==='/services/' && !!document.querySelector('[data-services-hub]')"),"homepage invitation navigation");
    console.log(`PASS: homepage@${width}: exact editorial markup/hero dimensions, one H1, correct placement, live sphere links, no prices/artwork, focus/Tab/Enter, responsive layout`);
  }
  // A sphere lacking approved products must not leave a promotional link behind.
  fs.writeFileSync(registry,enabled.replace('id: "protection-uncrossing", label: "Protection & Uncrossing", order: 3, visible: true, published: true','id: "protection-uncrossing", label: "Protection & Uncrossing", order: 3, visible: true, published: false'));
  cleanBuild(); await visit(375);
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.home-services__spheres a')].map(a=>a.getAttribute('href'))"),["/services/love/","/services/money/"]);
  assert.equal(fs.existsSync(path.join(fixture,"dist/services/protection-uncrossing/index.html")),false);
  products("draft");cleanBuild();await visit(375);
  assert.equal(await evaluate("!!document.querySelector('[data-home-services]')"),false);
  assert.equal(await evaluate("document.querySelectorAll('a[href=\"/services/\"]').length"),0);
  assert.deepEqual(await originalParts(),snapshots.get(375));
  console.log("PASS: release-closed and empty catalogs suppress invitation/nav; unpublished sphere link omitted; existing editorial homepage unchanged");
} finally { await close(); }
