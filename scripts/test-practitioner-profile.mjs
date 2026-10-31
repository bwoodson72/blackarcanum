import assert from "node:assert/strict";
import { practitionerProfile } from "../src/data/practitioner.ts";
import { practitionerSchema } from "../src/lib/practitioner-schema.ts";
import { selectPublishedPractitioner } from "../src/lib/practitioner-profile.ts";
assert.equal(practitionerProfile, null);
assert.equal(selectPublishedPractitioner(null, true, true), undefined);
assert.equal(practitionerSchema.safeParse({ status: "draft" }).success, true);
const fact = { text: "Synthetic technical fixture only", verified: true, approved: true, verificationNote: "PRIVATE_NOTE_SENTINEL" };
const source = { status: "published", approved: true, summary: fact, biography: [fact],
  disciplines: [fact, { ...fact, text: "UNVERIFIED_SENTINEL", verified: false }, { ...fact, text: "UNAPPROVED_SENTINEL", approved: false }],
  training: [{ period: "Fixture period", title: "Technical row, not a credential", description: "Test only", verified: false, approved: true }],
};
assert.equal(selectPublishedPractitioner(source), undefined);
assert.equal(selectPublishedPractitioner(source, true, false), undefined);
assert.equal(selectPublishedPractitioner({ ...source, status: "draft" }, true, true), undefined);
assert.equal(selectPublishedPractitioner({ ...source, status: "review" }, true, true), undefined);
const view = selectPublishedPractitioner(source, true, true);
assert.equal(view.href, "/services/practitioner/");
assert.deepEqual(view.biography, [fact.text]); assert.deepEqual(view.disciplines, [fact.text]);
assert.deepEqual(view.training, []);
assert.doesNotMatch(JSON.stringify(view), /PRIVATE_NOTE_SENTINEL|UNVERIFIED_SENTINEL|UNAPPROVED_SENTINEL|verificationNote|approved|verified/);
for (const patch of [{ approved: false }, { summary: { ...fact, verified: false } }, { biography: [] }, { biography: [{ ...fact, approved: false }] }]) {
  assert.equal(practitionerSchema.safeParse({ ...source, ...patch }).success, false);
}
assert.equal(practitionerSchema.safeParse({ ...source, legalName: "NOT_A_PUBLIC_FIELD" }).success, false);
console.log("PASS: practitioner source empty, profile/claim approvals, publication/release/routes gates and private-note stripping");
