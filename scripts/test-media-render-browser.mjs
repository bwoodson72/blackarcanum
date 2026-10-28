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

  // Prompt 21: reuse this Chrome session and the same temporary PNG/SVG
  // fixtures to review *both real MDX collections* at phone, middle-desktop
  // breakout, and wide three-column desktop widths.
  for (const width of [375, 1024, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    for (const section of ["library", "grimoire"]) {
      await send("Page.navigate", {
        url: origin + "/" + section + "/qa-mdx-media-" + section + "/",
      });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && document.querySelectorAll("[data-mdx-figure]").length === 4'
      ), section + " MDX figures at " + width);
      const metrics = await evaluate(`(() => {
        const article = document.querySelector(".article-reading__article");
        const figures = [...document.querySelectorAll("[data-mdx-figure]")];
        return {
          viewport: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          articleWidth: article?.getBoundingClientRect().width,
          figures: figures.map((figure) => {
            const rect = figure.getBoundingClientRect();
            const img = figure.querySelector("img");
            const caption = figure.querySelector("figcaption");
            return {
              kind: figure.getAttribute("data-mdx-figure"),
              width: rect.width,
              left: rect.left,
              right: rect.right,
              caption: caption?.textContent?.trim() || "",
              source: caption?.querySelector('a[href="https://example.org/ci-only-reference"]')?.href,
              rights: caption?.querySelector('a[href="https://example.org/ci-only-rights"]')?.href,
              ratio: img?.getBoundingClientRect().width / img?.getBoundingClientRect().height,
              fit: img ? getComputedStyle(img).objectFit : null,
              alt: img?.alt,
              mediaVariant: figure.querySelector("[data-media-variant]")?.getAttribute("data-media-variant"),
            };
          }),
        };
      })()`);
      assert.equal(metrics.viewport, width);
      assert.ok(metrics.scrollWidth <= width + 1,
        "No horizontal overflow at " + section + " viewport " + width);
      assert.ok(metrics.articleWidth <= 721,
        "Main reading column must remain at most 720px");
      assert.deepEqual(metrics.figures.map((f) => f.kind),
        ["article", "reference", "reference", "wide"]);
      const [articleImage, reference, svgReference, wide] = metrics.figures;
      for (const figure of metrics.figures) {
        assert.ok(figure.width > 0 && figure.left >= -1 && figure.right <= width + 1,
          "Figure is within viewport bounds");
        assert.ok(figure.caption.length > 15 && figure.alt.length > 10,
          "Figure and caption must remain understandable to readers");
        assert.equal(figure.fit, "contain",
          "No MDX figure is cropped, including full-width and historic references");
      }
      assert.equal(reference.mediaVariant, "reference");
      assert.equal(svgReference.mediaVariant, "reference");
      assert.ok(Math.abs(reference.ratio - 2 / 3) < 0.03,
        "Detailed portrait reference must preserve its natural aspect ratio");
      assert.ok(Math.abs(svgReference.ratio - 2 / 3) < 0.03,
        "Detailed vector reference must preserve its natural aspect ratio");
      assert.equal(reference.source, "https://example.org/ci-only-reference");
      assert.equal(reference.rights, "https://example.org/ci-only-rights");
      assert.ok(articleImage.caption.includes("Contextual editorial caption"));
      assert.ok(wide.caption.includes("Wider composition"));
      if (width === 1024) {
        assert.ok(wide.width > metrics.articleWidth + 100,
          "FullWidthImage must break out only at a safe middle-desktop width");
      } else {
        assert.ok(wide.width <= metrics.articleWidth + 1,
          "Mobile and three-column desktop figures stay in the reading measure");
      }
      console.log("PASS: " + section + " MDX figures at " + width +
        "px: captions/links, uncropped details, safe breakout, no overflow");
    }
  }
  console.log("PASS: Prompt 21 real MDX figure visual checks at 375px, 1024px and 1440px");

} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
