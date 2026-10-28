// Prompt 16: real browser acceptance, including native keyboard disclosure,
// actual MDX heading IDs, click navigation, sticky rail, and reading width.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4186";
const cdp = "http://127.0.0.1:9246";
const server = spawn("python3", [
  "-m", "http.server", "4186", "--bind", "127.0.0.1", "--directory", "dist",
], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9246",
  "--user-data-dir=/tmp/mystagogia-toc-qa-" + process.pid,
  origin + "/library/qa-toc-long/",
], { stdio: "ignore" });

let socket;
let nextId = 0;
const pending = new Map();
async function waitFor(probe, label) {
  for (let i = 0; i < 100; i++) {
    try { const value = await probe(); if (value) return value; } catch {}
    await pause(200);
  }
  throw new Error("Timed out awaiting " + label);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Chrome CDP timeout: " + method));
    }, 10000);
    pending.set(id, { resolve, reject, timer });
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
const probeCode = [
  "(() => {",
  '  const grid = document.querySelector(".article-reading__grid");',
  '  const reader = document.querySelector(".article-reading__article");',
  '  const body = document.querySelector(".article-reading__content");',
  '  const rail = document.querySelector(".article-reading__toc");',
  '  const mobile = document.querySelector(".article-reading__mobile-toc");',
  '  const disclosure = document.querySelector(".article-toc--disclosure");',
  '  const railNav = document.querySelector(".article-toc--rail");',
  "  return {",
  "    viewport: innerWidth,",
  "    scrollWidth: document.documentElement.scrollWidth,",
  "    cols: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0,",
  "    readWidth: reader?.getBoundingClientRect().width,",
  "    fontSize: body ? parseFloat(getComputedStyle(body).fontSize) : 0,",
  "    h1: document.querySelectorAll('main h1').length,",
  "    headings: body ? [...body.querySelectorAll('h2,h3')].map((h) => h.id) : [],",
  "    tocRail: !!rail,",
  "    railDisplay: rail ? getComputedStyle(rail).display : null,",
  "    railPosition: rail ? getComputedStyle(rail).position : null,",
  "    tocMobile: !!mobile,",
  "    mobileDisplay: mobile ? getComputedStyle(mobile).display : null,",
  "    nativeDetails: disclosure?.tagName === 'DETAILS',",
  "    summaryPresent: !!disclosure?.querySelector('summary'),",
  "    detailsOpen: disclosure?.open ?? false,",
  "    linkRail: railNav ? [...railNav.querySelectorAll('a')].map((a) => a.getAttribute('href')) : [],",
  "    linkMobile: disclosure ? [...disclosure.querySelectorAll('a')].map((a) => a.getAttribute('href')) : [],",
  "    anchorOffset: body?.querySelector('h2') ? parseFloat(getComputedStyle(body.querySelector('h2')).scrollMarginTop) : 0,",
  '    contextPresent: !!document.querySelector(".article-reading__context"),',
  '    headingTitle: document.querySelector("#article-title")?.textContent?.trim(),',
  "  };",
  "})()",
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/library/qa-toc-long/")).ok,
    "local article fixture web server");
  const tab = await waitFor(async () => {
    const response = await fetch(cdp + "/json/list");
    return (await response.json()).find((item) => item.type === "page" && item.webSocketDebuggerUrl);
  }, "headless Chrome tab");

  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const waiter = pending.get(message.id);
    if (!waiter) return;
    clearTimeout(waiter.timer);
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(JSON.stringify(message.error)));
    else waiter.resolve(message);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const section of ["library", "grimoire"]) {
    const expected = section === "library"
      ? ["origins", "preparation", "preparation-1", "interpretation", "origins-1"]
      : ["method", "notes", "notes-1", "observations", "method-1"];
    const links = expected.map((slug) => "#" + slug);

    for (const width of [375, 768, 1024, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width, height: 900, deviceScaleFactor: 1, mobile: false,
      });
      await send("Page.navigate", { url: origin + "/" + section + "/qa-toc-long/" });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && !!document.querySelector(".article-reading__content h2")'
      ), "published " + section + " MDX at " + width);

      const actual = await evaluate(probeCode);
      console.log("TOC BROWSER " + section + "@" + width + " " + JSON.stringify(actual));
      assert.equal(actual.viewport, width);
      assert.ok(actual.scrollWidth <= width + 1, "No horizontal page overflow");
      assert.equal(actual.cols, width >= 1440 ? 3 : 1, "Only wide desktop gets three columns");
      assert.ok(actual.readWidth <= 721, "The central reading width must stay at or under 720px");
      assert.ok(actual.readWidth >= Math.min(320, width - 60), "No squeezed reading measure");
      assert.ok(actual.fontSize >= 16.9 && actual.fontSize <= 19.1);
      assert.equal(actual.h1, 1);
      assert.deepEqual(actual.headings, expected, "Real MDX heading IDs are deterministic and unique");
      assert.equal(new Set(actual.headings).size, 5);
      assert.deepEqual(actual.linkRail, links);
      assert.deepEqual(actual.linkMobile, links);
      assert.equal(actual.tocRail, true);
      assert.equal(actual.tocMobile, true);
      assert.equal(actual.nativeDetails, true);
      assert.equal(actual.summaryPresent, true);
      assert.equal(actual.detailsOpen, false, "Mobile contents start collapsed");
      assert.ok(actual.anchorOffset >= 80, "Anchored headings clear the site header");
      assert.equal(actual.contextPresent, false, "No fabricated right sidebar");

      if (width < 1440) {
        assert.equal(actual.railDisplay, "none", "No duplicate visible navigation on mobile/tablet");
        assert.notEqual(actual.mobileDisplay, "none");
      } else {
        assert.equal(actual.mobileDisplay, "none");
        assert.notEqual(actual.railDisplay, "none", "Wide screens show the TOC rail");
        assert.equal(actual.railPosition, "sticky");
      }

      if (width === 375 || width === 768) {
        // Enter activates native summary on a character/keypress input, not
        // a rawKeyDown alone. Ensure the target tab has keyboard focus.
        await send("Page.bringToFront");
        await send("Emulation.setFocusEmulationEnabled", { enabled: true });
        const focused = await evaluate(
          '(() => {document.querySelector(".article-toc--disclosure summary").focus(); return document.activeElement?.tagName;})()'
        );
        assert.equal(focused, "SUMMARY", "Native disclosure is keyboard-focusable");
        const enter = { key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 };
        await send("Input.dispatchKeyEvent", {
          type: "keyDown", ...enter, text: "\r", unmodifiedText: "\r",
        });
        await send("Input.dispatchKeyEvent", { type: "keyUp", ...enter });
        if (!(await evaluate('document.querySelector(".article-toc--disclosure").open'))) {
          // Space is the other standard keyboard activation for native summary.
          const space = { key: " ", code: "Space", windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 };
          await send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...space });
          await send("Input.dispatchKeyEvent", { type: "keyUp", ...space });
        }
        await waitFor(async () => evaluate(
          'document.querySelector(".article-toc--disclosure").open'
        ), "native keyboard Enter/Space summary expansion");
        const open = await evaluate('document.querySelector(".article-toc--disclosure").open');
        assert.equal(open, true);
        const duplicate = "#" + expected[2];
        const clickExpression = '(() => {const link = [...document.querySelectorAll(".article-toc--disclosure a")]' +
          '.find((a) => a.getAttribute("href") === ' + JSON.stringify(duplicate) +
          '); link.click();})()';
        await evaluate(clickExpression);
        await waitFor(async () => evaluate(
          "location.hash === " + JSON.stringify(duplicate)
        ), "heading anchor navigation");
        const anchorExpr = '(() => {const h = document.getElementById(' +
          JSON.stringify(expected[2]) +
          '); return {tag: h?.tagName, top: h?.getBoundingClientRect().top};})()';
        const anchor = await evaluate(anchorExpr);
        assert.equal(anchor.tag, "H3");
        assert.ok(anchor.top >= -1, "The target heading remains in the viewport");
      }
    }

    // Short published articles retain headings and readable text, but omit
    // both TOC landmark and details entirely, at mobile and wide desktop.
    for (const width of [375, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width, height: 900, deviceScaleFactor: 1, mobile: false,
      });
      await send("Page.navigate", { url: origin + "/" + section + "/qa-toc-short/" });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && !!document.querySelector(".article-reading__content h2")'
      ), "short article " + section + "@" + width);
      const result = await evaluate(probeCode);
      assert.equal(result.tocRail, false);
      assert.equal(result.tocMobile, false);
      assert.ok(result.readWidth <= 721);
      assert.ok(result.scrollWidth <= width + 1);
      assert.deepEqual(result.headings, ["short-overview", "brief-note"]);
    }
  }
  console.log("PASS: Prompt 16 keyboard disclosure, real duplicate heading anchors, sticky desktop rail, 375/768/1024/1440 widths and short articles");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
