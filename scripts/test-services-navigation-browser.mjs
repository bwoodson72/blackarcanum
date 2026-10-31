// SF-08: actual gated routes and all navigation surfaces in an isolated site.
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
  const mdx = data => "---\n" + Object.entries(data).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join("\n") + "\n---\n";
  write("src/content/services/qa-nav-product.mdx", mdx(product));
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
