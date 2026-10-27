// Permanent, isolated regression checks: no fabricated MDX reaches production.
import assert from "node:assert/strict";
import {
  EDITORIAL_PAGE_SIZE,
  sortPublishedEntries,
  getArchivePage,
} from "../src/lib/editorial-archive.ts";
import { archivePath, getPaginationModel } from "../src/lib/editorial-pagination.ts";

assert.equal(EDITORIAL_PAGE_SIZE, 12, "A single shared page size");

const entry = (n, status = "published", date = new Date(Date.UTC(2026, 9, 2))) => ({
  id: `qa-${String(n).padStart(2, "0")}`,
  data: { status, ...(date === undefined ? {} : { publishedAt: date }) },
});
const nonpublic = [
  entry(90, "draft"),
  entry(91, "review"),
  entry(92, "published", null),
  entry(93, "published", new Date("not-a-date")),
];
const cases = [
  { count: 0, pages: 0, sizes: [0] },
  { count: 1, pages: 1, sizes: [1] },
  { count: 12, pages: 1, sizes: [12] },
  { count: 13, pages: 2, sizes: [12, 1] },
  { count: 25, pages: 3, sizes: [12, 12, 1] },
];

for (const { count, pages, sizes } of cases) {
  const originals = Array.from({ length: count }, (_, index) => entry(index + 1));
  const all = [...nonpublic, ...originals].reverse();
  const before = all.map((item) => item.id);
  const sorted = sortPublishedEntries(all);
  assert.equal(sorted.length, count, "Drafts, review entries and invalid publication dates never appear");
  assert.deepEqual(sorted.map((item) => item.id), originals.map((item) => item.id),
    "Stable slug breaks publication-date ties, regardless of input order");
  assert.deepEqual(all.map((item) => item.id), before, "Sorting does not mutate the loader result");

  for (let page = 1; page <= Math.max(1, pages); page++) {
    const result = getArchivePage(all, page);
    assert.equal(result.currentPage, page);
    assert.equal(result.totalPages, pages);
    assert.equal(result.totalItems, count);
    assert.equal(result.entries.length, sizes[page - 1]);
    assert.deepEqual(result.entries.map((item) => item.id),
      originals.slice((page - 1) * 12, page * 12).map((item) => item.id));

    const pager = getPaginationModel("library", page, pages);
    if (pages <= 1) {
      assert.equal(pager, undefined);
    } else {
      assert.equal(pager?.previous, page === 1 ? undefined : archivePath("library", page - 1));
      assert.equal(pager?.next, page === pages ? undefined : archivePath("library", page + 1));
    }
    assert.equal(archivePath("library", page),
      page === 1 ? "/library/" : `/library/page/${page}/`);
  }
  assert.throws(() => getArchivePage(all, Math.max(1, pages) + 1), /out of range/);
  console.log(`PASS: ${count} published entries → ${pages} archive pages (${sizes.join(", ")})`);
}

const mixedDates = [
  { id: "zeta", data: { status: "published", publishedAt: new Date("2026-10-02") } },
  { id: "older", data: { status: "published", publishedAt: new Date("2026-10-01") } },
  { id: "alpha", data: { status: "published", publishedAt: new Date("2026-10-02") } },
  { id: "newest", data: { status: "published", publishedAt: new Date("2026-10-03") } },
];
assert.deepEqual(sortPublishedEntries(mixedDates).map(({ id }) => id),
  ["newest", "alpha", "zeta", "older"], "Newest date first; stable ID ascending on ties");
for (const value of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
  assert.throws(() => getArchivePage([], value), /positive safe integer/);
  assert.throws(() => getArchivePage([], 1, value), /positive safe integer/);
}
assert.equal(getArchivePage([], 1).totalPages, 0);
assert.equal(archivePath("library", 1), "/library/");
assert.notEqual(archivePath("library", 1), "/library/page/1/");

console.log("PASS: deterministic chronological sorting, tie break, publication gating and canonical pagination");
