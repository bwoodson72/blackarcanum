// CI-only browser checks for the empty and 25-entry Grimoire archive.
// The browser sees runner-created fixtures only; no public articles are added.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const mode = process.argv[2];
assert.ok(mode === "--empty" || mode === "--full", "Expected --empty or --full");
const empty = mode === "--empty";
const httpPort = empty ? 4175 : 4176;
const chromePort = empty ? 9235 : 9236;
const origin = "http://127.0.0.1:" + httpPort;
const server = spawn("python3", ["-m", "http.server", String(httpPort),
  "--bind", "127.0.0.1", "--directory", "dist"], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=" + chromePort,
  "--user-data-dir=/tmp/mystagogia-grimoire-" + mode.slice(2) + "-" + process.pid,
  origin + "/grimoire/",
], { stdio: "ignore" });

const awaiting = new Map();
let socket;
let nextId = 0;
async function waitFor(probe, label) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const result = await probe(); if (result) return result; } catch {}
    await delay(200);
  }
  throw new Error("Timed out awaiting " + label);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => {
      awaiting.delete(id);
      reject(new Error("CDP request timed out: " + method));
    }, 10000);
    awaiting.set(id, { resolve, reject, timer });
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

const probeCode = [
  "(() => {",
  '  const lead = document.querySelector(".grimoire-lead");',
  '  const row = document.querySelector(".grimoire-list__item");',
  '  const nav = document.querySelector(".pagination");',
  '  const cards = [...document.querySelectorAll(".grimoire-archive article.article-card")];',
  '  const summary = nav?.querySelector(".pagination__summary");',
  '  const numberLinks = nav?.querySelector(".pagination__pages");',
  '  const controls = nav ? [...nav.querySelectorAll("a.pagination__control")] : [];',
  "  return {",
  "    width: innerWidth,",
  "    scrollWidth: document.documentElement.scrollWidth,",
  '    title: document.title,',
  '    heading: document.querySelector(".grimoire-hero h1")?.textContent?.trim(),',
  '    empty: !!document.querySelector(".grimoire-empty"),',
  '    noindex: !!document.querySelector("meta[name=robots][content*=noindex]"),',
  '    libraryLink: [...document.querySelectorAll(".grimoire-empty a")].find((a) => a.getAttribute("href") === "/library/")?.getAttribute("href"),',
  '    aboutLink: [...document.querySelectorAll(".grimoire-empty a")].find((a) => a.getAttribute("href") === "/about/")?.getAttribute("href"),',
  "    leadColumns: lead ? getComputedStyle(lead).gridTemplateColumns.split(' ').length : 0,",
  "    rowColumns: row ? getComputedStyle(row).gridTemplateColumns.split(' ').length : 0,",
  "    rows: document.querySelectorAll('.grimoire-list__item').length,",
  "    cards: cards.length,",
  "    cardDates: cards.reduce((n,c) => n + c.querySelectorAll('time[datetime]').length, 0),",
  '    links: cards.map((c) => c.querySelector(".article-card__link")?.getAttribute("href")),',
  '    linksPerCard: cards.map((c) => c.querySelectorAll("a").length),',
  '    images: document.querySelectorAll(".grimoire-archive .article-card img").length,',
  '    nestedLinks: document.querySelectorAll("a a").length,',
  "    pagination: !!nav,",
  '    currentPageCount: nav ? nav.querySelectorAll("[aria-current=page]").length : 0,',
  '    prev: nav?.querySelector("a[rel=prev]")?.getAttribute("href"),',
  '    next: nav?.querySelector("a[rel=next]")?.getAttribute("href"),',
  "    summaryVisible: summary ? getComputedStyle(summary).display !== 'none' : null,",
  "    numberLinksVisible: numberLinks ? getComputedStyle(numberLinks).display !== 'none' : null,",
  "    minControlHeight: controls.length ? Math.min(...controls.map((e) => e.getBoundingClientRect().height)) : null,",
  "  };",
  "})()",
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/grimoire/")).ok, "local Grimoire build");
  const tab = await waitFor(async () => {
    const response = await fetch("http://127.0.0.1:" + chromePort + "/json/list");
    return (await response.json()).find((x) => x.type === "page" && x.webSocketDebuggerUrl) || null;
  }, "headless Chrome");
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
  await send("Runtime.enable");
  await send("Page.enable");

  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await send("Page.navigate", { url: origin + "/grimoire/" });
    await waitFor(async () => evaluate(
      'document.readyState === "complete" && !!document.querySelector(".grimoire-hero h1")'
    ), "Grimoire DOM " + width);
    const result = await evaluate(probeCode);
    console.log("CHROME " + mode + " " + width + " " + JSON.stringify(result));
    assert.equal(result.width, width);
    assert.ok(result.scrollWidth <= width + 1, "No horizontal overflow at " + width);
    assert.equal(result.heading, "The Grimoire");
    assert.equal(result.nestedLinks, 0);
    assert.equal(result.images, 0, "No fabricated visuals on text-only entries");

    if (empty) {
      assert.equal(result.empty, true);
      assert.equal(result.noindex, true);
      assert.equal(result.libraryLink, "/library/");
      assert.equal(result.aboutLink, "/about/");
      assert.equal(result.cards, 0);
      assert.equal(result.leadColumns, 0);
      assert.equal(result.rows, 0);
      assert.equal(result.pagination, false);
    } else {
      assert.equal(result.empty, false);
      assert.equal(result.noindex, false);
      assert.equal(result.cards, 12);
      assert.equal(result.rows, 11);
      assert.equal(result.cardDates, 12);
      assert.equal(new Set(result.links).size, 12);
      assert.equal(result.links[0], "/grimoire/qa-25/");
      assert.ok(result.linksPerCard.every((n) => n === 1));
      assert.equal(result.leadColumns, width >= 1024 ? 2 : 1);
      assert.equal(result.rowColumns, width >= 1024 ? 2 : 1);
      assert.equal(result.pagination, true);
      assert.equal(result.currentPageCount, 1);
      assert.equal(result.prev, undefined);
      assert.equal(result.next, "/grimoire/page/2/");
      assert.equal(result.summaryVisible, width < 640);
      assert.equal(result.numberLinksVisible, width >= 640);
      assert.ok(result.minControlHeight >= 43.5);
    }
  }

  if (!empty) {
    for (const [page, prev, next, expectedCards] of [
      [2, "/grimoire/", "/grimoire/page/3/", 12],
      [3, "/grimoire/page/2/", undefined, 1],
    ]) {
      await send("Page.navigate", { url: origin + "/grimoire/page/" + page + "/" });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && document.title.includes("Page ' + page + '")'
      ), "Grimoire numbered page " + page);
      const pageResult = await evaluate(probeCode);
      assert.equal(pageResult.cards, expectedCards);
      assert.equal(pageResult.prev, prev);
      assert.equal(pageResult.next, next);
      assert.equal(pageResult.currentPageCount, 1);
      console.log("PASS: Grimoire numbered page " + page + " navigation and rows");
    }
  }
  console.log("PASS: Grimoire " + mode + " responsive 375/768/1024/1280/1440, empty states, navigation, article metadata");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
