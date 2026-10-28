// Prompt 20 — real browser QA for test-only Astro-generated images.
// The fixture creator removes all unapproved assets before this runs.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4189";
const cdp = "http://127.0.0.1:9249";
const server = spawn("python3", [
  "-m", "http.server", "4189", "--bind", "127.0.0.1", "--directory", "dist",
], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9249",
  "--user-data-dir=/tmp/mystagogia-image-render-qa-" + process.pid,
  origin + "/qa-media-render/",
], { stdio: "ignore" });

let socket;
let nextId = 0;
const pending = new Map();
async function waitFor(probe, description) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if (await probe()) return; } catch {}
    await pause(200);
  }
  throw new Error("Timed out waiting for " + description);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Chrome CDP timed out: " + method));
    }, 12000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression, returnByValue: true, awaitPromise: true,
  });
  if (response.result.exceptionDetails) {
    throw new Error(JSON.stringify(response.result.exceptionDetails));
  }
  return response.result.result.value;
}
const probe = [
  "(() => {",
  '  const variants = [...document.querySelectorAll("[data-media-variant]")];',
  "  return {",
  "    viewport: innerWidth,",
  "    scrollWidth: document.documentElement.scrollWidth,",
  "    blocks: variants.map((wrapper) => {",
  "      const img = wrapper.querySelector('img');",
  "      const section = wrapper.closest('section');",
  "      const rect = wrapper.getBoundingClientRect();",
  "      const imageRect = img?.getBoundingClientRect();",
  "      return {",
  "        variant: wrapper.dataset.mediaVariant,",
  "        width: rect.width, height: rect.height,",
  "        imageWidth: imageRect?.width, imageHeight: imageRect?.height,",
  "        sectionWidth: section?.getBoundingClientRect().width,",
  "        naturalWidth: img?.naturalWidth, naturalHeight: img?.naturalHeight,",
  "        complete: img?.complete,",
  "        currentSrc: img?.currentSrc,",
  "        loading: img?.loading, fetchPriority: img?.fetchPriority,",
  "        alt: img?.alt, roleHidden: wrapper.getAttribute('aria-hidden'),",
  "        fit: img ? getComputedStyle(img).objectFit : null,",
  "        aspect: getComputedStyle(wrapper).aspectRatio,",
  "        sources: wrapper.querySelectorAll('source').length,",
  "        hasSrcset: !!(img?.getAttribute('srcset') || wrapper.querySelector('source[srcset]')),",
  "      };",
  "    }),",
  "  };",
  "})()",
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/qa-media-render/")).ok,
    "local media fixture server");
  const tab = await (async () => {
    let found;
    await waitFor(async () => {
      const list = await (await fetch(cdp + "/json/list")).json();
      found = list.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      return !!found;
    }, "Chrome debugger tab");
    return found;
  })();

  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const job = pending.get(message.id);
    if (!job) return;
    clearTimeout(job.timer);
    pending.delete(message.id);
    if (message.error) job.reject(new Error(JSON.stringify(message.error)));
    else job.resolve(message);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const width of [375, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await send("Page.navigate", { url: origin + "/qa-media-render/" });
    await waitFor(async () => evaluate(
      'document.readyState === "complete" && document.querySelectorAll("[data-media-variant]").length === 5'
    ), "five image contexts at width " + width);

    // Lazy images load only when close to the viewport. Bring each fixture
    // into view; do not misdiagnose correct lazy-loading as an absent image.
    for (let i = 0; i < 5; i++) {
      await evaluate(
        'document.querySelectorAll("[data-media-variant]")[' + i + '].scrollIntoView({block:"center"})'
      );
      await waitFor(async () => evaluate(
        '(() => {const img=document.querySelectorAll("[data-media-variant]")[' + i +
        '].querySelector("img");return img && img.complete && img.naturalWidth > 0;})()'
      ), "loaded local image #" + i + " at " + width);
    }

    const current = await evaluate(probe);
    console.log("MEDIA BROWSER @" + width + " " + JSON.stringify(current));
    assert.equal(current.viewport, width);
    assert.ok(current.scrollWidth <= width + 1, "No horizontal overflow");
    assert.deepEqual(current.blocks.map((block) => block.variant),
      ["card", "hero", "reference", "reference", "decorative"]);
    assert.equal(current.blocks.length, 5);

    for (const [i, block] of current.blocks.entries()) {
      assert.ok(block.complete && block.naturalWidth > 0 && block.naturalHeight > 0,
        "All locally optimized images must load, including SVG and PNG #" + i);
      assert.ok(block.currentSrc?.startsWith(origin + "/"),
        "Browser must request local media, not remote source URLs");
      assert.ok(block.width > 0 && block.width <= block.sectionWidth + 1,
        "Rendered media cannot exceed its layout cell");
      assert.ok(block.imageWidth > 0 && block.imageWidth <= block.width + 1);
      assert.ok(block.imageHeight > 0);
    }

    const [card, hero, reference, vector, ornament] = current.blocks;
    assert.equal(card.loading, "lazy");
    assert.equal(hero.loading, "eager");
    assert.equal(hero.fetchPriority, "high");
    assert.equal(reference.loading, "lazy");
    assert.equal(vector.loading, "lazy");
    assert.equal(ornament.loading, "lazy");
    assert.equal(card.fit, "cover", "Only card crops are allowed");
    assert.equal(hero.fit, "contain");
    assert.equal(reference.fit, "contain");
    assert.equal(vector.fit, "contain");
    assert.equal(ornament.fit, "contain");
    assert.equal(card.hasSrcset, true, "Card raster must have a responsive srcset");
    assert.equal(hero.hasSrcset, true, "Hero raster must have a responsive srcset");
    assert.equal(reference.hasSrcset, true, "Reference raster must have a responsive srcset");
    assert.equal(card.sources, 2, "AVIF and WebP fallback sources");
    assert.equal(hero.sources, 2, "AVIF and WebP fallback sources");
    assert.equal(vector.hasSrcset, false, "Vector image should stay vector");
    assert.ok(Math.abs(reference.width / reference.height - 2 / 3) < 0.03,
      "Reference portrait must keep its natural aspect ratio, never 3:2 crop");
    assert.ok(Math.abs(vector.width / vector.height - 2 / 3) < 0.03,
      "Reference SVG must preserve full intrinsic composition");
    assert.ok(Math.abs(card.width / card.height - 3 / 2) < 0.03,
      "Card thumbnails may intentionally use 3:2 composition");
    assert.ok(!card.roleHidden && !hero.roleHidden && !reference.roleHidden);
    assert.equal(ornament.roleHidden, "true");
    assert.equal(ornament.alt, "");
    for (const item of [card, hero, reference, vector]) {
      assert.ok(item.alt?.length > 12, "Informative alt text retained in the DOM");
    }
    console.log("PASS: " + width + "px no overflow, five local image assets loaded, srcset, priority, cropping and reference ratios");
  }
  console.log("PASS: Prompt 20 real browser tests for 375px and 1440px");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
