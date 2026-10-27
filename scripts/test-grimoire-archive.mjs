import assert from "node:assert/strict";
import {
  EDITORIAL_PAGE_SIZE, getArchivePage, sortPublishedEntries,
} from "../src/lib/editorial-archive.ts";
import { archivePath, getPaginationModel } from "../src/lib/editorial-pagination.ts";

const make = (i, status = "published", publishedAt = new Date("2026-10-02T00:00:00Z")) => ({
  id: `qa-${String(i).padStart(2, "0")}`,
  data: { status, publishedAt },
});
const invalid = [
  make(90, "draft"),
  make(91, "review"),
  make(92, "published", null),
  make(93, "published", new Date("invalid")),
];

assert.equal(EDITORIAL_PAGE_SIZE, 12, "Shared Library/Grimoire page size");

for (const count of [0, 1, 12, 13, 25]) {
  const published = Array.from({ length: count }, (_, i) => make(i + 1));
  const mixed = [...invalid, ...published].reverse();
  const initial = mixed.map((x) => x.id);
  const expectedPages = Math.ceil(count / 12);
  const sorted = sortPublishedEntries(mixed);

  assert.equal(sorted.length, count, "Grimoire archive contains published entries only");
  assert.deepEqual(sorted.map((x) => x.id), published.map((x) => x.id));
  assert.deepEqual(mixed.map((x) => x.id), initial, "Sorting never mutates the content loader");
  for (let page = 1; page <= Math.max(1, expectedPages); page++) {
    const result = getArchivePage(mixed, page);
    assert.equal(result.totalItems, count);
    assert.equal(result.totalPages, expectedPages);
    assert.equal(result.currentPage, page);
    const expectedItems = published.slice((page - 1) * 12, page * 12);
    assert.deepEqual(result.entries.map((x) => x.id), expectedItems.map((x) => x.id));
    assert.equal(result.entries.length, Math.min(12, Math.max(0, count - (page - 1) * 12)));
    assert.equal(
      archivePath("grimoire", page),
      page === 1 ? "/grimoire/" : `/grimoire/page/${page}/`,
    );
    const nav = getPaginationModel("grimoire", page, expectedPages);
    if (expectedPages <= 1) {
      assert.equal(nav, undefined);
    } else {
      assert.equal(nav?.previous,
        page === 1 ? undefined : archivePath("grimoire", page - 1));
      assert.equal(nav?.next,
        page === expectedPages ? undefined : archivePath("grimoire", page + 1));
    }
  }
  assert.throws(() => getArchivePage(mixed, Math.max(1, expectedPages) + 1), /out of range/);
  console.log(`PASS: Grimoire ${count} entries → ${expectedPages} archive pages`);
}

assert.deepEqual(
  sortPublishedEntries([
    { id: "z", data: { status: "published", publishedAt: new Date("2026-10-02") } },
    { id: "earlier", data: { status: "published", publishedAt: new Date("2026-10-01") } },
    { id: "a", data: { status: "published", publishedAt: new Date("2026-10-02") } },
    { id: "new", data: { status: "published", publishedAt: new Date("2026-10-03") } },
  ]).map((e) => e.id),
  ["new", "a", "z", "earlier"],
  "Newest publication first, then stable ASCII slug ascending",
);
assert.equal(archivePath("grimoire", 1), "/grimoire/");
assert.notEqual(archivePath("grimoire", 1), "/grimoire/page/1/");
assert.throws(() => getArchivePage([], 0), /positive safe integer/);
assert.throws(() => getArchivePage([], 1, 0), /positive safe integer/);
console.log("PASS: Grimoire canonical pagination, draft filters, timestamp and stable-ID tie breaking");
