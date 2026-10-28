// Prompt 19: in-memory registry validation; none of these fixtures are real art.
import assert from "node:assert/strict";
import {
  getMediaRecord,
  mediaPublicationIssues,
  requiresHistoricalProvenance,
  validateMediaRegistry,
} from "../src/lib/media-registry.ts";
import { media } from "../src/data/media.ts";
import { createEditorialSchema } from "../src/lib/editorial-schema.ts";
import { validateEditorialIntegrity } from "../src/lib/editorial-qa.ts";

const historical = {
  id: "ci-ancient-relief",
  sourceFile: "src/assets/media/reference/greek-art/ancient-relief-01.png",
  originalFile: "media-originals/greek-art/ancient-relief-01.tif",
  role: "reference",
  origin: "historical-reproduction",
  alt: "Test-only carved relief with figures",
  decorative: false,
  caption: "Test-only historic stone relief, provenance documented in CI records.",
  creator: "Known original work creator",
  date: "Example date",
  period: "Example period",
  repository: "Example museum",
  sourceUrl: "https://example.org/archive/image-1",
  rights: {
    status: "cleared",
    basis: "cc-license",
    license: "CC BY 4.0 (CI fixture only)",
    creditLine: "Example museum, photographer (CI fixture only)",
    evidenceUrl: "https://example.org/archive/image-1/reuse",
  },
};

const modern = {
  id: "ci-modern-editorial",
  sourceFile: "src/assets/media/editorial/greek-art/modern-painting-01.webp",
  role: "editorial",
  origin: "modern-artwork",
  alt: "Modern illustrative artwork for an article, CI fixture",
  decorative: false,
  creator: "Example commissioned creator",
  rights: {
    status: "cleared",
    basis: "owned",
    license: "Owner-created illustration, rights documented internally (CI fixture)",
    creditLine: "Example approved creator",
    evidenceNote: "Contract and rights paperwork held privately; fixture only.",
  },
};
const decorative = {
  id: "ci-ornament",
  sourceFile: "src/assets/media/decorative/ornament-01.svg",
  role: "decorative",
  origin: "modern-artwork",
  alt: "",
  decorative: true,
  rights: {
    status: "cleared",
    basis: "owned",
    license: "Original ornament; internal rights documentation (fixture)",
    creditLine: "Example creator",
    evidenceNote: "Owner-created motif, fixture only.",
  },
};
const pending = {
  ...historical, id: "ci-pending-reference",
  sourceFile: "src/assets/media/reference/greek-art/pending-01.png",
  originalFile: undefined,
  rights: { status: "pending" },
};

const inventory = {
  files: [historical.sourceFile, modern.sourceFile, decorative.sourceFile, pending.sourceFile],
  originals: [historical.originalFile],
};
assert.doesNotThrow(() => validateMediaRegistry(media), "Approved registry may grow without rewriting this test");
assert.doesNotThrow(() => validateMediaRegistry([], { files: [], originals: [] }),
  "Empty media registry + no assets is valid");
assert.doesNotThrow(() => validateMediaRegistry([historical, modern, decorative, pending], inventory),
  "Correct roles, alt text, provenance, rights and local inventory are valid");
assert.equal(requiresHistoricalProvenance(historical), true);
assert.equal(requiresHistoricalProvenance(modern), false);
assert.equal(mediaPublicationIssues(pending).length > 0, true);
assert.deepEqual(mediaPublicationIssues(modern), []);
assert.deepEqual(mediaPublicationIssues(historical), []);
assert.equal(getMediaRecord(historical.id, [historical, modern]), historical,
  "Reused ID resolves to the same actual record");

function invalid(change, pattern, name) {
  assert.throws(() => validateMediaRegistry([change], inventory), pattern, name);
}
invalid({ ...historical, id: "Bad ID" }, /invalid stable media ID/, "No uppercase or spaces in IDs");
invalid({ ...historical, id: "../escape" }, /invalid stable media ID/, "No path traversal IDs");
invalid({ ...historical, sourceFile: "https://evil.example/img.png" }, /invalid sourceFile/, "No remote URLs");
invalid({ ...historical, sourceFile: "../outside.png" }, /invalid sourceFile/, "No path traversal");
invalid({ ...historical, sourceFile: "public/a.png" }, /invalid sourceFile/, "Optimized sources in src/assets only");
invalid({ ...historical, sourceFile: "src/assets/media/reference/not-an-image.txt" },
  /invalid sourceFile/, "Known image extensions only");
invalid({ ...historical, role: "editorial" }, /role must match/, "Media role matches storage folder");
invalid({ ...historical, sourceFile: "src/assets/media/reference/missing.png" },
  /missing source image/, "Missing source file fails validation");
invalid({ ...historical, originalFile: "media-originals/missing.tif" },
  /missing high-resolution original/, "Missing declared original is rejected");
invalid({ ...historical, originalFile: "../external-original.tif" },
  /invalid originalFile/, "Originals cannot escape private folder");
