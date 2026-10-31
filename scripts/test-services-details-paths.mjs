import assert from "node:assert/strict";
import { serviceSpheres } from "../src/data/service-spheres.ts";
import { serviceSchema } from "../src/lib/services-schema.ts";
import { selectPublishedServices } from "../src/lib/services-catalog.ts";
import { buildServiceProductPaths } from "../src/lib/services-details.ts";
const spheres = serviceSpheres.map(s => ({ ...s, visible: true, published: true }));
// Synthetic fixtures only; never written into the real catalog.
const base = { title: "Fixture", summary: "Test only", status: "published", approved: true, kind: "reading", priceUsdCents: 12345, scope: "Scope fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] };
const raw = [
  { ...base, slug: "fixture-reading", sphere: "love", relatedIds: ["fixture-spellwork", "fixture-draft", "fixture-review"] },
  { ...base, slug: "fixture-spellwork", sphere: "money", kind: "spellwork" },
  { ...base, slug: "fixture-draft", sphere: "love", status: "draft" },
  { ...base, slug: "fixture-review", sphere: "love", status: "review" },
];
const products = selectPublishedServices(raw.map(data => ({ id: data.slug, data: serviceSchema.parse(data) })), spheres);
assert.deepEqual(buildServiceProductPaths(products), []);
assert.deepEqual(buildServiceProductPaths([], true, spheres), []);
const paths = buildServiceProductPaths(products, true, spheres);
assert.deepEqual(paths.map(p => p.params), [{ sphere: "love", slug: "fixture-reading" }, { sphere: "money", slug: "fixture-spellwork" }]);
assert.deepEqual(paths[0].props.related.map(p => p.id), ["fixture-spellwork"]);
assert.deepEqual(paths[1].props.related, []);
assert.equal(paths[0].props.product.priceUsdCents, 12345);
assert.throws(() => buildServiceProductPaths([...products, products[0]], true, spheres), /Duplicate/);
assert.throws(() => buildServiceProductPaths([{ ...products[0], status: "draft" }], true, spheres));
assert.deepEqual(buildServiceProductPaths(products, true, spheres.map(s => ({ ...s, visible: false }))), []);
assert.deepEqual(buildServiceProductPaths([{ ...products[0], relatedIds: ["missing"] }], true, spheres)[0].props.related, []);
console.log("PASS: product paths, release approval, canonical sphere, published-only curated relations and exact catalog price");
