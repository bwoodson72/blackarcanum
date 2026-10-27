// Isolated CI integration tests: temporary MDX is never committed or published.
// The last fixture build leaves dist/ available for browser QA.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const directories = [
  path.join(root, "src/content/library"),
  path.join(root, "src/content/grimoire"),
];
const backups = [
  path.join(root, "src/content/__qa_grimoire_library_backup"),
  path.join(root, "src/content/__qa_grimoire_backup"),
];
const [libraryDir, grimoireDir] = directories;

function entry(id, status = "published", date = "2026-10-02") {
  return [
    "---",
    "slug: " + id,
    "title: Test-only archive entry " + id,
    "description: Temporary MDX content used solely for isolated integration tests.",
    "status: " + status,
    ...(status === "published" ? ["publishedAt: " + date] : []),
    "---",
    "",
    "Temporary content; do not publish.",
    "",
  ].join("\n");
}
const idFor = (number) => "qa-" + String(number).padStart(2, "0");
const write = (folder, slug, status = "published", date) =>
  fs.writeFileSync(path.join(folder, slug + ".mdx"), entry(slug, status, date));

function build() {
  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync(".astro", { recursive: true, force: true });
  const result = spawnSync("npm", ["run", "build"], {
    cwd: root, encoding: "utf8", timeout: 120_000,
  });
  if (result.status !== 0) {
    throw new Error("Astro Grimoire integration build failed:\n" +
      (result.stdout || "").slice(-8000) + "\n" +
      (result.stderr || "").slice(-8000));
  }
}

function htmlAt(page) {
  const filename = page === 1
    ? "dist/grimoire/index.html"
    : `dist/grimoire/page/${page}/index.html`;
  assert.ok(fs.existsSync(filename), "Missing Grimoire archive " + filename);
  return fs.readFileSync(filename, "utf8");
}
function archiveLinks(html) {
  return [...html.matchAll(/href="\/grimoire\/(qa-\d+)\/"/g)].map((match) => match[1]);
}

try {
  for (let index = 0; index < directories.length; index++) {
    assert.ok(!fs.existsSync(backups[index]), "Refusing to overwrite backup");
    fs.renameSync(directories[index], backups[index]);
    fs.mkdirSync(directories[index], { recursive: true });
  }

  // Deliberate cross-collection slug collision and separate Library-only entry.
  // These must NEVER be rendered as Grimoire entries, even for an empty archive.
  write(libraryDir, "qa-01");
  write(libraryDir, "qa-library-only");

  for (const count of [0, 1, 12, 13, 25]) {
    fs.rmSync(grimoireDir, { recursive: true, force: true });
    fs.mkdirSync(grimoireDir, { recursive: true });

    for (let i = 1; i <= count; i++) {
      write(grimoireDir, idFor(i), "published", i === 25 ? "2026-10-03" : "2026-10-02");
    }
    write(grimoireDir, "qa-hidden-draft", "draft");
    write(grimoireDir, "qa-hidden-review", "review");

    build();

    const pages = Math.ceil(count / 12);
    const expected = Array.from({ length: count }, (_, index) => idFor(index + 1));
    if (count === 25) expected.unshift(expected.pop());

    assert.ok(fs.existsSync("dist/index.html"));
    assert.ok(fs.existsSync("dist/about/index.html"));
    assert.ok(fs.existsSync("dist/library/index.html"));
    assert.equal(fs.existsSync("dist/grimoire/page/1/index.html"), false,
      "Page one has no numbered alias");
    assert.equal(fs.existsSync(`dist/grimoire/page/${pages + 1}/index.html`), false,
      "Out-of-range pages are never generated");
    assert.equal(fs.existsSync("dist/grimoire/page/0/index.html"), false);
    assert.equal(fs.existsSync("dist/grimoire/qa-hidden-draft/index.html"), false);
    assert.equal(fs.existsSync("dist/grimoire/qa-hidden-review/index.html"), false);

    for (let page = 1; page <= Math.max(1, pages); page++) {
      const html = htmlAt(page);
      const expectedPage = expected.slice((page - 1) * 12, page * 12);
      assert.deepEqual(archiveLinks(html), expectedPage,
        `Incorrect Grimoire chronological order (count=${count}, page=${page})`);
      assert.equal((html.match(/class="article-card article-card--editorial/g) || []).length,
        expectedPage.length, "All articles use editorial cards");
      assert.equal((html.match(/class="grimoire-lead"/g) || []).length,
        expectedPage.length ? 1 : 0, "First published row has editorial lead layout");
      assert.ok(!html.includes("qa-library-only"),
        "A Library-only article must not enter the Grimoire archive");
      assert.ok(!html.includes("qa-hidden-draft"));
      assert.ok(!html.includes("qa-hidden-review"));
      assert.ok(!html.includes("<img "), "No invented image for text-only MDX");
      assert.ok(!html.includes('href="/library/qa-01/"'),
        "Same slug in Library and Grimoire still links to Grimoire");

      if (page === 1) {
        assert.ok(html.includes("<title>The Grimoire | Mystagogia</title>"));
      } else {
        assert.ok(html.includes(`<title>The Grimoire — Page ${page} | Mystagogia</title>`));
        assert.ok(html.includes('rel="prev"'));
      }
      if (pages > 1) {
        assert.ok(html.includes('aria-label="Article pagination"'));
        assert.equal(html.includes('rel="next"'), page < pages);
        if (page === 1) assert.ok(html.includes('href="/grimoire/page/2/"'));
        if (page === 2) assert.ok(html.includes('href="/grimoire/"'));
      } else {
        assert.ok(!html.includes('aria-label="Article pagination"'));
      }
      if (expectedPage.length) {
        assert.ok(html.includes("<time datetime="), "Published dates are visible");
        assert.ok(html.includes("Temporary MDX content used solely for isolated integration tests."),
          "Published entries have authentic (fixture) descriptions");
      }
    }

    const first = htmlAt(1);
    if (count === 0) {
      assert.ok(first.includes("No Grimoire entries have been published yet."));
      assert.ok(first.includes('name="robots" content="noindex, nofollow"'));
      assert.ok(first.includes('href="/library/"'));
      assert.ok(first.includes('href="/about/"'));
      assert.ok(!first.includes("grimoire-lead"));
    } else {
      assert.ok(!first.includes('name="robots" content="noindex, nofollow"'));
      assert.ok(!first.includes("No Grimoire entries have been published yet."));
    }

    console.log(`PASS: Grimoire ${count} published → ${pages} page(s), canonical routes, cross-collection isolation and date metadata`);
  }
} finally {
  for (let index = 0; index < directories.length; index++) {
    if (fs.existsSync(backups[index])) {
      fs.rmSync(directories[index], { recursive: true, force: true });
      fs.renameSync(backups[index], directories[index]);
    }
  }
}
console.log("PASS: Grimoire fixture files restored; production content remains untouched");
