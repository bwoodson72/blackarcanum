/** Temporary published/draft/review integration fixtures, removed after one build. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { eligibleArticles, verifyMarkers } from "./build-pagefind.mjs";

const fixtures = [
  { collection:"library", slug:"qa-pagefind-library", status:"published", phrase:"Lanternward astral timbers draw the archive together." },
  { collection:"grimoire", slug:"qa-pagefind-grimoire", status:"published", phrase:"Moonpetal vellum praxis holds a distinct method." },
  { collection:"library", slug:"qa-pagefind-draft", status:"draft", phrase:"ForbiddenDraftWord vermilion cave basalt." },
  { collection:"grimoire", slug:"qa-pagefind-review", status:"review", phrase:"ForbiddenReviewWord silver orchard stone." },
  { collection:"library", slug:"qa-pagefind-preview", status:"published", preview:true, phrase:"ForbiddenPreviewWord brittle crystal room." },
];
const entryPath=(x)=>path.join("src/content",x.collection,x.slug+".mdx");
for (const f of fixtures) assert.ok(!fs.existsSync(entryPath(f)), "Refusing to overwrite an editorial article");
try {
  for (const f of fixtures) {
    const mdx=["---","slug: "+f.slug,"title: QA Synthetic "+f.collection+" Entry",
      "description: Distinct QA description for indexing. Not published scholarship.",
      "status: "+f.status,...(f.preview?["preview: true"]:[]),
      ...(f.status==="published"?["publishedAt: 2026-10-28"]:[]),
      "---","","## Methodological context","",f.phrase,""].join("\n");
    fs.writeFileSync(entryPath(f),mdx);
  }
  const proc=spawnSync("npm",["run","build"],{encoding:"utf8",timeout:180000});
  if (proc.status!==0)throw new Error("Astro+Pagefind build failed:\n"+
    (proc.stdout??"").slice(-4500)+"\n"+(proc.stderr??"").slice(-4500));
  const allowed=["/grimoire/qa-pagefind-grimoire/","/library/qa-pagefind-library/"];
  assert.deepEqual(eligibleArticles(),allowed);
  verifyMarkers("dist",allowed);
  const manifest=JSON.parse(fs.readFileSync("dist/pagefind/indexed-routes.json","utf8"));
  assert.deepEqual(manifest,allowed);
  assert.ok(fs.existsSync("dist/pagefind/pagefind.js"),"Real CLI bundle exists");
  if(fs.existsSync(".vercel/output/static")) {
    assert.ok(fs.existsSync(".vercel/output/static/pagefind/pagefind.js"),
      "The Pagefind browser bundle must be copied to deployable Vercel output");
    assert.deepEqual(
      JSON.parse(fs.readFileSync(".vercel/output/static/pagefind/indexed-routes.json","utf8")),
      allowed, "Vercel's published index manifest matches the Astro output");
  }
  for (const f of fixtures) {
    const file=path.join("dist",f.collection,f.slug,"index.html");
    if (f.status==="draft"||f.status==="review") {
      assert.equal(fs.existsSync(file),false,"Hidden entry has no public route: "+f.slug);
      continue;
    }
    if (f.preview) {
      assert.equal(fs.existsSync(file),false,
        "Preview-only fixture is not emitted as a public route: "+f.slug);
    } else {
      const html=fs.readFileSync(file,"utf8");
      assert.ok(html.includes(f.phrase),"Unique known phrase appears in built article: "+f.slug);
      assert.match(html,/\bdata-pagefind-body(?:=|[\s>])/i);
      assert.ok(html.includes('data-pagefind-filter="collection:'+f.collection+'"'),
        "Pagefind filter derives from published article collection");
      assert.ok(html.includes('data-pagefind-meta="title"') &&
        html.includes('data-pagefind-meta="description"'));
    }
  }
  for (const u of manifest) assert.ok(fs.existsSync("dist/"+u.slice(1)+"index.html"),
    "No Pagefind indexed dead routes: "+u);
  for (const f of fixtures.filter(f=>f.status!=="published"||f.preview)) {
    assert.ok(!manifest.some(u=>u.includes(f.slug)),"Excluded phrase's page not indexable: "+f.slug);
  }
  console.log("PASS: Pagefind known phrases in both published article bodies; draft, review, preview and dead routes excluded");
} finally {
  for (const f of fixtures) fs.rmSync(entryPath(f),{force:true});
}
