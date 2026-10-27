// Permanent regression suite for curated feature and cross-article QA.
import assert from "node:assert/strict";
import { featuredContent } from "../src/data/features.ts";
import { topics } from "../src/data/topics.ts";
import { sources } from "../src/data/sources.ts";
import { validateEditorialIntegrity, resolveFeatureSections } from "../src/lib/editorial-qa.ts";

const date = (value) => new Date(value);
const base = {
  topics: [{ id: "test-topic", label: "Test topic", enabled: true, showInBrowse: false }],
  sources: [{ id: "test-source", title: "Test bibliography record" }],
  features: { homepageLibrary: [], primaryGrimoire: null, libraryHub: [], grimoireHub: [] },
};
const entry = (collection, id, status = "published", extra = {}) => ({
  collection, id,
  data: {
    status,
    ...(status === "published" ? { publishedAt: date("2026-10-01") } : {}),
    ...extra,
  },
});
const libraryA = entry("library", "alpha", "published", {
  updatedAt: date("2026-10-02"),
  topics: ["test-topic"],
  sourceIds: ["test-source"],
  citations: [{ sourceId: "test-source" }],
  relatedIds: ["grimoire:practice"],
});
const libraryB = entry("library", "beta");
const grimoire = entry("grimoire", "practice");
const hidden = entry("grimoire", "hidden", "draft");
const input = {
  ...base,
  entries: [libraryA, libraryB, grimoire, hidden],
};
const validate = (value) => validateEditorialIntegrity(value);
const fail = (value, message) => assert.throws(() => validate(value), new RegExp(message));

// Test an artificial empty selection without asserting real approved registries
// will always be empty after the editorial launch.
assert.doesNotThrow(() => validate({ entries: [], topics, sources, features: featuredContent }));
assert.deepEqual(resolveFeatureSections({ entries: [], topics, sources, features: featuredContent }), {},
  "Nothing to feature must render no sections, not fake latest entries");

assert.doesNotThrow(() => validate(input), "Valid cross-section reference allowed");
const selected = {
  ...input,
  features: {
    homepageLibrary: ["beta", "alpha"],
    primaryGrimoire: "practice",
    libraryHub: ["alpha"],
    grimoireHub: ["practice"],
  },
};
const sections = resolveFeatureSections(selected);
assert.deepEqual(sections.homepageLibrary?.map(({ id }) => id), ["beta", "alpha"],
  "Explicit feature order must be preserved");
assert.equal(sections.primaryGrimoire?.id, "practice");
assert.equal(sections.libraryHub?.[0]?.id, "alpha");
assert.equal(sections.grimoireHub?.[0]?.id, "practice");
assert.equal(Object.keys(sections).length, 4, "Only explicitly selected sections are present");

const withEntry = (record, replacement) => ({
  ...input,
  entries: input.entries.map((item) =>
    item.collection === record.collection && item.id === record.id ? replacement : item
  ),
});
fail({ ...input, features: { ...input.features, homepageLibrary: ["unknown"] } }, "does not exist");
fail({ ...input, features: { ...input.features, homepageLibrary: ["practice"] } }, "library:practice.*does not exist");
fail({ ...input, features: { ...input.features, primaryGrimoire: "hidden" } }, "not published");
fail({ ...input, features: { ...input.features, grimoireHub: ["hidden"] } }, "not published");
fail({ ...input, features: { ...input.features, homepageLibrary: ["alpha", "alpha"] } }, "duplicate featured ID");
fail({ ...input, features: { ...input.features, libraryHub: ["Not-Slug"] } }, "invalid featured ID");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, relatedIds: ["grimoire:does-not-exist"] } }),
  "unknown related article");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, relatedIds: ["library:alpha"] } }),
  "related to itself");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, relatedIds: ["grimoire:hidden"] } }),
  "is not published");
assert.doesNotThrow(() => validate(withEntry(hidden, {
  ...hidden, data: { ...hidden.data, relatedIds: ["grimoire:practice"] },
})), "Unpublished drafts may reference real published articles");

fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, topics: ["missing"] } }), "unknown topic ID");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, sourceIds: ["missing"] } }), "unknown source ID");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, citations: [{ sourceId: "missing" }] } }),
  "unknown citation source ID");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, updatedAt: date("2026-09-30") } }),
  "updatedAt must not be earlier");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, updatedAt: new Date("bad") } }),
  "invalid updatedAt");
fail(withEntry(libraryA, { ...libraryA, data: { ...libraryA.data, publishedAt: undefined } }),
  "requires a valid publishedAt");
fail({ ...input, entries: [...input.entries, libraryA] }, "duplicate article ID");

const brokenTwice = withEntry(libraryA, {
  ...libraryA, data: { ...libraryA.data, topics: ["missing"], sourceIds: ["missing"] },
});
let errorMessage = "";
try { validate(brokenTwice); } catch (error) { errorMessage = error.message; }
assert.ok(errorMessage.includes("unknown topic ID") && errorMessage.includes("unknown source ID"));
assert.equal(errorMessage, (() => { try { validate(brokenTwice); } catch (e) { return e.message; } })(),
  "QA diagnostics must be deterministic");

console.log("PASS: empty-state omission, ordered curated IDs, unpublished/unknown feature rejection, related/topic/source/citation refs, chronological dates");
