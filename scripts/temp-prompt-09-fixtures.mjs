// Temporary Prompt 09 integration fixtures. Removed before review.
// They are created only inside ephemeral GitHub Actions checkout.
import fs from "node:fs";
import assert from "node:assert/strict";

const mdx = (frontmatter) => `---\n${frontmatter}\n---\n\nIntegration test body.\n`;
fs.writeFileSync("src/content/library/integration-draft.mdx", mdx(
  'slug: hidden-draft\ntitle: Internal draft\ndescription: A draft\nstatus: draft'
));
fs.writeFileSync("src/content/library/integration-review.mdx", mdx(
  'slug: hidden-review\ntitle: Internal review\ndescription: A review\nstatus: review'
));
fs.writeFileSync("src/content/library/integration-published.mdx", mdx(
  'slug: public-library\ntitle: Public library test\ndescription: A published research test\nstatus: published\npublishedAt: 2026-10-27'
));
fs.writeFileSync("src/content/grimoire/integration-draft.mdx", mdx(
  'slug: hidden-grimoire\ntitle: Private grimoire\ndescription: A draft experiment\nstatus: draft'
));
fs.writeFileSync("src/content/grimoire/integration-published.mdx", mdx(
  'slug: public-library\ntitle: Public grimoire test\ndescription: A published method test\nstatus: published\npublishedAt: 2026-10-27'
));

const qa = `---
import { getCollection } from "astro:content";
import {
  getPublishedLibraryEntries,
  getPublishedGrimoireEntries,
  getPublishedLibraryEntry,
  getPublishedGrimoireEntry,
} from "../lib/editorial-public";

const allLibrary = await getCollection("library");
const allGrimoire = await getCollection("grimoire");
const library = await getPublishedLibraryEntries();
const grimoire = await getPublishedGrimoireEntries();

if (allLibrary.length !== 3 || allGrimoire.length !== 2) {
  throw new Error("Integration fixtures did not load: " + JSON.stringify([allLibrary.length, allGrimoire.length]));
}
if (library.length !== 1 || library[0].id !== "public-library" || library[0].data.slug !== library[0].id) {
  throw new Error("Published Library filter or stable slug/ID failed.");
}
if (grimoire.length !== 1 || grimoire[0].id !== "public-library") {
  throw new Error("Published Grimoire filter / separate collection slugs failed.");
}
if (await getPublishedLibraryEntry("hidden-draft")) throw new Error("Draft leaked from public entry lookup.");
if (await getPublishedLibraryEntry("hidden-review")) throw new Error("Review leaked from public entry lookup.");
if (await getPublishedGrimoireEntry("hidden-grimoire")) throw new Error("Grimoire draft leaked.");
if (!(await getPublishedLibraryEntry("public-library"))) throw new Error("Published Library entry unavailable.");
if (!(await getPublishedGrimoireEntry("public-library"))) throw new Error("Published Grimoire entry unavailable.");
---
<html lang="en"><head><meta name="robots" content="noindex,nofollow" /></head>
<body><p id="qa-ok">Public collection helper tests passed</p></body></html>
`;
fs.writeFileSync("src/pages/__prompt09-qa.astro", qa);
console.log("Created temporary MDX and internal-only QA route.");

if (process.argv.includes("--verify")) {
const expected = ["dist/index.html", "dist/about/index.html", "dist/__prompt09-qa/index.html"];
for (const f of expected) assert.ok(fs.existsSync(f), "Expected generated page " + f);
const generated = [];
function walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = dir + "/" + d.name;
    if (d.isDirectory()) walk(p);
    else if (p.endsWith(".html")) generated.push(p);
  }
}
walk("dist");
assert.deepEqual(generated.sort(), expected.sort(), "Unexpected public article/index route generated");
const rendered = fs.readFileSync("dist/__prompt09-qa/index.html", "utf8");
assert.match(rendered, /Public collection helper tests passed/);
assert.match(rendered, /noindex/);
console.log("PASS: draft/review withheld, published entries allowed, stable IDs, no extra routes.");

}
