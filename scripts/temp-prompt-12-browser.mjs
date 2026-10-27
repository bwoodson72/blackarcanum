import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4173";
const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", "dist"], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9222",
  "--user-data-dir=/tmp/mystagogia-prompt12-chrome", origin + "/prompt12-qa/"
], { stdio: "ignore" });

let socket;
const pending = new Map();
let seq = 0;
async function waitUntil(run, label) {
  for (let tries = 0; tries < 100; tries++) {
    try { const value = await run(); if (value) return value; } catch {}
    await pause(200);
  }
  throw new Error("Timed out waiting for " + label);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error("Timeout " + method)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const message = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (message.result.exceptionDetails) throw new Error(JSON.stringify(message.result.exceptionDetails));
  return message.result.result.value;
}

try {
  await waitUntil(async () => (await fetch(origin + "/prompt12-qa/")).ok, "fixture");
  const tab = await waitUntil(async () => {
    const resp = await fetch("http://127.0.0.1:9222/json/list");
    return (await resp.json()).find((part) => part.type === "page" && part.webSocketDebuggerUrl) || null;
  }, "Chrome tab");
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    const target = pending.get(msg.id);
    if (!target) return;
    clearTimeout(target.timer);
    pending.delete(msg.id);
    if (msg.error) target.reject(new Error(JSON.stringify(msg.error)));
    else target.resolve(msg);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: origin + "/prompt12-qa/" });
    await waitUntil(async () => evaluate(
      'document.readyState === "complete" && !!document.querySelector("#qa-grid .article-grid")'
    ), "QA markup");
    const report = await evaluate(`(() => {
      const grid = document.querySelector("#qa-grid .article-grid");
      const pager = document.querySelector("#qa-pager nav");
      const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      const all = document.querySelectorAll("article.article-card");
      const variants = [...document.querySelectorAll("#qa-variants .article-card")];
      const anchors = [...document.querySelectorAll("#qa-grid a, #qa-variants a")];
      const paginationLinks = [...pager.querySelectorAll("a")];
      const body = document.documentElement;
      return {
        width: window.innerWidth,
        scrollWidth: body.scrollWidth,
        gridColumns: columns,
        gridCards: grid.querySelectorAll(".article-card").length,
        cardVariants: variants.map((el) => [...el.classList].find((c) => c.startsWith("article-card--"))),
        linksPerCard: [...all].map((article) => article.querySelectorAll("a").length),
        nestedAnchors: document.querySelectorAll("a a").length,
        articleImages: document.querySelectorAll(".article-card img").length,
        emptyGrid: document.querySelector("#qa-empty-grid").innerHTML.trim().length,
        currentCount: pager.querySelectorAll('[aria-current="page"]').length,
        pagerAria: pager.getAttribute("aria-label"),
        pagerLinks: paginationLinks.map((a) => ({ href: a.getAttribute("href"), rel: a.rel })),
        pagerMobileSummaryVisible: getComputedStyle(pager.querySelector(".pagination__summary")).display !== "none",
        pageNumbersVisible: getComputedStyle(pager.querySelector(".pagination__pages")).display !== "none",
        noOnePage: document.querySelector("#qa-one nav") === null,
        noZeroPage: document.querySelector("#qa-zero nav") === null,
        updatedDates: document.querySelectorAll("#qa-metadata time").length,
        headingCount: variants.filter((article) => article.querySelector("h3 a")).length,
        allLinksValid: anchors.every((a) => /^\/(library|grimoire)\/fixture-\d+\/$/.test(a.getAttribute("href"))),
        controlMinHeight: Math.min(...[...pager.querySelectorAll("a")].map((a) => a.getBoundingClientRect().height)),
      };
    })()`);
    console.log("CHROME", width, JSON.stringify(report));
    assert.equal(report.width, width);
    assert.ok(report.scrollWidth <= width + 1, "No horizontal scroll at width " + width);
    assert.equal(report.gridColumns, width >= 1280 ? 3 : width >= 768 ? 2 : 1);
    assert.equal(report.gridCards, 6);
    assert.deepEqual(report.cardVariants,
      ["article-card--standard", "article-card--featured", "article-card--editorial", "article-card--compact"]);
    assert.ok(report.linksPerCard.every((n) => n === 1), "Exactly one focusable link per article card");
    assert.equal(report.nestedAnchors, 0);
    assert.equal(report.articleImages, 0, "Text-only cards have no placeholder images");
    assert.equal(report.emptyGrid, 0);
    assert.equal(report.currentCount, 1);
    assert.equal(report.pagerAria, "Article pagination");
    assert.ok(report.pagerLinks.some((item) => item.href === "/library/page/4/" && item.rel === "prev"));
    assert.ok(report.pagerLinks.some((item) => item.href === "/library/page/6/" && item.rel === "next"));
    assert.equal(report.pagerMobileSummaryVisible, width < 640);
    assert.equal(report.pageNumbersVisible, width >= 640);
    assert.ok(report.noOnePage && report.noZeroPage);
    assert.equal(report.updatedDates, 2);
    assert.equal(report.headingCount, 4);
    assert.ok(report.allLinksValid);
    assert.ok(report.controlMinHeight >= 43.5, "Pagination click target at least 44px high");
  }
  console.log("PASS: card variants, semantic links and metadata, 1/2/3 grid, pagination accessibility, empty state, responsive overflow");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
