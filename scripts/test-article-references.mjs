import assert from "node:assert/strict";
import {
  buildArticleReferences,
  formatCitationLocator,
  getArticleNote,
} from "../src/lib/article-references.ts";

const registry = [
  {
    id: "test-primary",
    title: "CI-only Primary Text",
    creator: "Test-only creator",
    stableUrl: "https://example.org/a",
    kind: "primary",
  },
  { id: "test-no-url", title: "CI-only Source with Unknown Attribution" },
];
const citations = [
  { sourceId: "test-primary", locator: { page: "12" }, note: "First use." },
  { sourceId: "test-primary", locator: { passage: "II.4", folio: "17r" } },
];
const result = buildArticleReferences(citations, ["test-primary", "test-no-url"], registry);
assert.equal(result.notes.length, 2);
assert.equal(result.bibliography.length, 2, "Repeated citations must not duplicate bibliography entries");
assert.deepEqual(result.bibliography.map((source) => source.id), ["test-primary", "test-no-url"]);
assert.deepEqual(result.notes.map((note) => note.number), [1, 2]);
assert.deepEqual(result.notes.map((note) => note.locator), ["page 12", "passage II.4; folio 17r"]);
assert.equal(getArticleNote(2, citations, registry).source.id, "test-primary");
assert.equal(getArticleNote(1, citations, registry).citation.note, "First use.");
assert.equal(formatCitationLocator({
  passage: "IV.2", section: "3", page: "xii–xiv", folio: "17v",
}), "passage IV.2; section 3; page xii–xiv; folio 17v");
assert.equal(formatCitationLocator(undefined), undefined);
assert.equal(buildArticleReferences([], [], registry).bibliography.length, 0);
assert.deepEqual(buildArticleReferences([], ["test-no-url"], registry).notes, []);
assert.equal(buildArticleReferences([], ["test-no-url"], registry).bibliography[0].stableUrl, undefined,
  "Unknown URL is omitted rather than invented");

for (const bad of [0, -1, 1.5, 3, NaN]) {
  assert.throws(() => getArticleNote(bad, citations, registry), /SourceCitation index/);
}
assert.throws(() => buildArticleReferences([{ sourceId: "missing" }], [], registry),
  /Unknown article citation\/source ID/);
assert.throws(() => buildArticleReferences([], ["missing"], registry),
  /Unknown article citation\/source ID/);
assert.throws(() => buildArticleReferences([{ sourceId: "test-primary", locator: {} }], [], registry),
  /Provide at least one/);
assert.throws(() => buildArticleReferences([], ["test-primary"], [
  { ...registry[0], stableUrl: "javascript:alert(1)" },
]), /Invalid stableUrl/);
assert.throws(() => buildArticleReferences([], ["test-primary"], [
  { ...registry[0], stableUrl: "not a url" },
]), /Invalid stableUrl/);
console.log("PASS: repeated-source distinct locators; stable 1-based notes; no repeated bibliography; optional metadata omitted; bad source IDs and URLs rejected");
