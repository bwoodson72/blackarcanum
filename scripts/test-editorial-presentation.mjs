import assert from "node:assert/strict";
import { articlePath, toPublishedArticle } from "../src/lib/editorial-presentation.ts";
import { archivePath, getPaginationModel } from "../src/lib/editorial-pagination.ts";

const dt = new Date("2026-10-02T00:00:00.000Z");
const published = {
  id: "primary-source-review",
  data: {
    status: "published",
    title: "Test title",
    description: "Test summary",
    publishedAt: dt,
    hero: { src: "/test-editorial.jpg", alt: "Actual artwork description" },
  },
};
const library = toPublishedArticle({ collection: "library", entry: published });
assert.deepEqual(library, {
  id: "primary-source-review",
  collection: "library",
  title: "Test title",
  href: "/library/primary-source-review/",
  excerpt: "Test summary",
  publishedAt: dt,
  image: { src: "/test-editorial.jpg", alt: "Actual artwork description" },
});
assert.equal(toPublishedArticle({
  collection: "library", entry: { ...published, data: { ...published.data, preview: true } },
})?.preview, true, "Public layout previews carry the noindex flag");
assert.equal(toPublishedArticle({ collection: "library", entry: published })?.preview, undefined,
  "Ordinary reviewed articles do not inherit preview status");
assert.equal(toPublishedArticle({ collection: "grimoire", entry: { ...published, data: { ...published.data, status: "draft" } } }), undefined);
assert.equal(toPublishedArticle({ collection: "library", entry: { ...published, data: { ...published.data, status: "review" } } }), undefined);
assert.equal(toPublishedArticle({ collection: "library", entry: { ...published, data: { ...published.data, publishedAt: undefined } } }), undefined);
assert.equal(toPublishedArticle({ collection: "library", entry: { ...published, data: { ...published.data, publishedAt: new Date("bad") } } }), undefined);
assert.equal(toPublishedArticle({
  collection: "grimoire",
  entry: { ...published, data: { ...published.data, hero: undefined, description: undefined } },
}).image, undefined, "No invented image for text-only articles");

assert.equal(articlePath("library", "valid-id"), "/library/valid-id/");
assert.equal(articlePath("grimoire", "valid-id"), "/grimoire/valid-id/");
assert.throws(() => articlePath("library", "../bad"), /Invalid/);
assert.throws(() => articlePath("library", "UPPER"), /Invalid/);
for (const section of ["library", "grimoire"]) {
  assert.equal(archivePath(section, 1), `/${section}/`);
  assert.equal(archivePath(section, 2), `/${section}/page/2/`);
  assert.equal(archivePath(section, 27), `/${section}/page/27/`);
}
for (const bad of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
  assert.throws(() => archivePath("library", bad), /Page/);
}
assert.throws(() => archivePath("bogus", 1), /Unknown editorial collection/);
assert.equal(getPaginationModel("library", 1, 0), undefined);
assert.equal(getPaginationModel("library", 1, 1), undefined);
assert.throws(() => getPaginationModel("library", 2, 0), /empty archive/);
assert.throws(() => getPaginationModel("library", 3, 2), /outside/);
assert.throws(() => getPaginationModel("library", 0, 4), /outside/);
assert.throws(() => getPaginationModel("library", 1, -1), /nonnegative/);
assert.throws(() => getPaginationModel("library", 1, 2.5), /nonnegative/);

const first = getPaginationModel("library", 1, 5);
assert.equal(first.previous, undefined);
assert.equal(first.next, "/library/page/2/");
assert.deepEqual(first.parts, [
  { kind: "page", page: 1 }, { kind: "page", page: 2 },
  { kind: "ellipsis" },
  { kind: "page", page: 5 },
]);
const middle = getPaginationModel("library", 5, 10);
assert.equal(middle.previous, "/library/page/4/");
assert.equal(middle.next, "/library/page/6/");
assert.deepEqual(middle.parts, [
  { kind: "page", page: 1 }, { kind: "ellipsis" },
  { kind: "page", page: 4 }, { kind: "page", page: 5 },
  { kind: "page", page: 6 }, { kind: "ellipsis" },
  { kind: "page", page: 10 },
]);
const last = getPaginationModel("grimoire", 10, 10);
assert.equal(last.previous, "/grimoire/page/9/");
assert.equal(last.next, undefined);
assert.ok(last.parts.some((p) => p.kind === "page" && p.page === 10));
assert.equal(getPaginationModel("grimoire", 2, 2).previous, "/grimoire/");

console.log("PASS: published-only normalized cards, text-only normalization, stable article/archive paths, accessible pagination model boundaries and compact windows");
