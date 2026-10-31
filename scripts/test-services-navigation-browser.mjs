// SF-08/SF-11: real routes, all navigation surfaces and the full keyboard browsing journey.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("navigation", 4197, 9257);
function cleanBuild() {
  fs.rmSync(path.join(fixture, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(fixture, ".astro"), { recursive: true, force: true }); build();
}
function expectNormalNav() {
  const html = fs.readFileSync(path.join(fixture, "dist/index.html"), "utf8");
  assert.match(html, /href="\/services\/"/);
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/index.html")), true);
}
async function key(key, code, number, text) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: number, ...(text ? { text } : {}) });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: number });
}
async function follow(selector, expected) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await key("Enter", "Enter", 13, "\r");
  await waitFor(() => evaluate(`location.pathname === ${JSON.stringify(expected)} && document.readyState === "complete"`), "keyboard journey " + expected);
}
async function reviewPage(name, width) {
  await evaluate('document.fonts.ready.then(()=>true)');
  const result = await evaluate(`(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    function rgba(color) { ctx.clearRect(0,0,1,1); ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data]; }
    function background(node) {
      for(let n=node;n;n=n.parentElement) { const color=rgba(getComputedStyle(n).backgroundColor);if(color[3]===255)return color; }
      return [255,255,255,255];
    }
    function luminance(color) { return color.slice(0,3).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0); }
    const samples=[...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main summary, main span, main button')]
      .filter(n=>n.getBoundingClientRect().height>0 && [...n.childNodes].some(c=>c.nodeType===3 && c.textContent.trim()));
    const contrast=samples.map(n=>{const s=getComputedStyle(n);const a=luminance(rgba(s.color)),b=luminance(background(n));
      const ratio=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);const large=parseFloat(s.fontSize)>=24 || (parseFloat(s.fontSize)>=18.66 && parseFloat(s.fontWeight)>=700);
      return {text:n.textContent.trim().slice(0,60),ratio,required:large?3:4.5};});
    return { overflow:document.documentElement.scrollWidth>innerWidth, h1:document.querySelectorAll('h1').length,
      inputs:document.querySelectorAll('main form, main input, main textarea, main select').length,
      targets:[...document.querySelectorAll('main a,main button,main summary')].filter(n=>n.getBoundingClientRect().height>0).map(n=>{const r=n.getBoundingClientRect();return {label:n.textContent.trim().slice(0,40),width:r.width,height:r.height};}),
      contrast, images:[...document.querySelectorAll('main img')].map(n=>({alt:n.alt,loaded:n.complete && n.naturalWidth>0})) };
  })()`);
  assert.equal(result.overflow, false); assert.equal(result.h1, 1); assert.equal(result.inputs, 0);
  assert.ok(result.contrast.length > 0);
  for (const row of result.contrast) assert.ok(row.ratio >= row.required, `${name}@${width}: contrast ${JSON.stringify(row)}`);
  for (const target of result.targets) assert.ok(target.width>=44 && target.height>=44, `${name}@${width}: target ${JSON.stringify(target)}`);
  assert.ok(result.images.every(n=>n.alt.trim() && n.loaded));
  await capture(`services-journey-${name}-${width}.png`, width);
}
try {
  prepare();
  for (const file of ["services/[...index].astro", "services/[sphere].astro", "services/[sphere]/[slug].astro", "services/practitioner/[...page].astro"]) {
    write("src/pages/" + file, fs.readFileSync(path.join(root, "src/pages", file), "utf8"));
  }
  write("src/pages/index.astro", `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout noindex><h1>Isolated navigation fixtures</h1></BaseLayout>`);
  for (const name of ["library", "grimoire", "about", "search"]) {
    write(`src/pages/${name}/index.astro`, `---
import BaseLayout from "../../layouts/BaseLayout.astro";
---
<BaseLayout noindex><h1>Editorial navigation fixture</h1></BaseLayout>`);
  }
  write("src/pages/library/qa-article.astro", `---
import BaseLayout from "../../layouts/BaseLayout.astro";
---
<BaseLayout noindex><h1>Nested editorial fixture</h1></BaseLayout>`);
  const registry = path.join(fixture, "src/data/service-spheres.ts");
  fs.writeFileSync(registry, fs.readFileSync(registry, "utf8").replace('id: "love", label: "Love & Relationships", order: 1, visible: false, published: false', 'id: "love", label: "Love & Relationships", order: 1, visible: true, published: true'));
  const product = { slug: "qa-nav-product", title: "Synthetic navigation fixture", summary: "Technical QA only", sphere: "love", kind: "reading", status: "published", approved: true, priceUsdCents: 12345, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] };
  const spellwork = { ...product, slug: "qa-nav-spellwork", title: "Synthetic ritual fixture", kind: "spellwork" };
  product.relatedIds = [spellwork.slug];
  const mdx = data => "---\n" + Object.entries(data).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join("\n") + "\n---\n";
  write("src/content/services/qa-nav-product.mdx", mdx(product));
  write("src/content/services/qa-nav-spellwork.mdx", mdx(spellwork));
  const fact = { text: "Synthetic practitioner fixture, not a real biography.", approved: true, verified: true };
  write("src/data/practitioner.ts", "export const practitionerProfile = " + JSON.stringify({ status: "published", approved: true, summary: fact, biography: [fact] }) + ";\n");
  cleanBuild(); expectNormalNav(); // Ordinary browsing does not require commercial launch.
  write("src/data/services-release.ts", "export const servicesPublicReleaseApproved: boolean = true;\n");
  write("src/content/services/qa-nav-product.mdx", mdx({ ...product, status: "draft" }));
  cleanBuild(); expectNormalNav(); // Draft offerings do not hide informational pages.
  write("src/content/services/qa-nav-product.mdx", mdx(product));
  cleanBuild();
  const hub = fs.readFileSync(path.join(fixture, "dist/services/index.html"), "utf8");
  assert.match(hub, /<meta name="robots" content="noindex/);
  assert.ok(hub.includes('href="/services/love/"'));
  await startBrowser();
  const paths = ["/", "/services/", "/services/love/", "/services/love/qa-nav-product/", "/services/practitioner/", "/library/", "/library/qa-article/"];
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const pathname of paths) {
      await send("Page.navigate", { url: origin + pathname });
      await waitFor(() => evaluate(`location.pathname === ${JSON.stringify(pathname)} && document.readyState === "complete" && !!document.querySelector('.site-header')`), "navigation route " + pathname);
      await evaluate('document.fonts.ready.then(()=>true)');
      const result = await evaluate(`(() => {
        const primary=document.querySelector('.desktop-navigation');
        const mobile=document.querySelector('.mobile-dialog');
        const footer=document.querySelector('.site-footer__navigation');
        const visibleParts=[document.querySelector('.brand'), ...(innerWidth>=1024 ? [primary, document.querySelector('.header-actions')] : [document.querySelector('.menu-trigger')])];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          primary: [...primary.querySelectorAll('a')].map(a=>[a.textContent,a.getAttribute('href')]),
          services: [primary,mobile,footer].map(n=>[...n.querySelectorAll('a')].filter(a=>a.getAttribute('href')==='/services/').map(a=>a.getAttribute('aria-current'))),
          library: primary.querySelector('a[href="/library/"]').getAttribute('aria-current'),
          shop: document.querySelectorAll('a[href^="/shop"]').length,
          boxes: visibleParts.map(n=>{const r=n.getBoundingClientRect(); return {left:r.left,right:r.right,height:r.height};}),
          drawer: document.querySelector('[data-menu-dialog]').open,
          breadcrumbs: [...document.querySelectorAll('[aria-label=Breadcrumb] a')].map(a=>a.getAttribute('href')),
          currentBreadcrumbLinked: !!document.querySelector('[aria-label=Breadcrumb] [aria-current=page]')?.closest('a')
        };
      })()`);
      assert.equal(result.overflow, false); assert.equal(result.shop, 0); assert.equal(result.drawer, false);
      assert.deepEqual(result.primary, [["Library", "/library/"], ["Grimoire", "/grimoire/"], ["Services", "/services/"], ["About", "/about/"]]);
      const current = pathname === "/services/" ? "page" : pathname.startsWith("/services/") ? "location" : null;
      assert.deepEqual(result.services, [[current], [current], [current]], "All surfaces use the same active state");
      assert.equal(result.library, pathname === "/library/" ? "page" : null, "Existing editorial matching remains exact");
      for (let i=1;i<result.boxes.length;i++) assert.ok(result.boxes[i-1].right <= result.boxes[i].left, "Header parts must not overlap at " + width);
      assert.ok(result.boxes.every(b=>b.left>=0 && b.right<=width+1));
      if (pathname === "/services/love/") assert.deepEqual(result.breadcrumbs, ["/services/"]);
      if (pathname === "/services/love/qa-nav-product/") assert.deepEqual(result.breadcrumbs, ["/services/", "/services/love/"]);
      if (pathname === "/services/practitioner/") assert.deepEqual(result.breadcrumbs, ["/services/"]);
      assert.equal(result.currentBreadcrumbLinked, false);
      for (const href of [...result.primary.map(p=>p[1]), ...result.breadcrumbs]) assert.ok((await fetch(origin+href)).ok, "Actual target exists: " + href);
      if (pathname === "/services/love/qa-nav-product/") {
        await capture(`services-navigation-${width}.png`, width);
        if (width < 1024) {
          await send("Emulation.setFocusEmulationEnabled", { enabled: true });
          await evaluate("document.querySelector('[data-menu-trigger]').focus()");
          await key("Enter", "Enter", 13, "\r");
          await waitFor(() => evaluate("document.querySelector('[data-menu-dialog]').open"), "native dialog open");
          assert.equal(await evaluate("document.querySelector('[data-menu-trigger]').getAttribute('aria-expanded')"), "true");
          assert.equal(await evaluate("document.activeElement.hasAttribute('data-menu-close')"), true);
          for (let i=0;i<14;i++) {
            await key("Tab", "Tab", 9);
            // Chromium may report BODY while tabbing through browser chrome;
            // background page controls must never receive focus while modal.
            const focus = await evaluate("({ inside: document.querySelector('[data-menu-dialog]').contains(document.activeElement), browserBoundary: document.activeElement === document.body, modal: document.querySelector('[data-menu-dialog]').matches(':modal') })");
            assert.equal(focus.modal, true); assert.ok(focus.inside || focus.browserBoundary, "No background interactive element receives focus");
          }
          const ax=await send("Accessibility.getFullAXTree");
          assert.ok(ax.result.nodes.some(n=>!n.ignored && n.role?.value==='dialog' && n.name?.value==='Navigation' && n.properties?.some(p=>p.name==='modal' && p.value?.value===true)));
          assert.equal(ax.result.nodes.filter(n=>!n.ignored && n.role?.value === 'link').length, 6, "Only modal links are exposed to assistive technology");
          await capture(`services-navigation-menu-${width}.png`, width);
          await key("Escape", "Escape", 27);
          await waitFor(() => evaluate("!document.querySelector('[data-menu-dialog]').open && document.querySelector('[data-menu-trigger]').getAttribute('aria-expanded') === 'false'"), "Escape close");
          assert.equal(await evaluate("document.activeElement.hasAttribute('data-menu-trigger')"), true);
          await key("Enter", "Enter", 13, "\r");
          await evaluate("document.querySelector('.mobile-dialog a[href=\"/services/\"]').focus()");
          await key("Enter", "Enter", 13, "\r");
          await waitFor(() => evaluate("location.pathname === '/services/' && document.readyState === 'complete'"), "mobile Services navigation");
          assert.equal(await evaluate("document.querySelector('[data-menu-dialog]').open"), false);
          await evaluate("document.querySelector('[data-menu-trigger]').click()");
          await send("Emulation.setDeviceMetricsOverride", { width: 1024, height: 1000, deviceScaleFactor: 1, mobile: false });
          await waitFor(() => evaluate("!document.querySelector('[data-menu-dialog]').open"), "resize closes mobile menu");
          await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
        }
      }
    }
    // Full journey uses real keyboard-activated links, not direct route navigation.
    await send("Page.navigate", { url: origin + "/services/" });
    await waitFor(() => evaluate('location.pathname === "/services/" && document.readyState === "complete"'), "journey hub");
    await reviewPage("hub", width);
    const ax = await send("Accessibility.getFullAXTree");
    assert.equal(ax.result.nodes.filter(n => !n.ignored && n.role?.value === "DisclosureTriangle").length, 4);
    await evaluate("document.querySelector('.services-hub__questions summary').focus()");
    await key(" ", "Space", 32, " ");
    assert.equal(await evaluate("document.querySelector('.services-hub__questions details').open"), true);
    assert.ok(await evaluate("document.activeElement.matches(':focus-visible') && parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 3"));
    await key("Enter", "Enter", 13, "\r");
    assert.equal(await evaluate("document.querySelector('.services-hub__questions details').open"), false);
    await follow('[data-sphere-card] a[href="/services/love/"]', "/services/love/");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('[data-service-card]')].map(n=>n.dataset.serviceKind).sort()"), ["reading", "spellwork"]);
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.service-card__link')).transitionDuration"), "0s");
    await reviewPage("sphere", width);
    await send("Emulation.setEmulatedMedia", { features: [] });
    await follow('[data-service-card] a[href="/services/love/qa-nav-product/"]', "/services/love/qa-nav-product/");
    assert.equal(await evaluate("document.querySelectorAll('.service-detail__media img').length"), 0, "Text-first detail requires no placeholder artwork");
    await reviewPage("reading", width);
    await follow('[data-related-services] a[href="/services/love/qa-nav-spellwork/"]', "/services/love/qa-nav-spellwork/");
    await reviewPage("spellwork", width);
    await follow('[data-practitioner-link] a', "/services/practitioner/");
    await reviewPage("practitioner", width);
    await follow('[aria-label="Breadcrumb"] a[href="/services/"]', "/services/");
    console.log(`PASS: journey@${width}: hub → sphere → reading → related spellwork → practitioner → breadcrumb; native FAQ, contrast, 44px targets, one H1, focus and reduced motion`);
    console.log(`PASS: nav@${width}: all surfaces, nested active state, editorial behavior, real links, breadcrumbs, header fit, modal focus/Escape/resize`);
  }
  // Search indexing is independent of ordinary navigation.
  fs.rmSync(path.join(fixture, "src/pages/services/[...index].astro"));
  write("src/pages/services/index.astro", `---
import ServicesHub from "../../components/services/ServicesHub.astro";
---
<ServicesHub />`);
  cleanBuild();
  assert.match(fs.readFileSync(path.join(fixture, "dist/services/index.html"), "utf8"), /<meta name="robots" content="noindex/);
  assert.match(fs.readFileSync(path.join(fixture, "dist/index.html"), "utf8"), /href="\/services\/"/);
  console.log("PASS: normal navigation supports noindex informational pages and empty catalogs; fixtures isolated");
} finally { await close(); }
