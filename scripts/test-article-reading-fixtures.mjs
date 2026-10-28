// CI-only end-to-end article route acceptance. Never commits or publishes
// fictitious research, personal experiences, or fixture imagery.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const collections = ["library", "grimoire"];
const contentDirs = collections.map((name) => path.join(root, "src/content", name));
const backupDirs = collections.map((name) => path.join(root, "src/content", "__qa_prompt15_" + name));

const fixtureBody = (marker) => [
  "## Heading inside " + marker,
  "",
  "A real MDX content rendering check for " + marker + " with **bold words**.",
  "",
  "### Smaller heading",
  "",
  "This paragraph checks the responsive reading column and legible typography.",
  "",
  "> A blockquote is content, not part of the header.",
  "",
  "A working [archive link](/" + (marker.startsWith("Library") ? "library" : "grimoire") + "/).",
  "",
].join("\n");

function writeEntry(section, slug, status, options = {}) {
  const marker = options.marker ?? section + ":" + slug;
  const lines = [
    "---",
    "slug: " + slug,
    "title: " + (section === "library" ? "Research test " : "Practice test ") + slug,
    "description: Temporary, unpublished test data created on the CI runner.",
    "status: " + status,
    ...(status === "published" ? ["publishedAt: 2026-10-20"] : []),
    ...(options.updated ? ["updatedAt: 2026-10-24"] : []),
    ...(options.hero ? [
      "hero:",
      // Standard 1px transparent fixture GIF: no artwork and no file emitted.
      '  src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="',
      '  alt: "Transparent one-pixel QA fixture"',
    ] : []),
    "---",
    "",
    fixtureBody(marker),
  ];
  fs.writeFileSync(
    path.join(root, "src/content", section, slug + ".mdx"),
    lines.join("\n"),
  );
}

function renderedHtml(section, slug) {
  const output = path.join(root, "dist", section, slug, "index.html");
  assert.ok(fs.existsSync(output), "Published page must be generated: " + output);
  return fs.readFileSync(output, "utf8");
}

try {
  // Preserve and restore the actual collections, even if a test/build fails.
  for (let i = 0; i < contentDirs.length; i++) {
    assert.ok(!fs.existsSync(backupDirs[i]), "Refusing to overwrite a preexisting QA backup");
    fs.renameSync(contentDirs[i], backupDirs[i]);
    fs.mkdirSync(contentDirs[i], { recursive: true });
  }

  writeEntry("library", "qa-library-reading", "published", { marker: "Library body marker" });
  writeEntry("grimoire", "qa-grimoire-reading", "published", {
    marker: "Grimoire body marker", updated: true, hero: true,
  });

  // A matching slug in both collections MUST route to the correct body.
  writeEntry("library", "qa-shared-reading", "published", { marker: "Library shared marker" });
  writeEntry("grimoire", "qa-shared-reading", "published", { marker: "Grimoire shared marker" });

  for (const section of collections) {
    writeEntry(section, "qa-hidden-draft", "draft");
    writeEntry(section, "qa-hidden-review", "review");
  }

  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync(".astro", { recursive: true, force: true });
  const build = spawnSync("npm", ["run", "build"], {
    cwd: root, encoding: "utf8", timeout: 180_000,
  });
  if (build.status !== 0) throw new Error(
    "Published route fixture build failed:\n" +
    (build.stdout || "").slice(-9000) + "\n" + (build.stderr || "").slice(-9000)
  );

  assert.ok(fs.existsSync("dist/library/index.html"));
  assert.ok(fs.existsSync("dist/grimoire/index.html"));
  assert.ok(fs.existsSync("dist/about/index.html"));

  for (const section of collections) {
    for (const hidden of ["qa-hidden-draft", "qa-hidden-review"]) {
      assert.equal(
        fs.existsSync(path.join("dist", section, hidden, "index.html")),
        false, "No draft/review article route may be emitted"
      );
    }
  }

  for (const [section, slug, marker] of [
    ["library", "qa-library-reading", "Library body marker"],
    ["grimoire", "qa-grimoire-reading", "Grimoire body marker"],
    ["library", "qa-shared-reading", "Library shared marker"],
    ["grimoire", "qa-shared-reading", "Grimoire shared marker"],
  ]) {
    const html = renderedHtml(section, slug);
    assert.ok(html.includes(marker), "Rendered MDX must include the correct source body");
    assert.ok(html.includes("A real MDX content rendering check"));
    assert.ok(html.includes("Smaller heading"));
    assert.ok(html.includes('aria-label="Breadcrumb"'));
    assert.ok(html.includes('href="/' + section + '/"'));
    assert.ok(/<h1\b[^>]*id="article-title"/.test(html));
    assert.equal((html.match(/<h1\b/g) || []).length, 1, "One page title");
    assert.ok(html.includes('class="article-reading'), "Shared reading shell");
    assert.ok(html.includes("article-reading--" + section), "Section-specific variant");
    assert.ok(html.includes("reading-content"), "Semantic reading typography");
    assert.ok(html.includes('<time datetime="2026-10-20"'));
    assert.ok(html.includes("Temporary, unpublished test data created on the CI runner."),
      "Frontmatter description appears as lead/meta");
    assert.ok(!html.includes('name="robots" content="noindex, nofollow"'));
    assert.ok(!html.includes('>By '), "Never fabricate an author's identity");
    assert.ok(!html.includes("qa-hidden-draft") && !html.includes("qa-hidden-review"));
    assert.ok(!html.includes('class="article-reading__toc"') &&
      !html.includes('class="article-reading__context"'), "Empty aside slots are omitted");

    if (slug === "qa-shared-reading") {
      const other = section === "library" ? "Grimoire shared marker" : "Library shared marker";
      assert.ok(!html.includes(other), "Cross-collection slug may not leak body contents");
    }

    if (section === "grimoire" && slug === "qa-grimoire-reading") {
      assert.ok(html.includes('class="article-header__hero"'), "Optional hero is rendered");
      assert.ok(html.includes('alt="Transparent one-pixel QA fixture"'));
      assert.ok(html.includes('datetime="2026-10-24"'), "Updated metadata is real");
    } else {
      assert.ok(!html.includes('class="article-header__hero"'),
        "Article with no hero must not create an empty visual placeholder");
    }

    console.log("PASS: " + section + "/" + slug + " MDX body, metadata, breadcrumbs, optional media");
  }

  console.log("PASS: no draft/review routes and same-slug collection separation");
} finally {
  for (let i = 0; i < contentDirs.length; i++) {
    if (fs.existsSync(backupDirs[i])) {
      fs.rmSync(contentDirs[i], { recursive: true, force: true });
      fs.renameSync(backupDirs[i], contentDirs[i]);
    }
  }
}
console.log("PASS: Prompt 15 temporary fixture source restored; browser QA uses isolated dist only");
