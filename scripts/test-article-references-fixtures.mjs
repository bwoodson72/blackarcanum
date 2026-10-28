// CI-only published MDX integration test: no invented content is committed.
// Temporarily swap both content collections and the source registry, then
// restore them byte-for-byte even if an expected failure or build crashes.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const collections = ["library", "grimoire"];
const contentDirs = collections.map((section) => path.join(root, "src/content", section));
const backupDirs = collections.map((section) => path.join(root, "src/content", "__qa_prompt17_" + section));
const registryPath = path.join(root, "src/data/sources.ts");
const originalRegistry = fs.readFileSync(registryPath, "utf8");

const goodRegistry = originalRegistry.slice(0, originalRegistry.indexOf("export const sources:")) + String.raw`export const sources: readonly SourceRecord[] = [
  {
    id: "fixture-primary",
    title: "CI-only Test Primary Source",
    creator: "Test-only Creator",
    stableUrl: "https://example.org/ci-only-primary",
    kind: "primary",
  },
  {
    id: "fixture-no-url",
    title: "CI-only Test Source Without URL",
  },
];
`;
const badUrlRegistry = goodRegistry.replace("https://example.org/ci-only-primary", "javascript:alert(1)");

const sourceImport = 'import SourceCitation from "../../components/editorial/SourceCitation.astro";';

function frontmatter(section, slug, extra = []) {
  return [
    "---",
    "slug: " + slug,
    "title: " + (section === "library" ? "Library" : "Grimoire") + " source fixture",
    "description: Test-only MDX rendering for source references.",
    "status: published",
    "publishedAt: 2026-10-28",
    ...extra,
    "---",
    "",
  ].join("\n");
}
function write(section, slug, extra, body) {
  fs.writeFileSync(
    path.join(root, "src/content", section, slug + ".mdx"),
    frontmatter(section, slug, extra) + body,
  );
}
function build() {
  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync(".astro", { recursive: true, force: true });
  return spawnSync("npm", ["run", "build"], {
    cwd: root, encoding: "utf8", timeout: 180_000,
  });
}
function ensureBuild(success, label) {
  const result = build();
  if ((result.status === 0) !== success) {
    throw new Error(label + " — unexpected exit " + result.status + "\n" +
      (result.stdout || "").slice(-6000) + "\n" + (result.stderr || "").slice(-6000));
  }
  console.log("PASS: " + label);
}
function html(section, slug) {
  const filename = path.join("dist", section, slug, "index.html");
  assert.ok(fs.existsSync(filename), "Missing published fixture " + filename);
  return fs.readFileSync(filename, "utf8");
}

