// Prompt 18: real Astro MDX relationship builds using runner-only content.
// Original collections are restored before this job exits; fixture pages
// remain in dist only for the subsequent isolated browser acceptance test.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const collections = ["library", "grimoire"];
const liveDirs = collections.map((section) => path.join(root, "src/content", section));
const backupDirs = collections.map((section) => path.join(root, "src/content", "__qa_prompt18_" + section));

function frontmatter(section, slug, status, relatedIds) {
  return [
    "---",
    "slug: " + slug,
    "title: " + (section === "library" ? "Library " : "Grimoire ") + slug,
    "description: Temporary fixture used to test related article links and reading layouts.",
    "status: " + status,
    ...(status === "published" ? ["publishedAt: 2026-10-28"] : []),
    ...(relatedIds.length ? ["relatedIds:", ...relatedIds.map((id) => "  - " + id)] : []),
    "---",
    "",
  ].join("\n");
}
function write(section, slug, status, relatedIds = []) {
  const prose = [
    "## First heading",
    "",
    "Published fixture paragraphs demonstrate layout behavior without invented research.",
    "",
    "### A detail",
    "",
    "The editor controls links using real collection and slug identifiers.",
    "",
    "## Second heading",
    "",
    "This fixture content does not claim any historical or spiritual observation.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(root, "src/content", section, slug + ".mdx"),
    frontmatter(section, slug, status, relatedIds) + prose);
}
function build() {
  fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(root, ".astro"), { recursive: true, force: true });
  return spawnSync("npm", ["run", "build"], {
    cwd: root, encoding: "utf8", timeout: 180_000,
  });
}
function assertBuildSucceeds(label) {
  const result = build();
  if (result.status !== 0) {
    throw new Error(label + "\n" + (result.stdout || "").slice(-6000) + "\n" +
      (result.stderr || "").slice(-6000));
  }
  console.log("PASS: " + label);
}
function assertBuildRejects(key, expected) {
  const invalid = path.join(root, "src/content/library/qa-invalid-related.mdx");
  try {
    write("library", "qa-invalid-related", "published", [key]);
    const result = build();
    const output = (result.stdout || "") + "\n" + (result.stderr || "");
    assert.notEqual(result.status, 0, "Bad related article must fail the production build: " + key);
    assert.match(output, expected,
      "The build failure must identify the invalid relationship, not another error");
    console.log("PASS: expected build rejection for " + key);
  } finally {
    fs.rmSync(invalid, { force: true });
  }
}
function html(section, slug) {
  const filename = path.join(root, "dist", section, slug, "index.html");
  assert.ok(fs.existsSync(filename), "Missing published route " + filename);
  return fs.readFileSync(filename, "utf8");
}
function count(html, text) {
  return html.split(text).length - 1;
}

try {
  for (const backup of backupDirs) {
    assert.ok(!fs.existsSync(backup), "Refusing to overwrite preexisting Prompt 18 backup");
  }
  for (let i = 0; i < liveDirs.length; i++) {
    fs.renameSync(liveDirs[i], backupDirs[i]);
    fs.mkdirSync(liveDirs[i], { recursive: true });
  }

  write("library", "qa-reading", "published", [
    "grimoire:qa-practice",
    "library:qa-context",
    "grimoire:qa-practice",
  ]);
  write("library", "qa-context", "published");
  write("grimoire", "qa-practice", "published", [
    "library:qa-reading",
    "library:qa-context",
  ]);
  write("grimoire", "qa-hidden-draft", "draft");
  write("grimoire", "qa-hidden-review", "review");

  // All of these source entries are explicitly published, so failures must
  // come from their relatedIds (not from a missing publication date).
  assertBuildRejects("library:qa-missing", /unknown related article|missing related article/i);
  assertBuildRejects("grimoire:qa-hidden-draft", /related article .*not published|unpublished related article/i);
  assertBuildRejects("grimoire:qa-hidden-review", /related article .*not published|unpublished related article/i);
  assertBuildRejects("library:qa-invalid-related", /article cannot be related to itself|cannot link to itself/i);
  assertBuildSucceeds("Published Library and Grimoire MDX fixtures resolve curated cross-links");

  const library = html("library", "qa-reading");
  const grimoire = html("grimoire", "qa-practice");
  const empty = html("library", "qa-context");
  assert.ok(library.includes('id="related-reading-heading"'));
  assert.ok(library.includes("related-articles--compact"));
  assert.equal(count(library, 'href="/grimoire/qa-practice/"'), 1,
    "One link to the cross-collection Grimoire entry, despite duplicate relatedIds");
  assert.equal(count(library, 'href="/library/qa-context/"'), 1,
    "A Library-to-Library link resolves to the Library URL");
  assert.ok(library.includes("Grimoire · Practice"), "The linked collection is identified");
  assert.ok(library.includes("Library · Research"), "Mixed collections have truthful labels");
  assert.equal(count(library, "related-reading--compact"), 2,
    "Two compact text entries only, in editorial order");
  assert.ok(library.indexOf('href="/grimoire/qa-practice/"') <
    library.indexOf('href="/library/qa-context/"'),
    "The author determines related-reading order");

  assert.ok(grimoire.includes('id="related-reading-heading"'));
  assert.ok(grimoire.includes("related-articles--cards"));
  assert.equal(count(grimoire, 'href="/library/qa-reading/"'), 1,
    "Grimoire can link to a published Library article");
  assert.equal(count(grimoire, 'href="/library/qa-context/"'), 1);
  assert.equal(count(grimoire, "related-reading--card"), 2,
    "Grimoire uses the optional two-card presentation");
  assert.ok(grimoire.includes("Temporary fixture used to test related article links"),
    "Card variant shows the genuine editorial description");

  assert.ok(!empty.includes('id="related-reading-heading"'),
    "No heading may appear when no related IDs are selected");
  assert.ok(!empty.includes("related-articles--compact") &&
    !empty.includes("related-articles--cards"),
    "No empty related-reading component or placeholder links");

  assert.ok(!fs.existsSync(path.join(root, "dist/grimoire/qa-hidden-draft/index.html")));
  assert.ok(!fs.existsSync(path.join(root, "dist/grimoire/qa-hidden-review/index.html")));
  assert.ok(!fs.existsSync(path.join(root, "dist/library/qa-invalid-related/index.html")));
  assert.ok(library.includes('href="/grimoire/qa-practice/"'));
  assert.ok(grimoire.includes('href="/library/qa-reading/"'));
  console.log("PASS: curated cross-collection and same-collection links, order and deduplication");
  console.log("PASS: compact and card variants, source-derived titles, empty state and unpublished exclusions");
} finally {
  for (let i = 0; i < liveDirs.length; i++) {
    if (fs.existsSync(backupDirs[i])) {
      fs.rmSync(liveDirs[i], { recursive: true, force: true });
      fs.renameSync(backupDirs[i], liveDirs[i]);
    }
  }
}
console.log("PASS: Temporary Prompt 18 MDX fixture content restored; dist retained for browser QA");
