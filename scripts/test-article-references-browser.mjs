// Browser and print-mode acceptance of temporary Prompt 17 MDX fixtures.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

const origin = "http://127.0.0.1:4187";
const cdp = "http://127.0.0.1:9247";
const server = spawn("python3", [
  "-m", "http.server", "4187", "--bind", "127.0.0.1", "--directory", "dist",
], { stdio: "ignore" });
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=9247",
  "--user-data-dir=/tmp/mystagogia-refs-qa-" + process.pid,
  origin + "/library/qa-source-notes/",
], { stdio: "ignore" });

let socket;
let nextId = 0;
const pending = new Map();
async function waitFor(probe, name) {
  for (let i = 0; i < 100; i++) {
    try { const result = await probe(); if (result) return result; } catch {}
    await pause(200);
  }
  throw new Error("Timed out waiting for " + name);
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("CDP method timeout: " + method));
    }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression, returnByValue: true, awaitPromise: true,
  });
  if (result.result.exceptionDetails) throw new Error(JSON.stringify(result.result.exceptionDetails));
  return result.result.result.value;
}
const getState = [
  "(() => {",
  '  const article = document.querySelector(".article-reading__article");',
  '  const references = document.querySelector(".article-references");',
  '  const source = document.querySelector("#article-source-fixture-primary");',
  '  const inlineLink = document.querySelector("#citation-ref-1 a");',
  '  const note = document.querySelector("#citation-note-1");',
  '  const backlink = note?.querySelector(".article-references__backlink");',
  '  const printUrl = document.querySelector(".article-references__print-url");',
  '  const toc = document.querySelector(".article-reading__mobile-toc");',
  '  return {',
  '    viewport: innerWidth,',
  '    scrollWidth: document.documentElement.scrollWidth,',
  '    readingWidth: article?.getBoundingClientRect().width,',
  '    bibliography: !!source,',
  '    notes: !!references?.querySelector("#article-notes-title"),',
  '    inlineHref: inlineLink?.getAttribute("href"),',
  '    inlineLabel: inlineLink?.getAttribute("aria-label"),',
  '    backlinkHref: backlink?.getAttribute("href"),',
  '    backlinkLabel: backlink?.getAttribute("aria-label"),',
  '    noteBreak: note ? getComputedStyle(note).breakInside : null,',
  '    notesVisible: references ? getComputedStyle(references).display : null,',
  '    tocDisplay: toc ? getComputedStyle(toc).display : null,',
  '    backlinkDisplay: backlink ? getComputedStyle(backlink).display : null,',
  '    printUrlDisplay: printUrl ? getComputedStyle(printUrl).display : null,',
  '    sourceTitle: source?.textContent,',
  '  };',
  '})()',
].join("\n");

try {
  await waitFor(async () => (await fetch(origin + "/library/qa-source-notes/")).ok,
    "test server");
  const tab = await waitFor(async () => {
    const response = await fetch(cdp + "/json/list");
    return (await response.json()).find((candidate) => candidate.type === "page" && candidate.webSocketDebuggerUrl);
  }, "Chrome debugger tab");

  socket = new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    const request = pending.get(msg.id);
    if (!request) return;
    clearTimeout(request.timer);
    pending.delete(msg.id);
    if (msg.error) request.reject(new Error(JSON.stringify(msg.error)));
    else request.resolve(msg);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");

  for (const [section, slug] of [
    ["library", "qa-source-notes"],
    ["grimoire", "qa-grimoire-citation"],
  ]) {
    for (const width of [375, 1440]) {
      await send("Emulation.setEmulatedMedia", { media: "screen" });
      await send("Emulation.setDeviceMetricsOverride", {
        width, height: 900, deviceScaleFactor: 1, mobile: false,
      });
      await send("Page.navigate", { url: origin + "/" + section + "/" + slug + "/" });
      await waitFor(async () => evaluate(
        'document.readyState === "complete" && !!document.querySelector("#citation-note-1")'
      ), section + " reference notes at " + width);
      const result = await evaluate(getState);
      assert.equal(result.viewport, width);
      assert.ok(result.scrollWidth <= width + 1, "References may not create horizontal overflow");
      assert.ok(result.readingWidth <= 721, "720px reading width remains intact");
      assert.ok(result.bibliography && result.notes);
      assert.equal(result.inlineHref, "#citation-note-1");
      assert.ok(result.inlineLabel.includes("Source reference 1"));
      assert.equal(result.backlinkHref, "#citation-ref-1");
      assert.ok(result.backlinkLabel.includes("Return to source reference 1"));
      assert.ok(result.sourceTitle.includes("CI-only Test Primary Source"));

      // Test an actual keyboard-activated return link, not merely href text.
      await send("Page.bringToFront");
      await send("Emulation.setFocusEmulationEnabled", { enabled: true });
      const focused = await evaluate(
        '(() => {const link=document.querySelector("#citation-note-1 .article-references__backlink");' +
        'link.focus();return {tag:document.activeElement?.tagName,href:document.activeElement?.getAttribute("href")};})()'
      );
      assert.equal(focused.tag, "A");
      assert.equal(focused.href, "#citation-ref-1");
      const enter = { key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 };
      await send("Input.dispatchKeyEvent", {
        type: "keyDown", ...enter, text: "\r", unmodifiedText: "\r",
      });
      await send("Input.dispatchKeyEvent", { type: "keyUp", ...enter });
      await waitFor(async () => evaluate('location.hash === "#citation-ref-1"'),
        "keyboard Enter to inline source reference");

      if (section === "library") {
        await send("Emulation.setEmulatedMedia", { media: "print" });
        const printed = await evaluate(getState);
        assert.ok(printed.bibliography && printed.notes,
          "Print view retains the source and its numbered citation notes");
        assert.notEqual(printed.notesVisible, "none");
        assert.equal(printed.backlinkDisplay, "none",
          "Print view removes screen-only return arrows");
        assert.equal(printed.printUrlDisplay, "inline",
          "Print view includes the stable URL as text");
        assert.equal(printed.tocDisplay, "none",
          "Print view omits mobile contents controls");
        assert.equal(printed.noteBreak, "avoid",
          "Print keeps each source note together");
        await send("Emulation.setEmulatedMedia", { media: "screen" });
      }
      console.log("PASS: " + section + "@" + width +
        " keyboard citation/return and print-safe reading layout");
    }
  }
  await send("Page.navigate", { url: origin + "/grimoire/qa-no-references/" });
  await waitFor(async () => evaluate('document.readyState === "complete" && !!document.querySelector("main article")'),
    "uncited Grimoire article");
  assert.equal(await evaluate('!!document.querySelector(".article-references")'), false);
  console.log("PASS: uncited article has no references landmark");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
