// Permanent dependency-light schema and slug collision regression tests.
// Run using the pinned Node engine: npm run test:content
import assert from "node:assert/strict";
import { editorialSchema, createEditorialIdGenerator } from "../src/lib/editorial-schema.ts";

const draft = { slug: "a-study", title: "A study", description: "Research summary", status: "draft" };
const review = { ...draft, status: "review" };
const published = { ...draft, status: "published", publishedAt: "2026-10-27" };

assert.equal(editorialSchema.safeParse(draft).success, true, "Draft without date is valid");
assert.equal(editorialSchema.safeParse(review).success, true, "Review without date is valid");
assert.equal(editorialSchema.safeParse(published).success, true, "Published with date is valid");
assert.equal(editorialSchema.safeParse({ ...draft, status: "published" }).success, false, "Published requires date");
assert.equal(editorialSchema.safeParse({ ...draft, status: "unlisted" }).success, false, "Reject invalid status");

for (const invalid of ["Bad Slug", "UPPERCASE", "has/slash", "trailing-", "", "../escape"]) {
  assert.equal(editorialSchema.safeParse({ ...draft, slug: invalid }).success, false, `Reject slug: ${invalid}`);
}
assert.equal(editorialSchema.safeParse({ ...published, publishedAt: "not-a-date" }).success, false, "Reject invalid publication date");
assert.equal(editorialSchema.safeParse({ ...draft, relatedIds: ["unknown:item"] }).success, false, "Reject unknown related collection prefix");

const libraryId = createEditorialIdGenerator("library");
assert.equal(libraryId({ entry: "first.mdx", data: { slug: "stable-article" } }), "stable-article");
assert.equal(libraryId({ entry: "first.mdx", data: { slug: "stable-article" } }), "stable-article", "Watch reload of same entry is safe");
assert.throws(() => libraryId({ entry: "second.mdx", data: { slug: "stable-article" } }), /duplicate slug/);
assert.throws(() => libraryId({ entry: "third.mdx", data: { slug: "INVALID" } }), /valid frontmatter slug/);
assert.throws(() => libraryId({ entry: "fourth.mdx", data: {} }), /valid frontmatter slug/);
const grimoireId = createEditorialIdGenerator("grimoire");
assert.equal(grimoireId({ entry: "different.mdx", data: { slug: "stable-article" } }), "stable-article",
  "Identical slug in another collection is allowed");

console.log("PASS: status, required dates, invalid metadata, stable IDs, collision detection");
