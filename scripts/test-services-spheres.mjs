import assert from "node:assert/strict";
import { serviceSpheres } from "../src/data/service-spheres.ts";
import { servicesPublicReleaseApproved } from "../src/data/services-release.ts";
import { serviceSchema } from "../src/lib/services-schema.ts";
import { selectPublishedServices } from "../src/lib/services-catalog.ts";
import { buildServiceSpherePaths } from "../src/lib/services-spheres.ts";
const registry = serviceSpheres.map(s => ({ ...s, published: true, visible: true }));
// Synthetic, in-memory products only.
const entries = registry.flatMap(sphere => ["reading", "spellwork", "draft", "review"].map(kind => {
  const data = serviceSchema.parse({ slug: `fixture-${sphere.id}-${kind}`, title: "Test only", summary: "Fixture", sphere: sphere.id,
    kind: kind === "spellwork" ? "spellwork" : "reading", status: ["draft", "review"].includes(kind) ? kind : "published",
    approved: true, priceUsdCents: 12345, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] });
  return { id: data.slug, data };
}));
assert.equal(servicesPublicReleaseApproved, false, "Implementation does not authorize release");
const products = selectPublishedServices(entries, registry);
assert.equal(buildServiceSpherePaths(products).length, 3);
assert.deepEqual(buildServiceSpherePaths(products, false, registry), []);
assert.deepEqual(buildServiceSpherePaths([], true, registry).map(p => p.props.products.length), [0, 0, 0]);
const paths = buildServiceSpherePaths(products, true, registry);
assert.deepEqual(paths.map(p => p.params.sphere), registry.map(s => s.id));
for (const { params, props } of paths) {
  assert.equal(props.sphere.href, `/services/${params.sphere}/`);
  assert.equal(props.sphere.productCount, 2);
  assert.deepEqual(props.products.map(p => p.kind).sort(), ["reading", "spellwork"]);
  assert.ok(props.products.every(p => p.href.startsWith(props.sphere.href)));
}
assert.deepEqual(buildServiceSpherePaths(products.filter(p => p.sphere !== "money"), true, registry).map(p => p.params.sphere), ["love", "money", "protection-uncrossing"]);
const restricted = registry.map(s => ({ ...s, published: s.id !== "money", visible: s.id !== "love" }));
assert.deepEqual(buildServiceSpherePaths(selectPublishedServices(entries, restricted), true, restricted).map(p => p.params.sphere), ["protection-uncrossing"]);
assert.throws(() => buildServiceSpherePaths([{ ...products[0], status: "draft" }], true, registry));
assert.throws(() => buildServiceSpherePaths(products, true, [{ ...registry[0], id: "future" }]));
console.log("PASS: sphere paths, ordinary visibility, all three IDs, empty categories, mixed kinds, draft/review/hidden exclusion");
