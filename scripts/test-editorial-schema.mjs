// Permanent content-schema and registry regression tests.
// Tests use local fictitious IDs solely as nonpublic in-memory fixtures.
import assert from "node:assert/strict";
import {
  editorialSchema,
  createEditorialSchema,
  createEditorialIdGenerator,
} from "../src/lib/editorial-schema.ts";
import {
  validateTopicRegistry,
  validateSourceRegistry,
} from "../src/lib/editorial-registry-validation.ts";
import { citationSchema } from "../src/lib/editorial-citations.ts";
import { topics } from "../src/data/topics.ts";
import { sources } from "../src/data/sources.ts";

const draft = { slug: "a-study", title: "A study", description: "Research summary", status: "draft" };
const review = { ...draft, status: "review" };
const published = { ...draft, status: "published", publishedAt: "2026-10-27" };

// Registry content is owner-controlled and will evolve; validity, not emptiness,
// is the durable regression contract.
assert.doesNotThrow(() => validateTopicRegistry(topics));
assert.doesNotThrow(() => validateSourceRegistry(sources));

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

// Empty production registries reject *all* guessed topic/source IDs.
for (const field of ["topics", "sourceIds"]) {
  const parsed = editorialSchema.safeParse({ ...draft, [field]: ["test-id"] });
  assert.equal(parsed.success, false, `Unknown ${field} rejected`);
  assert.match(parsed.error.issues[0].message, /Unknown/);
}
assert.equal(editorialSchema.safeParse({
  ...draft, citations: [{ sourceId: "test-source", locator: { page: "12" } }],
}).success, false, "Unknown citation source rejected");

// In-memory fixtures prove approved references pass, without adding topics or
// bibliographic content to the actual version-controlled registries.
const fixtureTopics = [{
  id: "test-topic", label: "Test topic", enabled: true, showInBrowse: false,
  description: "Test-only",
}];
const fixtureSources = [{
  id: "test-source", title: "Test-only bibliography record", creator: "Test creator",
  edition: "Test edition", translator: "Test translator", period: "Test period",
  publisher: "Test publisher", archive: "Test archive",
  stableUrl: "https://example.org/test-source", rights: "Test rights",
  kind: "primary",
}];
const fixtureSchema = createEditorialSchema({ topics: fixtureTopics, sources: fixtureSources });
const cited = {
  ...published,
  topics: ["test-topic"],
  sourceIds: ["test-source"],
  citations: [{
    sourceId: "test-source",
    locator: { page: "xii–xiv", passage: "II.4", folio: "17r", section: "3" },
    note: "Citation locator fixture",
  }],
};
assert.equal(fixtureSchema.safeParse(cited).success, true, "Known topic/source and citation accepted");

for (const [field, value] of [
  ["topics", ["missing-topic"]],
  ["sourceIds", ["missing-source"]],
  ["citations", [{ sourceId: "missing-source", locator: { passage: "II.4" } }]],
]) {
  const parsed = fixtureSchema.safeParse({ ...cited, [field]: value });
  assert.equal(parsed.success, false, `Reject unknown reference: ${field}`);
  assert.ok(parsed.error.issues.some(({ message }) => message.includes("Unknown")));
}
assert.equal(citationSchema.safeParse({
  sourceId: "test-source", locator: { folio: "17v" },
}).success, true, "Folio locators supported");
assert.equal(citationSchema.safeParse({
  sourceId: "test-source", locator: {},
}).success, false, "Empty locator rejected");
assert.equal(citationSchema.safeParse({
  sourceId: "test-source", locator: { page: "  " },
}).success, false, "Blank locator rejected");
assert.equal(fixtureSchema.safeParse({ ...cited, citations: [{ sourceId: "test-source", locator: {} }] }).success, false);

assert.throws(() => validateTopicRegistry([fixtureTopics[0], fixtureTopics[0]]), /Duplicate topic ID/);
assert.throws(() => validateSourceRegistry([fixtureSources[0], fixtureSources[0]]), /Duplicate source ID/);
assert.throws(() => createEditorialSchema({ topics: [fixtureTopics[0], fixtureTopics[0]] }), /Duplicate topic ID/);
assert.throws(() => createEditorialSchema({ sources: [fixtureSources[0], fixtureSources[0]] }), /Duplicate source ID/);
assert.throws(() => validateTopicRegistry([{ ...fixtureTopics[0], id: "BAD-TOPIC" }]), /Invalid topic ID/);
assert.throws(() => validateSourceRegistry([{ ...fixtureSources[0], id: "Bad" }]), /Invalid source ID/);
assert.throws(() => validateTopicRegistry([{ ...fixtureTopics[0], label: "" }]), /Invalid topic/);
assert.throws(() => validateTopicRegistry([{ ...fixtureTopics[0], landingPage: "https://example.org" }]), /Invalid landingPage/);
assert.throws(() => validateSourceRegistry([{ ...fixtureSources[0], title: "" }]), /Invalid source/);
assert.throws(() => validateSourceRegistry([{ ...fixtureSources[0], stableUrl: "ftp://example.org/a" }]), /Invalid stableUrl/);

const libraryId = createEditorialIdGenerator("library");
assert.equal(libraryId({ entry: "first.mdx", data: { slug: "stable-article" } }), "stable-article");
assert.equal(libraryId({ entry: "first.mdx", data: { slug: "stable-article" } }), "stable-article", "Watch reload of same entry is safe");
assert.throws(() => libraryId({ entry: "second.mdx", data: { slug: "stable-article" } }), /duplicate slug/);
assert.throws(() => libraryId({ entry: "third.mdx", data: { slug: "INVALID" } }), /valid frontmatter slug/);
assert.throws(() => libraryId({ entry: "fourth.mdx", data: {} }), /valid frontmatter slug/);
const grimoireId = createEditorialIdGenerator("grimoire");
assert.equal(grimoireId({ entry: "different.mdx", data: { slug: "stable-article" } }), "stable-article",
  "Identical slug in another collection is allowed");

console.log("PASS: statuses, dates, stable slugs, registry uniqueness, citation locators, known/unknown topic/source references");