invalid({ ...historical, decorative: true }, /decorative flag/, "Reference figure is not decorative");
invalid({ ...historical, alt: "" }, /descriptive alt text/, "Nondecorative image requires alt");
invalid({ ...decorative, alt: "Unnecessary description" },
  /decorative alt must be empty/, "Decorative images require empty alt");
invalid({ ...historical, caption: undefined }, /figure caption/, "Reference image needs a caption");
invalid({ ...historical, sourceUrl: undefined }, /traceable sourceUrl/, "Historical provenance URL required");
invalid({ ...historical, sourceUrl: "javascript:alert(1)" },
  /invalid sourceUrl/, "Untrusted protocols rejected");
invalid({ ...historical, origin: "fabricated" }, /origin must distinguish/,
  "Historical vs modern origin must be explicit");
invalid({ ...historical, rights: undefined }, /rights status is required/,
  "Rights status is mandatory");
invalid({ ...historical, rights: { status: "cleared" } }, /rights basis/,
  "Cleared status alone is not proof");
invalid({ ...historical, rights: { ...historical.rights, license: undefined } },
  /rights license/, "Precise license or permission statement required");
invalid({ ...historical, rights: { ...historical.rights, creditLine: undefined } },
  /rights creditLine/, "Historical rights require attribution");
invalid({ ...historical, rights: { ...historical.rights, evidenceUrl: undefined } },
  /separate rights evidenceUrl/, "Historical rights evidence is separate from artifact URL");
invalid({ ...historical, rights: { ...historical.rights, evidenceUrl: "file:///etc/passwd" } },
  /invalid rights evidenceUrl/, "Unsafe rights evidence rejected");
invalid({ ...modern, rights: { ...modern.rights, evidenceNote: undefined } },
  /rights evidenceUrl or evidenceNote/, "Modern owned media requires evidence");
invalid({ ...historical, rights: { ...historical.rights, status: "unknown" } },
  /rights status is required/, "Unknown rights vocabulary rejected");
invalid({ ...historical, rights: { ...historical.rights, basis: "not-licensed" } },
  /invalid rights basis/, "Unknown rights basis rejected");
assert.throws(
  () => validateMediaRegistry([historical, { ...historical }], inventory),
  /duplicate media ID/, "No conflicting metadata for one image ID"
);
assert.throws(
  () => validateMediaRegistry([historical, { ...historical, id: "another-id" }], inventory),
  /duplicate sourceFile/, "Reuse stable IDs rather than duplicating rights records"
);
assert.throws(() => getMediaRecord("not-present", [modern]), /Unknown media ID/);

const draft = { slug: "ci-draft", title: "Fixture", description: "Sample", status: "draft" };
const published = { ...draft, status: "published", publishedAt: "2026-10-28" };
const schema = createEditorialSchema({ media: [historical, modern, decorative, pending] });
assert.equal(schema.safeParse(draft).success, true, "Articles do not require images");
assert.equal(schema.safeParse({ ...draft, mediaIds: [historical.id, modern.id] }).success, true,
  "A draft can reuse existing image IDs across article types");
assert.equal(schema.safeParse({ ...draft, mediaIds: [pending.id] }).success, true,
  "Draft may reference image still under rights review");
assert.equal(schema.safeParse({ ...published, mediaIds: [pending.id] }).success, false,
  "Published articles cannot include uncleared images");
assert.equal(schema.safeParse({ ...published, mediaIds: [historical.id, modern.id] }).success, true,
  "Approved media reused by a published page is valid");
assert.equal(schema.safeParse({ ...draft, mediaIds: ["missing-media"] }).success, false,
  "Unknown media ID is rejected even from a draft");
assert.equal(schema.safeParse({ ...draft, mediaIds: ["../escape"] }).success, false,
  "Invalid media IDs do not enter the article schema");

const features = { homepageLibrary: [], primaryGrimoire: null, libraryHub: [], grimoireHub: [] };
const input = {
  entries: [
    { collection: "library", id: "first", data: { status: "published", publishedAt: new Date("2026-10-28"), mediaIds: [historical.id] } },
    { collection: "grimoire", id: "second", data: { status: "published", publishedAt: new Date("2026-10-28"), mediaIds: [historical.id] } },
  ],
  topics: [], sources: [], media: [historical, modern, decorative, pending], features,
};
assert.doesNotThrow(() => validateEditorialIntegrity(input),
  "Same approved media ID may be reused across both sections");
assert.throws(() => validateEditorialIntegrity({
  ...input, entries: [{ ...input.entries[0], data: { ...input.entries[0].data, mediaIds: [pending.id] } }],
}), /not cleared for publication/, "QA rejects pending rights on published article");
assert.throws(() => validateEditorialIntegrity({
  ...input, entries: [{ ...input.entries[0], data: { ...input.entries[0].data, mediaIds: ["missing-media"] } }],
}), /unknown media ID/, "QA rejects broken media references");
console.log("PASS: empty registry, local source files, private masters, IDs, captions, decorative alt, historical provenance, clearance, article mediaIds reuse, pending/draft vs published gates");
