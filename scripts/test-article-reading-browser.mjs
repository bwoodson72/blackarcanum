// Check real static MDX article pages in the temporary fixture build across
// mobile, tablet, laptop and wide desktop using headless Chrome.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4181";
const chromeUrl = "http://127.0.0.1:9241";
const server = spawn("python3", [
  "-m", "http.server", "4181", "--bind", "127.0.0.1", "--directory", "dist",
], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9241",
  "--user-data-dir=/tmp/mystagogia-article-qa-" + process.pid,
  origin + "/library/qa-library-reading/",
], { stdio: "ignore" });

let socket;
let id = 0;
const awaiting = new Map();
async function waitFor(fn, name) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const v = await fn(); if (v) return v; } catch {}
    await pause(200);
  }
  throw new Error("Timeout awaiting " + name);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timer = setTimeout(() => {
      awaiting.delete(request);
      reject(new Error("Chrome CDP timeout " + method));
    }, 10000);
    awaiting.set(request, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const answer = await send("Runtime.evaluate", {
    expression, returnByValue: true, awaitPromise: true,
  });
  if (answer.result.exceptionDetails) throw new Error(
    JSON.stringify(answer.result.exceptionDetails)
  );
  return answer.result.result.value;
}

const pageProbe = [
  "(() => {",
  '  const grid = document.querySelector(".article-reading__grid");',
  '  const column = document.querySelector(".article-reading__article");',
  '  const content = document.querySelector(".article-reading__content");',
  '  const header = document.querySelector(".article-header");',
  '  const hero = header?.querySelector(".article-header__hero");',
  '  const image = hero?.querySelector("img");',
  "  return {",
  "    viewport: innerWidth,",
  "    scrollWidth: document.documentElement.scrollWidth,",
  "    columns: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0,",
  "    articleWidth: column?.getBoundingClientRect().width,",
  "    contentWidth: content?.getBoundingClientRect().width,",
  "    fontSize: content ? parseFloat(getComputedStyle(content).fontSize) : 0,",
  "    lineHeight: content ? parseFloat(getComputedStyle(content).lineHeight) : 0,",
  '    h1: document.querySelectorAll("main h1").length,',
  '    h2: content?.querySelectorAll("h2").length,',
  '    h3: content?.querySelectorAll("h3").length,',
  '    bodyText: content?.textContent,',
  '    title: document.title,',
  '    variant: header?.className,',
  '    hero: !!hero,',
  "    imageFit: image ? getComputedStyle(image).objectFit : null,",
  "    heroRatio: hero ? getComputedStyle(hero).aspectRatio : null,",
  '    breadcrumbs: document.querySelectorAll("nav[aria-label=Breadcrumb] a").length,',
  '    rawByline: !!document.querySelector("[itemprop=author], .author-byline"),',
  '    afterArticle: document.querySelector(".article-reading__context") !== null,',
  "  };",
  "})()",
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/library/qa-library-reading/")).ok,
    "fixture HTTP server");
  const tab = await waitFor(async () => {
    const r = await fetch(chromeUrl + "/json/list");
    return (await r.json()).find((x) => x.type === "page" && x.webSocketDebuggerUrl);
  }, "Chrome remote debugging");
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const target = awaiting.get(message.id);
    if (!target) return;
    clearTimeout(target.timer);
    awaiting.delete(message.id);
    if (message.error) target.reject(new Error(JSON.stringify(message.error)));
    else target.resolve(message);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const [section, slug] of [
    ["library", "qa-library-reading"],
    ["grimoire", "qa-grimoire-reading"],
  ]) {
    for (const width of [375, 768, 1024, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width, height: 900, deviceScaleFactor: 1, mobile: false,
      });
      await send("Page.navigate", { url: origin + "/" + section + "/" + slug + "/" });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && !!document.querySelector(".article-reading__content h2")'
      ), "article DOM at " + width);
      const result = await evaluate(pageProbe);
      console.log("ARTICLE QA " + section + "@" + width + " " + JSON.stringify({
        ...result, bodyText: result.bodyText?.slice(0, 90),
      }));
      assert.equal(result.viewport, width);
      assert.ok(result.scrollWidth <= width + 1, "Never overflow the viewport");
      assert.equal(result.columns, width >= 1440 ? 3 : 1);
      assert.ok(result.articleWidth <= 721, "Reading column must never exceed 720px");
      assert.ok(result.articleWidth >= Math.min(320, width - 60),
        "Reading column must not collapse");
      assert.ok(result.contentWidth <= result.articleWidth + 1);
      assert.ok(result.fontSize >= 16.9 && result.fontSize <= 19.1);
      assert.ok(result.lineHeight > result.fontSize * 1.5, "Readable line spacing");
      assert.equal(result.h1, 1);
      assert.ok(result.h2 >= 1 && result.h3 >= 1);
      assert.ok(result.bodyText.includes(section === "library" ? "Library body marker" : "Grimoire body marker"));
      assert.ok(result.title.includes(section === "library" ? "Research test" : "Practice test"));
      assert.ok(result.variant.includes("article-header--" + section));
      assert.ok(result.breadcrumbs >= 2);
      assert.equal(result.rawByline, false);
      assert.equal(result.afterArticle, false, "No empty contextual sidebar");
      if (section === "grimoire") {
        assert.equal(result.hero, true);
        assert.equal(result.imageFit, "contain");
        assert.equal(result.heroRatio, "3 / 2");
      } else {
        assert.equal(result.hero, false);
      }
    }
  }
  console.log("PASS: real MDX article routes at 375/768/1024/1440, correct 720px reading width and safe media");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
