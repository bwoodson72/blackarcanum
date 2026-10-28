import assert from "node:assert/strict";
import {
  MIN_TOC_HEADINGS,
  getArticleTableOfContents,
} from "../src/lib/article-toc.ts";

const heading = (depth, slug, text) => ({ depth, slug, text });
assert.equal(MIN_TOC_HEADINGS, 3);
assert.deepEqual(getArticleTableOfContents([]), [], "No headings, no contents");
assert.deepEqual(
  getArticleTableOfContents([heading(2, "one", "One")]),
  [], "Do not show a contents panel on a one-section article"
);
assert.deepEqual(
  getArticleTableOfContents([heading(2, "one", "One"), heading(3, "two", "Two")]),
  [], "Do not show a contents panel on a short article"
);
assert.deepEqual(
  getArticleTableOfContents([
    heading(1, "title", "Title"),
    heading(4, "minor", "Minor"),
    heading(2, "first", "First"),
    heading(3, "second", "Second"),
  ]),
  [], "Only h2/h3 count toward navigable article length"
);

const original = [
  heading(1, "article-title-mdx", "An MDX title"),
  heading(2, "origins", "Origins"),
  heading(3, "preparation", "Preparation"),
  heading(3, "preparation-1", "Preparation"),
  heading(4, "ignored", "Ignored detail"),
  heading(2, "origins-1", "Origins"),
  heading(3, "  ", "Not linkable"),
  heading(2, "not-useful", "  "),
];
const before = structuredClone(original);
const toc = getArticleTableOfContents(original);
assert.deepEqual(toc, [
  original[1], original[2], original[3], original[5],
], "Preserve h2/h3 order and Astro-generated duplicate-label IDs");
assert.deepEqual(original, before, "Do not rewrite renderer metadata");
assert.equal(toc.length, 4);
assert.deepEqual(toc.map(({ slug }) => "#" + slug), [
  "#origins", "#preparation", "#preparation-1", "#origins-1",
]);

assert.throws(
  () => getArticleTableOfContents([
    heading(2, "repeat", "Repeat"),
    heading(3, "repeat", "Repeat"),
    heading(2, "other", "Other"),
  ]),
  /duplicate article heading ID/,
  "Reject colliding renderer IDs rather than emitting broken links"
);
console.log("PASS: MDX heading metadata, duplicate labels, stable anchors, nesting, short-article omission");
