// Isolated Astro fixture + real Chrome QA, following existing fixture/browser suites.
// No synthetic products, routes or image approvals are written into the live src/.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";
const root = process.cwd();
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mystagogia-service-cards-"));
const origin = "http://127.0.0.1:4192";
const cdp = "http://127.0.0.1:9252";
let chrome, server, socket;
const pending = new Map();
let nextId = 0;
const screenshots = process.env.SERVICES_SCREENSHOTS || path.join(fixture, "screenshots");
function write(name, content) {
  const file = path.join(fixture, name);
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content);
}
async function waitFor(probe, label) {
  for (let i = 0; i < 100; i++) {
    try { if (await probe()) return; } catch {}
    await pause(200);
  }
  throw new Error("Timed out awaiting " + label);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error("CDP timeout: " + method)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  assert.equal(response.result.exceptionDetails, undefined, JSON.stringify(response.result.exceptionDetails));
  return response.result.result.value;
}
try {
  fs.cpSync(path.join(root, "src"), path.join(fixture, "src"), { recursive: true });
  fs.rmSync(path.join(fixture, "src/pages"), { recursive: true });
  fs.cpSync(path.join(root, "public/fonts"), path.join(fixture, "public/fonts"), { recursive: true });
  fs.symlinkSync(path.join(root, "node_modules"), path.join(fixture, "node_modules"), "dir");
  write("package.json", JSON.stringify({ type: "module" }));
  write("astro.config.mjs", `import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
export default defineConfig({ vite: { plugins: [tailwindcss()] }, integrations: [mdx()] });`);
  // Plain technical test pixels, no artwork, historical claim or production approval.
  write("src/assets/media/editorial/qa-services.svg", '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480"><rect width="720" height="480" fill="black"/></svg>');
  const registry = path.join(fixture, "src/data/media.ts");
  fs.appendFileSync(registry, `\n// Isolated test copy only.
(media as MediaRecord[]).push({ id: "qa-services", sourceFile: "src/assets/media/editorial/qa-services.svg", role: "editorial", origin: "modern-artwork", alt: "Neutral technical image fixture", decorative: false, rights: { status: "cleared", basis: "owned", license: "Technical fixture", creditLine: "Test only", evidenceNote: "Neutral pixels in isolated test only" } });`);
  fs.appendFileSync(path.join(fixture, "src/data/service-spheres.ts"), '\n(approvedServiceMediaIds as string[]).push("qa-services");\n');
  write("src/pages/index.astro", `---
import "../styles/global.css";
import Container from "../components/foundation/Container.astro";
import SphereCard from "../components/services/SphereCard.astro";
import ServiceProductGrid from "../components/services/ServiceProductGrid.astro";
import { serviceSpheres } from "../data/service-spheres";
import { serviceSchema } from "../lib/services-schema";
import { selectPublishedServices } from "../lib/services-catalog";
import { toPublishedSphereViews } from "../lib/services-presentation";
const spheres = serviceSpheres.map(s => ({ ...s, visible: true, published: true }));
const entries = spheres.map((sphere, i) => {
  const data = serviceSchema.parse({ slug: "qa-product-" + i, title: i === 2 ? "A deliberately long synthetic product title for layout testing" : "Synthetic service fixture " + i,
    summary: "Isolated technical test data. This is not an actual offering.", sphere: sphere.id, kind: i === 1 ? "spellwork" : "reading",
    status: "published", approved: true, priceUsdCents: 12345 + i, mediaId: i === 1 ? "qa-services" : undefined,
    scope: "Test", inclusions: ["Test"], process: ["Test"], turnaround: "Test", clientRequirements: ["Test"] });
  return { id: data.slug, data };
});
const products = selectPublishedServices(entries, spheres);
const sphereViews = toPublishedSphereViews(products, spheres);
---
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><meta name="robots" content="noindex, nofollow"/><title>Isolated Services cards QA</title></head>
<body><main><Container><h1>Services component fixtures</h1><p>Technical QA only — no real offerings.</p>
<section class="py-8"><h2>Spheres</h2><ul class="service-grid" data-sphere-grid>{sphereViews.map(sphere => <li><SphereCard sphere={sphere}/></li>)}</ul></section>
<section class="py-8"><h2>Service cards</h2><ServiceProductGrid products={products}/></section>
<div id="empty-grid"><ServiceProductGrid products={[]}/></div>
</Container></main></body></html>`);
  for (const [i, sphere] of ["love", "money", "protection-uncrossing"].entries()) {
    for (const suffix of ["", "qa-product-" + i + "/"]) {
      write(`src/pages/services/${sphere}/${suffix}index.astro`, '<!doctype html><html lang="en"><title>Fixture target</title><h1>Isolated fixture destination</h1></html>');
    }
  }
  const build = spawnSync(process.execPath, [fs.realpathSync(path.join(root, "node_modules/.bin/astro")), "build"], { cwd: fixture, encoding: "utf8", timeout: 180000 });
  assert.equal(build.status, 0, "Isolated build failed: " + build.stdout?.slice(-5000) + build.stderr?.slice(-5000));
  const html = fs.readFileSync(path.join(fixture, "dist/index.html"), "utf8");
  assert.match(html, /noindex, nofollow/);
  assert.doesNotMatch(html, /<script\b/, "Cards work without client-side JavaScript");
  assert.equal((html.match(/data-service-card[ >]/g) || []).length, 3);
  server = spawn("python3", ["-m", "http.server", "4192", "--bind", "127.0.0.1", "--directory", path.join(fixture, "dist")], { stdio: "ignore" });
  chrome = spawn(process.env.CHROME_BIN || "google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--remote-allow-origins=*", "--remote-debugging-port=9252", "--user-data-dir=" + path.join(fixture, "chrome"), origin], { stdio: "ignore" });
  chrome.on("error", (error) => console.error("Browser startup:", error.message));
  await waitFor(async () => (await fetch(origin)).ok, "fixture server");
  let tab;
  await waitFor(async () => { tab = (await (await fetch(cdp + "/json/list")).json()).find(t => t.type === "page"); return !!tab; }, "headless Chrome (set CHROME_BIN if needed)");
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", ({ data }) => {
    const response = JSON.parse(data); const target = pending.get(response.id);
    if (!target) return;
    clearTimeout(target.timer); pending.delete(response.id);
    if (response.error) target.reject(new Error(JSON.stringify(response.error))); else target.resolve(response);
  });
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  await send("Page.enable"); await send("Runtime.enable");
  fs.mkdirSync(screenshots, { recursive: true });
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: origin });
    await waitFor(() => evaluate('document.readyState === "complete" && document.querySelectorAll("[data-service-card]").length === 3'), "fixture layout");
    await evaluate('document.fonts.ready.then(() => true)');
    await evaluate("document.querySelector('[data-service-card] img').scrollIntoView()");
    await waitFor(() => evaluate("document.querySelector('[data-service-card] img').naturalWidth > 0"), "lazy card image");
    const result = await evaluate(`(() => {
      const cards = [...document.querySelectorAll('[data-service-card], [data-sphere-card]')];
      const img = document.querySelector('[data-service-card] img');
      return { overflow: document.documentElement.scrollWidth > innerWidth,
        columns: [...document.querySelectorAll('.service-grid')].map(g => getComputedStyle(g).gridTemplateColumns.split(' ').length),
        links: cards.map(c => c.querySelectorAll('a').length),
        nested: document.querySelectorAll('a a, a button, a input').length,
        headings: cards.map(c => c.querySelector('h3')?.textContent),
        targets: cards.map(c => { const r=c.querySelector('a').getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }),
        prices: [...document.querySelectorAll('.service-card__price')].map(p => p.textContent.trim()),
        kinds: [...document.querySelectorAll('.service-card__kind')].map(p => p.textContent),
        image: { count: document.querySelectorAll('[data-service-card] img').length, alt: img?.alt, width: img?.width, loaded: img?.complete && img?.naturalWidth > 0, loading: img?.loading },
        empty: document.querySelector('#empty-grid').children.length,
        hrefs: cards.map(c => c.querySelector('a').getAttribute('href')) };
    })()`);
    assert.equal(result.overflow, false, "No overflow at " + width);
    assert.deepEqual(result.columns, [width >= 1280 ? 3 : width >= 768 ? 2 : 1, width >= 1280 ? 3 : width >= 768 ? 2 : 1]);
    assert.deepEqual(result.links, [1, 1, 1, 1, 1, 1]); assert.equal(result.nested, 0);
    assert.ok(result.headings.every(Boolean)); assert.ok(result.targets.every(Boolean));
    assert.deepEqual(result.prices, ["$123.45 USD", "$123.46 USD", "$123.47 USD"]);
    assert.deepEqual(result.kinds, ["Reading", "Spellwork", "Reading"]);
    assert.equal(result.image.count, 1); assert.equal(result.image.alt, "Neutral technical image fixture");
    assert.equal(result.image.loaded, true); assert.equal(result.image.loading, "lazy"); assert.equal(result.empty, 0);
    for (const href of result.hrefs) assert.ok((await fetch(origin + href)).ok, "Fixture target exists: " + href);
    // Inspect the actual accessibility tree, not just DOM text.
    const ax = await send("Accessibility.getFullAXTree");
    const links = ax.result.nodes.filter(n => !n.ignored && n.role?.value === "link");
    assert.equal(links.length, 6); assert.ok(links.every(n => n.name?.value));
    await send("Emulation.setFocusEmulationEnabled", { enabled: true });
    await evaluate('document.body.tabIndex=-1; document.body.focus(); document.body.removeAttribute("tabindex"); window.scrollTo(0, 0)');
    for (const href of result.hrefs) {
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      const focus = await evaluate(`(() => { const a=document.activeElement; const s=getComputedStyle(a); return { href: a.getAttribute('href'), visible: a.matches(':focus-visible'), outline: parseFloat(s.outlineWidth), style: s.outlineStyle }; })()`);
      assert.equal(focus.href, href); assert.equal(focus.visible, true); assert.ok(focus.outline >= 3); assert.equal(focus.style, "solid");
    }
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.service-card__link')).transitionDuration"), "0s");
    await send("Emulation.setEmulatedMedia", { features: [] });
    await evaluate('document.body.tabIndex=-1; document.body.focus(); document.body.removeAttribute("tabindex"); window.scrollTo(0, 0)');
    const layout = await send("Page.getLayoutMetrics");
    const capture = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: layout.result.cssContentSize.height, scale: 1 } });
    fs.writeFileSync(path.join(screenshots, `services-cards-${width}.png`), Buffer.from(capture.result.data, "base64"));
    console.log(`PASS: cards at ${width}px: grid, overflow, labels, price, image fallback, targets, accessibility tree, Tab focus, reduced motion`);
  }
  // Enter activates the native product anchor; no client-side JavaScript needed.
  await evaluate("document.querySelector('.service-card__link').focus()");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor(() => evaluate('location.pathname === "/services/love/qa-product-0/"'), "native link navigation");
  console.log("PASS: native Enter navigation; test products, approvals and routes isolated from production");
} finally {
  socket?.close(); chrome?.kill("SIGTERM"); server?.kill("SIGTERM");
  for (const { timer } of pending.values()) clearTimeout(timer);
  // Allow child processes to release their temporary directories before cleanup.
  await pause(300);
  fs.rmSync(fixture, { recursive: true, force: true });
}
