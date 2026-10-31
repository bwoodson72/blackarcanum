// Shared isolated-build/CDP lifecycle for focused Services visual checks.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";
export function createServicesFixture(name, port, debugPort) {
  const root = process.cwd();
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), `mystagogia-services-${name}-`));
  const origin = `http://127.0.0.1:${port}`;
  let chrome, server, socket, nextId = 0;
  const pending = new Map();
  const screenshots = process.env.SERVICES_SCREENSHOTS || path.join(fixture, "screenshots");
  function write(name, content) {
    const file = path.join(fixture, name);
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content);
  }
  async function waitFor(probe, label) {
    for (let i = 0; i < 100; i++) {
      try { if (await probe()) return; } catch {}
      await pause(200);
    }
    throw new Error("Timed out awaiting " + label);
  }
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error("CDP timeout: " + method)); }, 10000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    assert.equal(response.result.exceptionDetails, undefined, JSON.stringify(response.result.exceptionDetails));
    return response.result.result.value;
  }
  function build() {
    const result = spawnSync(process.execPath, [fs.realpathSync(path.join(root, "node_modules/.bin/astro")), "build"], { cwd: fixture, encoding: "utf8", timeout: 180000 });
    assert.equal(result.status, 0, "Isolated build failed: " + result.stdout?.slice(-5000) + result.stderr?.slice(-5000));
  }
  async function startBrowser() {
    server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", path.join(fixture, "dist")], { stdio: "ignore" });
    chrome = spawn(process.env.CHROME_BIN || "google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--remote-allow-origins=*", `--remote-debugging-port=${debugPort}`, "--user-data-dir=" + path.join(fixture, "chrome"), origin], { stdio: "ignore" });
    chrome.on("error", (error) => console.error("Browser startup:", error.message));
    await waitFor(async () => (await fetch(origin)).ok, "fixture server");
    let tab;
    await waitFor(async () => { tab = (await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()).find(t => t.type === "page"); return !!tab; }, "headless Chrome (set CHROME_BIN if needed)");
    socket = new WebSocket(tab.webSocketDebuggerUrl);
    socket.addEventListener("message", ({ data }) => {
      const response = JSON.parse(data); const target = pending.get(response.id);
      if (!target) return;
      clearTimeout(target.timer); pending.delete(response.id);
      if (response.error) target.reject(new Error(JSON.stringify(response.error))); else target.resolve(response);
    });
    await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
    await send("Page.enable"); await send("Runtime.enable");
  }
  async function capture(name, width) {
    await evaluate('document.activeElement?.blur(); window.scrollTo(0, 0)');
    const layout = await send("Page.getLayoutMetrics");
    const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: layout.result.cssContentSize.height, scale: 1 } });
    fs.mkdirSync(screenshots, { recursive: true });
    fs.writeFileSync(path.join(screenshots, name), Buffer.from(image.result.data, "base64"));
  }
  async function close() {
    socket?.close(); chrome?.kill("SIGTERM"); server?.kill("SIGTERM");
    for (const { timer } of pending.values()) clearTimeout(timer);
    await pause(300);
    fs.rmSync(fixture, { recursive: true, force: true });
  }
  function prepare() {
    fs.cpSync(path.join(root, "src"), path.join(fixture, "src"), { recursive: true });
    fs.rmSync(path.join(fixture, "src/pages"), { recursive: true });
    fs.cpSync(path.join(root, "public"), path.join(fixture, "public"), { recursive: true });
    fs.copyFileSync(path.join(root, "tsconfig.json"), path.join(fixture, "tsconfig.json"));
    fs.symlinkSync(path.join(root, "node_modules"), path.join(fixture, "node_modules"), "dir");
    write("package.json", JSON.stringify({ type: "module" }));
    write("astro.config.mjs", `import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
export default defineConfig({ cacheDir: './.astro/cache/', vite: { plugins: [tailwindcss()] }, integrations: [mdx()] });`);
  }
  return { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close };
}
