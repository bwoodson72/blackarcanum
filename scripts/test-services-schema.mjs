// Synthetic products exist in memory only; never written into content or routes.
import assert from "node:assert/strict";
import { serviceSchema, createServiceIdGenerator } from "../src/lib/services-schema.ts";
import { selectPublishedServices, serviceProductUrl, serviceSphereUrl } from "../src/lib/services-catalog.ts";
import { serviceSpheres } from "../src/data/service-spheres.ts";

const draft = { slug: "fixture-reading", title: "Test only", summary: "Synthetic fixture", sphere: "love", kind: "reading", status: "draft" };
const published = { ...draft, status: "published", approved: true, priceUsdCents: 12345, scope: "Fixture scope", inclusions: ["Fixture inclusion"], process: ["Fixture process"], turnaround: "Fixture timing", clientRequirements: ["Fixture requirement"] };
const entry = (data) => ({ id: data.slug, data: serviceSchema.parse(data) });
const spheres = serviceSpheres.map((s) => ({ ...s, visible: true, published: true }));
assert.deepEqual(selectPublishedServices([]), []);
assert.deepEqual(serviceSpheres.map((s) => s.id), ["love", "money", "protection-uncrossing"]);
assert.ok(serviceSpheres.every((s) => !s.visible && !s.published));
assert.equal(serviceSchema.safeParse(draft).success, true);
for (const status of ["draft", "review"]) {
  assert.deepEqual(selectPublishedServices([entry({ ...published, status })], spheres), []);
}
assert.deepEqual(selectPublishedServices([entry(published)]), [], "Real spheres remain closed");
assert.deepEqual(selectPublishedServices([entry(published)], spheres.map((s) => ({ ...s, visible: false }))), []);
assert.deepEqual(selectPublishedServices([entry(published)], spheres.map((s) => ({ ...s, published: false }))), []);
for (const slug of ["", "Bad", "bad slug", "../escape", "a/b", "a-", "%2f"]) {
  assert.equal(serviceSchema.safeParse({ ...draft, slug }).success, false);
  assert.throws(() => serviceProductUrl("love", slug));
}
for (const [field, values] of Object.entries({ sphere: ["future", "../love"], kind: ["custom", "curse"], status: ["live"], priceUsdCents: [-1, 0, 1.5, "100", NaN, Infinity, Number.MAX_SAFE_INTEGER + 1] })) {
  for (const value of values) assert.equal(serviceSchema.safeParse({ ...published, [field]: value }).success, false, `${field}: ${value}`);
}
for (const field of ["priceUsdCents", "scope", "inclusions", "process", "turnaround", "clientRequirements", "approved"]) {
  const data = { ...published }; delete data[field];
  assert.equal(serviceSchema.safeParse(data).success, false, `Required published ${field}`);
}
assert.equal(serviceSchema.safeParse({ ...published, approved: false }).success, false);
assert.equal(serviceSchema.safeParse({ ...published, mediaId: "not-approved" }).success, false);
assert.equal(serviceSchema.safeParse({ ...published, mediaId: "tyche-fortune-city-illustration" }).success, false, "Editorial image has no Services approval");
const [view] = selectPublishedServices([entry(published)], spheres);
assert.equal(view.href, "/services/love/fixture-reading/");
assert.equal(view.priceUsdCents, 12345);
assert.equal(view.availability, "unavailable");
assert.equal(view.id, published.slug);
assert.equal(serviceSphereUrl("money"), "/services/money/");
assert.throws(() => serviceSphereUrl("future"));
assert.throws(() => selectPublishedServices([entry(published), entry(published)], spheres), /Duplicate/);
assert.throws(() => selectPublishedServices([{ ...entry(published), id: "wrong" }], spheres), /mismatched/);
assert.throws(() => selectPublishedServices([entry({ ...published, relatedIds: ["missing"] })], spheres), /Unknown related/);
assert.equal(serviceSchema.safeParse({ ...published, relatedIds: [published.slug] }).success, false);
assert.equal(serviceSchema.safeParse({ ...published, relatedIds: ["other", "other"] }).success, false);
const other = { ...published, slug: "another-fixture", kind: "spellwork", sphere: "money" };
const withRelated = entry({ ...published, relatedIds: [other.slug, draft.slug + "-draft"] });
const catalog = [entry(other), withRelated, entry({ ...draft, slug: draft.slug + "-draft" })];
const result = selectPublishedServices(catalog, spheres);
assert.deepEqual(result.map((p) => p.id), [published.slug, other.slug]);
assert.deepEqual(result[0].relatedIds, [other.slug]);
assert.deepEqual(selectPublishedServices([...catalog].reverse(), spheres), result);
assert.throws(() => selectPublishedServices([], [spheres[0], spheres[0]]), /duplicate/);
const ids = createServiceIdGenerator();
assert.equal(ids({ entry: "a.mdx", data: draft }), draft.slug);
assert.equal(ids({ entry: "a.mdx", data: draft }), draft.slug);
assert.throws(() => ids({ entry: "b.mdx", data: draft }), /duplicate slug/);
assert.throws(() => ids({ entry: "c.mdx", data: { slug: "Bad" } }), /valid/);
assert.throws(() => ids({ entry: "c.mdx", data: {} }), /valid/);
assert.equal(ids({ entry: "a.mdx", data: { slug: "renamed" } }), "renamed");
assert.equal(ids({ entry: "b.mdx", data: draft }), draft.slug);
// Revalidate raw callers; bypassing the loader must not bypass publication checks.
for (const change of [{ approved: false }, { priceUsdCents: undefined }, { scope: " " }]) {
  assert.throws(() => selectPublishedServices([{ id: published.slug, data: { ...published, ...change } }], spheres));
}
const sibling = entry({ ...published, slug: "aaa-fixture", availability: "closed" });
assert.deepEqual(selectPublishedServices([entry(published), sibling], spheres).map((p) => p.id), ["aaa-fixture", published.slug]);
for (const sphere of spheres) {
  assert.equal(selectPublishedServices([entry({ ...published, sphere: sphere.id })], spheres)[0].href,
    `/services/${sphere.id}/${published.slug}/`);
}
console.log("PASS: Services schema, approval gates, unique IDs, related references, ordering and canonical paths");
