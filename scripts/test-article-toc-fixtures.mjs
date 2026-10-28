// Prompt 16: full, temporary MDX article rendering checks. All fake content is
// confined to the CI runner and source directories are restored in finally.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const sections = ["library", "grimoire"];
const paths = sections.map((s) => path.join(root, "src/content", s));
const backups = sections.map((s) => path.join(root, "src/content", "__qa_prompt16_" + s));

function body(section, long) {
  if (!long) return [
    "## Short overview",
    "",
    "This is an intentionally short, unpublished runner-only fixture.",
    "",
    "### Brief note",
    "",
    "Short articles should not have a table of contents.",
    "",
  ].join("\n");

  const major = section === "library" ? "Origins" : "Method";
  const minor = section === "library" ? "Preparation" : "Notes";
  const third = section === "library" ? "Interpretation" : "Observations";
  const text = "The purpose of this runner-only paragraph is to verify the vertical " +
    "reading measure and anchor navigation without creating any public research. " +
    "The statement is test data, not an assertion about occult traditions or experiences.";
  const sectionBody = Array.from({ length: 4 }, () => text).join("\n\n");
  return [
    "## " + major, "", sectionBody, "",
    "### " + minor, "", sectionBody, "",
    "### " + minor, "", sectionBody, "",
    "## " + third, "", sectionBody, "",
    "## " + major, "", sectionBody, "",
    "#### Deliberately omitted from navigation", "",
    "An h4 is allowed in article content but does not clutter the TOC.", "",
  ].join("\n");
}

function writeArticle(section, slug, status, isLong = false) {
  const source = [
    "---",
    "slug: " + slug,
    "title: " + (section === "library" ? "Research" : "Practice") + " TOC test",
    "description: Temporary Astro MDX rendering and TOC test content.",
    "status: " + status,
    ...(status === "published" ? ["publishedAt: 2026-10-20"] : []),
    "---",
    "",
    body(section, isLong),
  ].join("\n");
  fs.writeFileSync(path.join(root, "src/content", section, slug + ".mdx"), source);
}

function htmlAt(section, slug) {
  const output = path.join("dist", section, slug, "index.html");
  assert.ok(fs.existsSync(output), "Published route should exist: " + output);
  return fs.readFileSync(output, "utf8");
}
function matchCount(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

try {
  for (let i = 0; i < paths.length; i++) {
    assert.ok(!fs.existsSync(backups[i]), "Refuse to overwrite existing test backup");
    fs.renameSync(paths[i], backups[i]);
    fs.mkdirSync(paths[i], { recursive: true });
  }

  for (const section of sections) {
    writeArticle(section, "qa-toc-long", "published", true);
    writeArticle(section, "qa-toc-short", "published", false);
    writeArticle(section, "qa-toc-draft", "draft", true);
    writeArticle(section, "qa-toc-review", "review", true);
  }

  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync(".astro", { recursive: true, force: true });
  const build = spawnSync("npm", ["run", "build"], {
    cwd: root, encoding: "utf8", timeout: 180_000,
  });
  if (build.status !== 0) throw new Error(
    "Astro TOC fixture build failed:\n" + (build.stdout || "").slice(-9000) +
    "\n" + (build.stderr || "").slice(-9000)
  );

  assert.ok(fs.existsSync("dist/library/index.html"));
  assert.ok(fs.existsSync("dist/grimoire/index.html"));
  for (const section of sections) {
    for (const unpublished of ["qa-toc-draft", "qa-toc-review"]) {
      assert.equal(fs.existsSync(path.join("dist", section, unpublished, "index.html")), false,
        "Drafts and review entries must have no static pages");
    }

    const longHtml = htmlAt(section, "qa-toc-long");
    const shortHtml = htmlAt(section, "qa-toc-short");
    const major = section === "library" ? "origins" : "method";
    const minor = section === "library" ? "preparation" : "notes";
    const third = section === "library" ? "interpretation" : "observations";
    const slugs = [major, minor, minor + "-1", third, major + "-1"];

    assert.equal(matchCount(longHtml, /<h1\b/g), 1, "Only one article H1");
    assert.ok(longHtml.includes('class="article-reading--' + section) ||
      longHtml.includes("article-reading--" + section));
    assert.ok(longHtml.includes('class="article-toc article-toc--rail"'));
    assert.ok(longHtml.includes('class="article-toc article-toc--disclosure"'));
    assert.equal(matchCount(longHtml, /aria-label="Article contents"/g), 2,
      "Rail and disclosure expose the same generated navigation, one responsive at a time");
    assert.ok(longHtml.includes("<summary>"), "Native keyboard disclosure");
    for (const slug of slugs) {
      assert.ok(new RegExp('<h[23]\\b[^>]*\\bid="' + slug + '"').test(longHtml),
        "MDX renderer must produce visible heading #" + slug);
      assert.equal(matchCount(longHtml, new RegExp('href="#' + slug + '"', "g")), 2,
        "Both TOCs must use the exact renderer slug #" + slug);
    }
    const order = slugs.map((slug) => longHtml.indexOf('href="#' + slug + '"'));
    assert.ok(order.every((position, i) => i === 0 || position > order[i - 1]),
      "Links preserve the MDX section order including duplicate labels");
    assert.ok(!longHtml.includes('href="#deliberately-omitted-from-navigation"'),
      "h4 remains readable but is not listed");
    assert.ok(new RegExp('<h4\\b[^>]*\\bid="deliberately-omitted-from-navigation"').test(longHtml));
    assert.ok(!longHtml.includes('href="#article-title"'), "Never link to the layout H1");
    assert.ok(longHtml.includes('href="/' + section + '/"'));
    assert.ok(!longHtml.includes("qa-toc-draft") && !longHtml.includes("qa-toc-review"));
    assert.ok(longHtml.includes("A runner-only") || longHtml.includes("runner-only paragraph"),
      "Real MDX body must be rendered");

    assert.ok(shortHtml.includes("Short articles should not have a table of contents."));
    assert.ok(!shortHtml.includes("article-toc--rail"));
    assert.ok(!shortHtml.includes("article-toc--disclosure"));
    assert.equal(matchCount(shortHtml, /aria-label="Article contents"/g), 0);
    assert.ok(new RegExp('<h2\\b[^>]*\\bid="short-overview"').test(shortHtml));
    assert.ok(new RegExp('<h3\\b[^>]*\\bid="brief-note"').test(shortHtml));

    console.log("PASS: " + section +
      " renderer IDs, repeated labels, nested h2/h3, correct TOC links and short-article omission");
  }
  console.log("PASS: Prompt 16 published routes, same-slug collection isolation, draft/review exclusion");
} finally {
  for (let i = 0; i < paths.length; i++) {
    if (fs.existsSync(backups[i])) {
      fs.rmSync(paths[i], { recursive: true, force: true });
      fs.renameSync(backups[i], paths[i]);
    }
  }
}
console.log("PASS: Prompt 16 test-only MDX source restored; dist retained for isolated browser QA");
