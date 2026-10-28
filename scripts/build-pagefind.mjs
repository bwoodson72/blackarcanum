/**
 * Index only generated, indexable Library/Grimoire articles. Pagefind is
 * skipped on preview-only sites to avoid a fallback crawl of other pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const dist = path.resolve("dist");
const vercelStatic = path.resolve(".vercel/output/static");
const marker = /\bdata-pagefind-body(?:=|[\s>])/i;
const noindex = /<meta\b[^>]*\bname="robots"[^>]*\bcontent="[^"]*\bnoindex\b/i;

export function eligibleArticles(root = dist) {
  if (!fs.existsSync(root)) throw new Error("Build Astro before Pagefind (missing dist).");
  const allowed = [];
  for (const section of ["library", "grimoire"]) {
    const dir = path.join(root, section);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === "page") continue;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name))
        throw new Error("Unexpected article slug " + entry.name);
      const file = path.join(dir, entry.name, "index.html");
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, "utf8");
      const url = "/" + section + "/" + entry.name + "/";
      if (noindex.test(html) && marker.test(html))
        throw new Error("Noindex page has search marker: " + url);
      if (!noindex.test(html) && !marker.test(html))
        throw new Error("Indexable article missing marker: " + url);
      if (!noindex.test(html)) allowed.push(url);
    }
  }
  return allowed.sort();
}
export function verifyMarkers(root = dist, eligible = []) {
  const allowed = new Set(eligible);
  function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "pagefind" || entry.name.startsWith(".")) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) { scan(file); continue; }
      if (entry.name !== "index.html" || !entry.isFile()) continue;
      const url = "/" + path.relative(root,file).split(path.sep).join("/").replace(/index\.html$/, "");
      if (marker.test(fs.readFileSync(file,"utf8")) !== allowed.has(url))
        throw new Error("Unapproved Pagefind body marker: " + url);
    }
  }
  scan(root);
}
export function buildSearchIndex(root = dist) {
  fs.rmSync(path.join(root,"pagefind"), {recursive:true,force:true});
  // Astro's Vercel adapter copies static assets BEFORE this post-build runs.
  // Remove any stale Pagefind output from the final deployment package too.
  if (path.resolve(root) === dist && fs.existsSync(vercelStatic)) {
    fs.rmSync(path.join(vercelStatic,"pagefind"),{recursive:true,force:true});
  }
  const eligible = eligibleArticles(root);
  verifyMarkers(root,eligible);
  if (eligible.length === 0) {
    console.log("Pagefind: no finished articles, no index emitted.");
    return [];
  }
  const cli = path.resolve("node_modules/.bin/pagefind");
  if (!fs.existsSync(cli)) throw new Error("Pagefind CLI absent; run npm ci.");
  const result = spawnSync(cli,["--site",root,"--output-path",path.join(root,"pagefind")],
    {encoding:"utf8",timeout:120000});
  if (result.status !== 0) throw new Error("Pagefind CLI failed: "+
    (result.stdout??"").slice(-2500)+" "+(result.stderr??"").slice(-2500));
  if (!fs.existsSync(path.join(root,"pagefind","pagefind.js")))
    throw new Error("Pagefind did not generate the expected index.");
  fs.writeFileSync(path.join(root,"pagefind","indexed-routes.json"),
    JSON.stringify(eligible)+"\n");
  if (path.resolve(root) === dist && fs.existsSync(vercelStatic)) {
    fs.cpSync(path.join(root,"pagefind"),path.join(vercelStatic,"pagefind"),{recursive:true});
    if (!fs.existsSync(path.join(vercelStatic,"pagefind","pagefind.js")))
      throw new Error("Pagefind was not packaged into Vercel static output.");
  }
  console.log("Pagefind indexed "+eligible.length+" verified articles.");
  return eligible;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  buildSearchIndex();
