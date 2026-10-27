// CI-only Chrome computed-layout and link checks. Runs against an ephemeral
// Python server for dist/, never against user data or the live site.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const mode = process.argv[2];
if (!["--empty", "--full"].includes(mode)) {
  throw new Error("Expected --empty or --full after fixture build");
}
const empty = mode === "--empty";
const httpPort = empty ? 4173 : 4174;
const chromePort = empty ? 9230 : 9231;
const origin = "http://127.0.0.1:" + httpPort;
const chromeUrl = "http://127.0.0.1:" + chromePort;
const server = spawn("python3", ["-m", "http.server", String(httpPort),
  "--bind", "127.0.0.1", "--directory", "dist"], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=" + chromePort,
  "--user-data-dir=/tmp/mystagogia-library-" + (empty ? "empty" : "full") + "-" + process.pid,
  origin + "/library/",
], { stdio: "ignore" });

let socket;
let nextId = 0;
const awaiting = new Map();

async function waitFor(probe, label) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const result = await probe();
      if (result) return result;
    } catch {}
    await pause(200);
  }
  throw new Error("Chrome QA timeout: " + label);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => {
      awaiting.delete(id);
      reject(new Error("CDP timeout: " + method));
    }, 10000);
    awaiting.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression, returnByValue: true, awaitPromise: true,
  });
  if (result.result.exceptionDetails) {
    throw new Error(JSON.stringify(result.result.exceptionDetails));
  }
  return result.result.result.value;
}

const domExpression = [
  "(() => {",
  ' const grid = document.querySelector(".article-grid");',
  ' const nav = document.querySelector(".pagination");',
  ' const summary = nav && nav.querySelector(".pagination__summary");',
  ' const numbers = nav && nav.querySelector(".pagination__pages");',
  ' const controls = nav ? [...nav.querySelectorAll("a.pagination__control")] : [];',
  " return {",
  "  width: window.innerWidth,",
  "  scrollWidth: document.documentElement.scrollWidth,",
  '  h1: document.querySelector(".library-hero h1")?.textContent?.trim(),',
  '  empty: !!document.querySelector(".library-empty"),',
  '  about: document.querySelector(".library-empty__link")?.getAttribute("href"),',
  '  noindex: !!document.querySelector("meta[name=robots][content*=noindex]"),',
  "  columns: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0,",
  '  cards: grid ? grid.querySelectorAll("article.article-card").length : 0,',
  '  cardDates: grid ? grid.querySelectorAll("time[datetime]").length : 0,',
  '  cardUrls: grid ? [...grid.querySelectorAll(".article-card__link")].map((a) => a.getAttribute("href")) : [],',
  '  images: document.querySelectorAll(".article-card img").length,',
  '  nestedLinks: document.querySelectorAll("a a").length,',
  "  pagination: !!nav,",
  '  current: nav ? nav.querySelectorAll("[aria-current=page]").length : 0,',
  '  prev: nav?.querySelector("a[rel=prev]")?.getAttribute("href"),',
  '  next: nav?.querySelector("a[rel=next]")?.getAttribute("href"),',
  '  summaryVisible: summary ? getComputedStyle(summary).display !== "none" : null,',
  '  numbersVisible: numbers ? getComputedStyle(numbers).display !== "none" : null,',
  "  minControlHeight: controls.length ? Math.min(...controls.map((a) => a.getBoundingClientRect().height)) : null,",
  " };",
  "})()",
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/library/")).ok, "local fixture server");

  const tab = await waitFor(async () => {
    const response = await fetch(chromeUrl + "/json/list");
    return (await response.json()).find((item) =>
      item.type === "page" && item.webSocketDebuggerUrl) || null;
  }, "headless Chrome tab");
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const response = JSON.parse(event.data);
    const target = awaiting.get(response.id);
    if (!target) return;
    clearTimeout(target.timeout);
    awaiting.delete(response.id);
    if (response.error) target.reject(new Error(JSON.stringify(response.error)));
    else target.resolve(response);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await send("Page.navigate", { url: origin + "/library/" });
    await waitFor(async () => evaluate(
      'document.readyState === "complete" && document.querySelector(".library-hero h1") !== null'
    ), "Library markup at " + width);
    const probe = await evaluate(domExpression);
    console.log("CHROME " + mode + " " + width + ": " + JSON.stringify(probe));
    assert.equal(probe.width, width);
    assert.ok(probe.scrollWidth <= width + 1, "Horizontal overflow at " + width);
    assert.equal(probe.h1, "The Library");
    assert.equal(probe.nestedLinks, 0);
    assert.equal(probe.images, 0, "Text-only fixtures never create blank artwork");

    if (empty) {
      assert.equal(probe.empty, true);
      assert.equal(probe.about, "/about/");
      assert.equal(probe.noindex, true);
      assert.equal(probe.columns, 0);
      assert.equal(probe.cards, 0);
      assert.equal(probe.pagination, false);
    } else {
      assert.equal(probe.empty, false);
      assert.equal(probe.noindex, false);
      assert.equal(probe.columns, width >= 1280 ? 3 : width >= 768 ? 2 : 1);
      assert.equal(probe.cards, 12);
      assert.equal(probe.cardDates, 12);
      assert.equal(new Set(probe.cardUrls).size, 12);
      assert.equal(probe.cardUrls[0], "/library/qa-25/");
      assert.equal(probe.pagination, true);
      assert.equal(probe.current, 1);
      assert.equal(probe.prev, undefined);
      assert.equal(probe.next, "/library/page/2/");
      assert.equal(probe.summaryVisible, width < 640);
      assert.equal(probe.numbersVisible, width >= 640);
      assert.ok(probe.minControlHeight >= 43.5, "Interactive page control height");
    }
  }

  if (!empty) {
    for (const [page, prev, next, expectedCards] of [
      [2, "/library/", "/library/page/3/", 12],
      [3, "/library/page/2/", undefined, 1],
    ]) {
      await send("Page.navigate", { url: origin + "/library/page/" + page + "/" });
      await waitFor(async () => evaluate(
        'document.title.includes("Page ' + page + '") && document.readyState === "complete"'
      ), "archive page " + page);
      const result = await evaluate(domExpression);
      assert.equal(result.cards, expectedCards);
      assert.equal(result.prev, prev);
      assert.equal(result.next, next);
      assert.equal(result.current, 1);
      console.log("PASS: real archive page " + page + " previous/next links and cards");
    }
  }
  console.log("PASS: " + mode + " 375/768/1024/1280/1440 responsive layout, headings, semantics and pagination");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