try {
  for (const backup of backupDirs) {
    assert.ok(!fs.existsSync(backup), "Refuse to overwrite an existing Prompt 17 source backup");
  }
  for (let i = 0; i < collections.length; i++) {
    fs.renameSync(contentDirs[i], backupDirs[i]);
    fs.mkdirSync(contentDirs[i], { recursive: true });
  }

  fs.writeFileSync(registryPath, goodRegistry);
  write("library", "qa-unknown-source", [
    "citations:",
    "  - sourceId: not-in-approved-registry",
    "    locator:",
    '      page: "9"',
  ], "## An unapproved attribution\n\nThis must not build.\n");
  ensureBuild(false, "Unknown source IDs cause a production build failure");
  fs.rmSync(path.join("src/content/library/qa-unknown-source.mdx"));

  fs.writeFileSync(registryPath, badUrlRegistry);
  write("library", "qa-bad-source-url", [
    "sourceIds:",
    "  - fixture-primary",
  ], "## Bad URL\n\nThis must not build.\n");
  ensureBuild(false, "Unsafe source registry URLs cause a production build failure");
  fs.rmSync(path.join("src/content/library/qa-bad-source-url.mdx"));

  fs.writeFileSync(registryPath, goodRegistry);
  write("library", "qa-source-notes", [
    "citations:",
    "  - sourceId: fixture-primary",
    "    locator:",
    '      page: "12–13"',
    "    note: A page-specific statement from the example source.",
    "  - sourceId: fixture-primary",
    "    locator:",
    '      passage: "II.4"',
    "    note: A distinct passage in the same example source.",
    "sourceIds:",
    "  - fixture-primary",
    "  - fixture-no-url",
  ], [
    sourceImport,
    "",
    "## Overview",
    "",
    "First claim with a real note link <SourceCitation index={1} citations={frontmatter.citations} /> and a second sentence.",
    "",
    "### Different locator",
    "",
    "The same underlying source used for a different place <SourceCitation index={2} citations={frontmatter.citations} />.",
    "",
    "## Interpretation",
    "",
    "This is a test of source-backed attribution, not a personal observation.",
    "",
    "## Conclusions",
    "",
    "The source metadata is not a substitute for evidence; fixture text stays isolated.",
    "",
  ].join("\n"));

  write("grimoire", "qa-grimoire-citation", [
    "citations:",
    "  - sourceId: fixture-primary",
    "    locator:",
    '      section: "3"',
  ], [
    sourceImport,
    "",
    "## Method context",
    "",
    "A source claim in a Grimoire entry <SourceCitation index={1} citations={frontmatter.citations} />.",
    "",
    "## Method",
    "",
    "No personal experience was undertaken in this fixture.",
    "",
    "## Interpretation",
    "",
    "A documented source must not be confused with an author's observation.",
    "",
  ].join("\n"));

  write("library", "qa-uncited-sources", [
    "sourceIds:",
    "  - fixture-no-url",
  ], "## Historical context\n\nAn entry may list a real approved bibliography item without numbered notes.\n");
  write("grimoire", "qa-no-references", [],
    "## Reflective entry\n\nAn uncited personal observation may have no source list at all.\n");
  write("library", "qa-draft-uncited", [], "## Unpublished\n\nThis should never have a public route.\n");

  // The helper defaults to published; override this specific fixture to draft.
  const draftFile = path.join("src/content/library/qa-draft-uncited.mdx");
  const draft = fs.readFileSync(draftFile, "utf8").replace(
    "status: published\npublishedAt:", "status: draft\npublishedAt:"
  );
  fs.writeFileSync(draftFile, draft);

  ensureBuild(true, "Valid real MDX source references render in both editorial collections");

  const lib = html("library", "qa-source-notes");
  const grim = html("grimoire", "qa-grimoire-citation");
  const bibliography = html("library", "qa-uncited-sources");
  const empty = html("grimoire", "qa-no-references");

  for (const [section, body, count] of [
    ["library", lib, 2],
    ["grimoire", grim, 1],
  ]) {
    assert.ok(body.includes('id="article-notes-title"'), "Notes heading generated");
    assert.ok(body.includes('id="article-sources-title"'), "Bibliography heading generated");
    for (let number = 1; number <= count; number++) {
      assert.ok(body.includes('id="citation-ref-' + number + '"'), "Inline citation has a stable id");
      assert.ok(body.includes('href="#citation-note-' + number + '"'), "Inline link reaches the note");
      assert.ok(body.includes('id="citation-note-' + number + '"'), "Note has a stable target");
      assert.ok(body.includes('href="#citation-ref-' + number + '"'), "Note returns to inline citation");
      assert.ok(body.includes('aria-label="Return to source reference ' + number + ' in the article"'),
        "Backlink must have accessible text");
    }
    assert.equal((body.match(/id="article-source-fixture-primary"/g) || []).length, 1,
      "One bibliography record for the repeatedly cited source");
    assert.ok(body.includes("https://example.org/ci-only-primary"), "Verified source URL present");
    assert.ok(body.includes("CI-only Test Primary Source"));
    console.log("PASS: " + section + " citation notes, backlinks and unique registry-backed source");
  }

  assert.ok(lib.includes("page 12–13"));
  assert.ok(lib.includes("passage II.4"), "Second use has distinct locator");
  assert.ok(lib.includes("A page-specific statement from the example source."));
  assert.ok(lib.includes("A distinct passage in the same example source."));
  assert.equal((lib.match(/id="article-source-fixture-primary"/g) || []).length, 1);
  assert.ok(lib.includes('id="article-source-fixture-no-url"'));
  assert.ok(bibliography.includes('id="article-sources-title"'));
  assert.ok(bibliography.includes("CI-only Test Source Without URL"));
  assert.ok(!bibliography.includes('id="article-notes-title"'),
    "Bibliography-only content does not make empty numbered notes");
  assert.ok(!bibliography.includes('class="article-references__print-url"'),
    "Missing URLs must not be fabricated");
  assert.ok(!empty.includes("article-notes-title") && !empty.includes("article-sources-title") &&
    !empty.includes("article-references__bibliography"),
    "No references component markup when frontmatter contains none");
  assert.ok(!fs.existsSync(path.join("dist/library/qa-draft-uncited/index.html")),
    "Draft routes are not emitted");
  console.log("PASS: distinct passage/page locators, omitted missing metadata, no empty notes, no draft route");
} finally {
  for (let i = 0; i < contentDirs.length; i++) {
    if (fs.existsSync(backupDirs[i])) {
      fs.rmSync(contentDirs[i], { recursive: true, force: true });
      fs.renameSync(backupDirs[i], contentDirs[i]);
    }
  }
  fs.writeFileSync(registryPath, originalRegistry);
}
console.log("PASS: all temporary MDX collections and test registry source restored");
