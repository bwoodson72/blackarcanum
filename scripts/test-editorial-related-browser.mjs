// Prompt 18: real Chrome checks for 375/768/1024/1440 responsive links
// and keyboard navigation. Runs after isolated fixture build, using dist only.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4188";
const cdp = "http://127.0.0.1:9248";
const server = spawn("python3", [
  "-m", "http.server", "4188", "--bind", "127.0.0.1", "--directory", "dist",
], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9248",
  "--user-data-dir=/tmp/mystagogia-related-qa-" + process.pid,
  origin + "/library/qa-reading/",
], { stdio: "ignore" });

let socket;
let nextId = 0;
const pending = new Map();

async function waitFor(probe, label) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if (await probe()) return; } catch {}
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
  const response = await send("Runtime.evaluate", {
    expression, returnByValue: true, awaitPromise: true,
  });
  if (response.result.exceptionDetails) {
    throw new Error(JSON.stringify(response.result.exceptionDetails));
  }
  return response.result.result.value;
}
const query = [
  "(() => {",
  '  const block = document.querySelector(".related-articles");',
  '  const list = block?.querySelector(".related-articles__list");',
  '  const reading = document.querySelector(".article-reading__article");',
  '  const links = [...(list?.querySelectorAll("a") || [])];',
  '  return {',
  '    viewport: innerWidth,',
  '    scrollWidth: document.documentElement.scrollWidth,',
  '    readWidth: reading?.getBoundingClientRect().width,',
  '    heading: !!document.querySelector("#related-reading-heading"),',
  '    variant: block?.className,',
  '    columns: list ? getComputedStyle(list).gridTemplateColumns.split(" ").length : 0,',
  '    hrefs: links.map((a) => a.getAttribute("href")),',
  '    labels: links.map((a) => a.textContent?.trim()),',
  '    titleCount: list?.querySelectorAll("h3").length ?? 0,',
  '    previewText: list?.textContent?.includes("Layout preview") ?? false,',
  '  };',
  "})()",
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/library/qa-reading/")).ok,
    "isolated fixture server");
  let tab;
  await waitFor(async () => {
    const response = await fetch(cdp + "/json/list");
    tab = (await response.json()).find((candidate) =>
      candidate.type === "page" && candidate.webSocketDebuggerUrl
    );
    return !!tab;
  }, "Chrome debugging tab");

  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const result = JSON.parse(event.data);
    const target = pending.get(result.id);
    if (!target) return;
    clearTimeout(target.timer);
    pending.delete(result.id);
    if (result.error) target.reject(new Error(JSON.stringify(result.error)));
    else target.resolve(result);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const section of ["library", "grimoire"]) {
    const slug = section === "library" ? "qa-reading" : "qa-practice";
    const hrefs = section === "library"
      ? ["/grimoire/qa-practice/", "/library/qa-context/"]
      : ["/library/qa-reading/", "/library/qa-context/"];
    const style = section === "library" ? "compact" : "cards";

    for (const width of [375, 768, 1024, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width, height: 900, deviceScaleFactor: 1, mobile: false,
      });
      await send("Page.navigate", { url: origin + "/" + section + "/" + slug + "/" });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && !!document.querySelector(".related-articles__list a")'
      ), section + " related links at " + width);
      const current = await evaluate(query);
      console.log("RELATED BROWSER " + section + "@" + width + " " + JSON.stringify(current));
      assert.equal(current.viewport, width);
      assert.ok(current.scrollWidth <= width + 1, "No horizontal overflow");
      assert.ok(current.readWidth <= 721, "Reading column must remain at most 720px");
      assert.ok(current.readWidth >= Math.min(320, width - 60), "Reading width must not collapse");
      assert.equal(current.heading, true);
      assert.ok(current.variant.includes("related-articles--" + style));
      assert.deepEqual(current.hrefs, hrefs, "Only curated links, in author order");
      assert.equal(current.titleCount, 2);
      assert.equal(current.previewText, false, "Test fixture must not invent preview status");
      assert.equal(current.columns, style === "cards" && width >= 768 ? 2 : 1);

      // Keyboard Enter on the first related link must navigate to the correct
      // stable route, including a cross-collection destination.
      if (width === 375 || width === 1440) {
        await send("Page.bringToFront");
        await send("Emulation.setFocusEmulationEnabled", { enabled: true });
        const focused = await evaluate(
          '(() => {const a=document.querySelector(".related-articles__list a");' +
          'a.focus();return {tag:document.activeElement?.tagName,href:document.activeElement?.getAttribute("href")};})()'
        );
        assert.equal(focused.tag, "A");
        assert.equal(focused.href, hrefs[0]);
        const enter = { key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 };
        await send("Input.dispatchKeyEvent", {
          type: "keyDown", ...enter, text: "\r", unmodifiedText: "\r",
        });
        await send("Input.dispatchKeyEvent", { type: "keyUp", ...enter });
        await waitFor(async () => evaluate(
          "location.pathname === " + JSON.stringify(hrefs[0])
        ), "keyboard navigation to " + hrefs[0]);
      }
    }
  }

  for (const width of [375, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await send("Page.navigate", { url: origin + "/library/qa-context/" });
    await waitFor(async () => evaluate(
      'document.readyState === "complete" && !!document.querySelector("main article")'
    ), "article without relationships at " + width);
    const result = await evaluate(query);
    assert.equal(result.heading, false, "No empty related-reading heading");
    assert.deepEqual(result.hrefs, []);
    assert.ok(result.scrollWidth <= width + 1);
  }
  console.log("PASS: 375/768/1024/1440 layouts, card/compact variants, cross-collection keyboard links and empty state");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
