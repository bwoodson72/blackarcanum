import assert from "node:assert/strict";
import { formatServicePrice, serviceCardPresentation, toPublishedSphereViews } from "../src/lib/services-presentation.ts";
import { selectPublishedServices } from "../src/lib/services-catalog.ts";
import { serviceSchema } from "../src/lib/services-schema.ts";
import { serviceSpheres } from "../src/data/service-spheres.ts";
// In-memory synthetic product only. Never written to a collection or public page.
const data = serviceSchema.parse({ slug: "test-only", title: "Fixture", summary: "Test only", sphere: "love", kind: "reading", status: "published", approved: true, priceUsdCents: 12345, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] });
const spheres = serviceSpheres.map((s) => ({ ...s, visible: true, published: true }));
const [product] = selectPublishedServices([{ id: data.slug, data }], spheres);
assert.equal(formatServicePrice(12345), "$123.45");
assert.equal(formatServicePrice(12300), "$123.00");
assert.equal(formatServicePrice(1), "$0.01");
assert.equal(formatServicePrice(Number.MAX_SAFE_INTEGER), "$90,071,992,547,409.91");
for (const cents of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => formatServicePrice(cents));
assert.equal(serviceCardPresentation(product).kindLabel, "Reading");
assert.equal(serviceCardPresentation({ ...product, kind: "spellwork" }).kindLabel, "Spellwork");
for (const patch of [{ href: "https://example.org" }, { status: "draft" }, { approved: false }, { id: "wrong" }, { priceUsdCents: undefined }]) {
  assert.throws(() => serviceCardPresentation({ ...product, ...patch }));
}
assert.deepEqual(toPublishedSphereViews([product]), []);
assert.deepEqual(toPublishedSphereViews([], spheres), []);
assert.deepEqual(toPublishedSphereViews([product], spheres).map((s) => [s.id, s.href, s.productCount]), [["love", "/services/love/", 1]]);
console.log("PASS: Services card prices, types, canonical links and nonempty published sphere views");
