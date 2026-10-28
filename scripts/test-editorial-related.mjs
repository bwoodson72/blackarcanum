import assert from "node:assert/strict";
import {
  parseRelatedArticleId,
  resolveRelatedArticles,
} from "../src/lib/editorial-related.ts";

const date = new Date("2026-10-28T00:00:00Z");
function candidate(collection, id, status = "published", options = {}) {
  return {
    collection,
    entry: {
      id,
      data: {
        status,
        publishedAt: date,
        title: options.title ?? `Reviewed ${collection} ${id}`,
        description: options.description ?? `Description for ${id}`,
        ...(options.preview ? { preview: true } : {}),
        ...(options.publishedAt !== undefined ? { publishedAt: options.publishedAt } : {}),
      },
    },
  };
}

const published = [
  candidate("library", "shared", "published", { title: "Library shared" }),
  candidate("grimoire", "shared", "published", { title: "Grimoire shared", preview: true }),
  candidate("grimoire", "method"),
  candidate("library", "other"),
  candidate("grimoire", "draft-item", "draft"),
  candidate("library", "review-item", "review"),
  candidate("grimoire", "bad-date", "published", { publishedAt: new Date("invalid") }),
];

const selected = resolveRelatedArticles({
  collection: "library",
  id: "shared",
  relatedIds: [
    "grimoire:shared",
    "library:other",
    "grimoire:method",
    "grimoire:shared",
    "library:other",
  ],
}, published);
assert.deepEqual(
  selected.map(({ href }) => href),
  ["/grimoire/shared/", "/library/other/", "/grimoire/method/"],
  "Dedupe repeated selections, preserve author order, and keep collection-specific URLs"
);
assert.deepEqual(selected.map(({ collection }) => collection), ["grimoire", "library", "grimoire"]);
assert.equal(selected[0].title, "Grimoire shared", "Same slug in two collections resolves correctly");
assert.equal(selected[0].preview, true, "Existing public layout-preview status stays intact");
assert.equal(selected[1].preview, undefined, "Do not invent preview flags");
assert.equal(selected[1].excerpt, "Description for other", "Use published editorial metadata");
assert.equal(resolveRelatedArticles({
  collection: "library", id: "shared",
}, published).length, 0, "An uncurated article has no related reading");
assert.deepEqual(
  resolveRelatedArticles({ collection: "grimoire", id: "shared", relatedIds: [] }, published),
  [], "Empty relationship lists stay empty"
);

assert.deepEqual(parseRelatedArticleId("library:ancient-text"), {
  collection: "library", id: "ancient-text",
});
assert.deepEqual(parseRelatedArticleId("grimoire:practice"), {
  collection: "grimoire", id: "practice",
});
for (const invalid of [
  "shared", "other:shared", "library:", "library:Bad", "library:has/slash",
  "library:trailing-", "library:../other", "grimoire:section:extra",
]) {
  assert.throws(() => parseRelatedArticleId(invalid), /Invalid related article ID/,
    "Reject arbitrary or unsafe destination: " + invalid);
}
const baseRequest = { collection: "library", id: "shared" };
const rejected = [
  ["library:missing", /missing related article/],
  ["grimoire:draft-item", /unpublished related article/],
  ["library:review-item", /unpublished related article/],
  ["grimoire:bad-date", /unpublished related article/],
  ["library:shared", /cannot link to itself/],
];
for (const [key, error] of rejected) {
  assert.throws(() => resolveRelatedArticles({
    ...baseRequest, relatedIds: [key],
  }, published), error, "Unsafe relationship must fail closed: " + key);
}
assert.throws(() => resolveRelatedArticles({
  ...baseRequest, relatedIds: ["grimoire:method"],
}, [...published, candidate("grimoire", "method")]), /Duplicate article entry/,
"Ambiguous duplicate collection records are not rendered");

console.log("PASS: explicit related IDs, order-preserving dedupe, cross-collection same-slug URLs, preview labels, empty state and missing/draft/review/self/invalid targets");
