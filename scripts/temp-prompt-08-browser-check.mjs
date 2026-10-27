// Temporary Prompt 08 browser QA. Removed before review.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4173";
const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", "dist"], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9222",
  "--user-data-dir=/tmp/mystagogia-prompt08-chrome",
  origin + "/about/"
], { stdio: "ignore" });

let socket;
const pending = new Map();
let seq = 0;

async function waitUntil(run, label) {
  for (let tries = 0; tries < 65; tries++) {
    try {
      const value = await run();
      if (value) return value;
    } catch { /* Retry while the server/browser starts. */ }
    await pause(200);
  }
  throw new Error("Timed out waiting for " + label);
}

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("CDP timed out: " + method));
    }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const reply = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (reply.result.exceptionDetails) {
    throw new Error(JSON.stringify(reply.result.exceptionDetails));
  }
  return reply.result.result.value;
}

try {
  await waitUntil(async () => (await fetch(origin + "/about/")).ok, "local About page");
  const tabs = await waitUntil(async () => {
    const res = await fetch("http://127.0.0.1:9222/json/list");
    const found = (await res.json()).find((tab) => tab.type === "page" && tab.webSocketDebuggerUrl);
    return found || null;
  }, "Chrome page");

  socket = new WebSocket(tabs.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const task = pending.get(message.id);
    if (!task) return;
    clearTimeout(task.timer);
    pending.delete(message.id);
    if (message.error) task.reject(new Error(JSON.stringify(message.error)));
    else task.resolve(message);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const width of [375, 768, 1024, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: false
    });
    await send("Page.navigate", { url: origin + "/about/" });
    await waitUntil(async () => await evaluate(
      'document.readyState === "complete" && !!document.querySelector(".about-paths__grid")'
    ), "About page markup");

    const report = await evaluate(`(() => {
      const main = document.querySelector("#main-content");
      const h1 = document.querySelector("#about-title");
      const grid = document.querySelector(".about-paths__grid");
      const paragraph = document.querySelector(".about-introduction p:not(.about-eyebrow)");
      const desktop = document.querySelector(".desktop-navigation");
      const menu = document.querySelector(".mobile-navigation");
      const links = document.querySelectorAll('a[href="/about/"]');
      return {
        viewport: window.innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        heading: h1?.textContent.trim(),
        headingFont: getComputedStyle(h1).fontFamily,
        bodyFont: getComputedStyle(paragraph).fontFamily,
        bodySize: parseFloat(getComputedStyle(paragraph).fontSize),
        columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
        mainCount: document.querySelectorAll("main").length,
        aboutLinks: links.length,
        desktopVisible: getComputedStyle(desktop).display !== "none",
        menuVisible: getComputedStyle(menu).display !== "none",
        mainTop: main?.getBoundingClientRect().top
      };
    })()`);
    console.log("Chrome viewport", width, JSON.stringify(report));
    assert.equal(report.viewport, width);
    assert.ok(report.pageWidth <= width + 1, "No horizontal overflow at " + width);
    assert.equal(report.heading, "About Mystagogia");
    assert.match(report.headingFont, /Cormorant/);
    assert.match(report.bodyFont, /Source Serif/);
    assert.ok(report.bodySize >= 17);
    assert.equal(report.columns, width < 768 ? 1 : 2);
    assert.equal(report.mainCount, 1);
    assert.ok(report.aboutLinks >= 3);
    assert.equal(report.desktopVisible, width >= 1024);
    assert.equal(report.menuVisible, width < 1024);

    if (width === 375) {
      const open = await evaluate(`(() => {
        document.querySelector("[data-menu-trigger]").click();
        return { open: document.querySelector("[data-menu-dialog]").open,
          about: !!document.querySelector('nav[aria-label="Mobile primary navigation"] a[href="/about/"]') };
      })()`);
      assert.ok(open.open && open.about, "Mobile menu opens and includes About");
      await evaluate('document.querySelector("[data-menu-close]").click()');
    }
  }
  console.log("PASS: Chrome responsive layout, typography, navigation, and no overflow");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
