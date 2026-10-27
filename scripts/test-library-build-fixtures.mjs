// CI-only integration fixtures. Source MDX folders are backed up/restored.
// The generated dist/ for the last (25-entry) case is consumed by browser QA.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const originals = [
  path.join(root, "src/content/library"),
  path.join(root, "src/content/grimoire"),
];
const backups = [
  path.join(root, "src/content/__qa_library_backup"),
  path.join(root, "src/content/__qa_grimoire_backup"),
];
const cases = [0, 1, 12, 13, 25];
const testTitle = "CI Fixture — Not Editorial Content";

function article(id, status = "published", date = "2026-10-02") {
  return [
    "---",
    "slug: " + id,
    "title: " + testTitle + " " + id,
    "description: A temporary record created only inside an isolated CI runner.",
    "status: " + status,
    ...(status === "published" ? ["publishedAt: " + date] : []),
    "---",
    "",
    "This is an internal build fixture, not a Mystagogia publication.",
    "",
  ].join("\n");
}
const filename = (id) => path.join(originals[0], id + ".mdx");
const idFor = (n) => "qa-" + String(n).padStart(2, "0");
function outputPage(page) {
  const relative = page === 1
    ? "dist/library/index.html"
    : "dist/library/page/" + page + "/index.html";
  assert.ok(fs.existsSync(relative), "Missing real Astro route: " + relative);
  return fs.readFileSync(relative, "utf8");
}
function linkedArticleIds(html) {
  return [...html.matchAll(/href="\/library\/(qa-\d+)\/"/g)].map((match) => match[1]);
}
function runBuild(count) {
  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync(".astro", { recursive: true, force: true });
  const command = spawnSync("npm", ["run", "build"], {
    cwd: root,
    encoding: "utf8",
    timeout: 120_000,
  });
  if (command.status !== 0) {
    throw new Error("Astro failed with " + count + " approved fixtures:\n" +
      (command.stdout || "").slice(-8000) + "\n" + (command.stderr || "").slice(-8000));
  }
}

let initialized = false;
try {
  for (let index = 0; index < backups.length; index++) {
    assert.ok(!fs.existsSync(backups[index]), "Refusing to overwrite fixture backup");
    fs.renameSync(originals[index], backups[index]);
    fs.mkdirSync(originals[index], { recursive: true });
  }
  initialized = true;

  for (const count of cases) {
    fs.rmSync(originals[0], { recursive: true, force: true });
    fs.mkdirSync(originals[0], { recursive: true });

    for (let n = 1; n <= count; n++) {
      const date = n === 25 ? "2026-10-03" : "2026-10-02";
      fs.writeFileSync(filename(idFor(n)), article(idFor(n), "published", date));
    }
    // Neither draft nor review may appear, even when their files exist.
    fs.writeFileSync(filename("qa-hidden-draft"), article("qa-hidden-draft", "draft"));
    fs.writeFileSync(filename("qa-hidden-review"), article("qa-hidden-review", "review"));

    runBuild(count);

    assert.ok(fs.existsSync("dist/index.html"), "Homepage still renders");
    assert.ok(fs.existsSync("dist/about/index.html"), "About remains available");

    const pageCount = Math.ceil(count / 12);
    const expectedIds = Array.from({ length: count }, (_, index) => idFor(index + 1));
    if (count === 25) {
      expectedIds.unshift(expectedIds.pop());
    }

    const first = outputPage(1);
    assert.ok(first.includes("<title>The Library | Mystagogia</title>"));
    assert.ok(first.includes("The Library") && first.includes("Source-led inquiry"));
    assert.ok(first.includes('href="/about/"') || first.includes('href="/about/"'));
    assert.equal(fs.existsSync("dist/library/page/1/index.html"), false, "No duplicate first page");
    assert.equal(fs.existsSync("dist/library/page/" + (pageCount + 1) + "/index.html"), false,
      "No overflow page");
    assert.equal(fs.existsSync("dist/library/qa-hidden-draft/index.html"), false);
    assert.equal(fs.existsSync("dist/library/qa-hidden-review/index.html"), false);

    for (let page = 1; page <= Math.max(1, pageCount); page++) {
      const html = outputPage(page);
      const ids = linkedArticleIds(html);
      const expected = expectedIds.slice((page - 1) * 12, page * 12);
      assert.deepEqual(ids, expected,
        "Incorrect published articles or sorting on case " + count + ", page " + page);
      assert.ok(!html.includes("qa-hidden-draft") && !html.includes("qa-hidden-review"),
        "Unpublished content must never appear in HTML");
      assert.equal((html.match(/class="article-card article-card--standard/g) || []).length, expected.length);
      assert.ok(!html.includes("<img "), "Text-only fixtures must not fabricate images");
      if (pageCount > 1) {
        assert.ok(html.includes('aria-label="Article pagination"'));
        if (page === 1) {
          assert.ok(html.includes('href="/library/page/2/"'));
        } else {
          assert.ok(html.includes("<title>The Library — Page " + page + " | Mystagogia</title>"));
          assert.ok(html.includes('rel="prev"'));
          assert.ok(html.includes("of " + count));
          if (page < pageCount) assert.ok(html.includes('rel="next"'));
          else assert.ok(!html.includes('rel="next"'));
        }
      } else {
        assert.ok(!html.includes('aria-label="Article pagination"'),
          "Zero/single-page archives need no controls");
      }
      if (expected.length) {
        assert.ok(html.includes("<time datetime="), "Published dates appear in listings");
        assert.ok(html.includes("A temporary record created only inside an isolated CI runner."));
      }
    }

    if (count === 0) {
      assert.ok(first.includes("There are no published Library articles yet."));
      assert.ok(first.includes('name="robots" content="noindex, nofollow"'));
      assert.ok(first.includes('href="/about/"'));
      assert.ok(!first.includes("article-card"), "No empty/fake article cards");
    } else {
      assert.ok(!first.includes('name="robots" content="noindex, nofollow"'));
      assert.ok(!first.includes("The first studies are being prepared."));
    }

    console.log("PASS: Astro archive build " + count + " published → " +
      pageCount + " numbered archive pages, canonical paths, date and visibility checks");
  }
} finally {
  // No fixture files survive into source control or any later build.
  for (let index = 0; index < backups.length; index++) {
    if (fs.existsSync(backups[index])) {
      fs.rmSync(originals[index], { recursive: true, force: true });
      fs.renameSync(backups[index], originals[index]);
    }
  }
}
console.log("PASS: isolated MDX fixtures restored; final dist is test-only output for browser QA");
