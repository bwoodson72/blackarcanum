import assert from "node:assert/strict";
import {
  getMediaDisplayPlan,
  MEDIA_SIZES,
  validateMediaVariant,
} from "../src/lib/media-display.ts";

const record = (id, role) => ({ id, role });
for (const [role, variant] of [
  ["editorial", "card"],
  ["editorial", "hero"],
  ["reference", "reference"],
  ["decorative", "decorative"],
]) {
  assert.doesNotThrow(() => validateMediaVariant(record("ci-" + role, role), variant),
    "Valid role/variant combination");
}
for (const [role, variant] of [
  ["reference", "card"], ["reference", "hero"],
  ["decorative", "card"], ["decorative", "reference"],
  ["editorial", "reference"], ["editorial", "decorative"],
]) {
  assert.throws(() => validateMediaVariant(record("ci-" + role, role), variant),
    /must use|require|must use card or hero/,
    "Reject cropping/reference/decorative mismatches");
}

const source = { width: 1600, height: 900 };
for (const variant of ["decorative", "card", "hero", "reference"]) {
  const plan = getMediaDisplayPlan(source, variant);
  assert.equal(plan.sizes, MEDIA_SIZES[variant]);
  assert.ok(plan.widths.length > 1 && plan.widths.every((w) => w <= source.width),
    "Responsive widths never upscale the source");
  assert.ok(plan.widths.every((w, i) => i === 0 || plan.widths[i - 1] < w),
    "Widths are ordered and unique");
  assert.ok(plan.displayWidth > 0 && plan.displayWidth <= source.width);
  assert.ok(plan.displayHeight > 0 && plan.displayHeight <= source.height);
  assert.equal(plan.preserveFullImage, variant !== "card");
  assert.equal(plan.eager, variant === "hero",
    "Only a primary hero requests eager loading by default");
}
assert.equal(getMediaDisplayPlan({width: 120, height: 300}, "reference").widths.join(","), "120",
  "No upscaling tiny reference images");
assert.equal(getMediaDisplayPlan({width: 600, height: 900}, "reference").displayHeight, 900,
  "Reference portrait intrinsic aspect ratio is preserved");
assert.equal(getMediaDisplayPlan({width: 1600, height: 900}, "card").displayHeight, 338,
  "Explicit dimensions keep the original aspect ratio (crop happens only in CSS)");
assert.equal(getMediaDisplayPlan(source, "hero", false).eager, false,
  "An author can disable priority for a below-the-fold hero");
assert.throws(() => getMediaDisplayPlan(source, "card", true), /Only a primary hero/);
assert.throws(() => getMediaDisplayPlan(source, "reference", true), /Only a primary hero/);
for (const invalid of [{ width: 0, height: 100 }, { width: 200, height: NaN }, { width: -1, height: 2 }]) {
  assert.throws(() => getMediaDisplayPlan(invalid, "reference"), /invalid intrinsic dimensions/);
}
console.log("PASS: four variants, source-native aspect, no upscaling, source-responsive widths, card-only cropping, hero priority, small SVG/reference");
