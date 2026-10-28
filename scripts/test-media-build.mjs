// Prompt 19: real Astro static build must reject a non-existent registered
// image. Registry source is restored byte-for-byte even if the build fails.
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const registry = "src/data/media.ts";
const original = fs.readFileSync(registry, "utf8");
const marker = "export const media: readonly MediaRecord[] = ";
const markerIndex = original.indexOf(marker);
assert.ok(markerIndex >= 0 && original.indexOf(marker, markerIndex + 1) === -1,
  "Expected one typed media export; refuse to overwrite an unexpected registry format.");

const badRecord = `export const media: readonly MediaRecord[] = [{
  id: "ci-missing-source",
  sourceFile: "src/assets/media/reference/ci-absent-source.png",
  role: "reference",
  origin: "historical-reproduction",
  alt: "CI-only image record that has no asset file",
  decorative: false,
  caption: "Test caption; this image has never been selected or published.",
  sourceUrl: "https://example.org/ci-only-source",
  rights: { status: "pending" },
}];`;

try {
  fs.writeFileSync(registry, original.slice(0, markerIndex) + badRecord + "\n");
  fs.rmSync("dist", { recursive: true, force: true });
  fs.rmSync(".astro", { recursive: true, force: true });
  const build = spawnSync("npm", ["run", "build"], {
    encoding: "utf8", timeout: 180_000,
  });
  const output = (build.stdout || "") + "\n" + (build.stderr || "");
  assert.notEqual(build.status, 0, "Build must fail for a registered image that does not exist");
  assert.match(output, /missing source image.*ci-absent-source\.png/i,
    "The failure must specifically identify the missing source image, not another problem");
  console.log("PASS: an absent registered media image causes a genuine Astro production-build error");
} finally {
  fs.writeFileSync(registry, original);
}
console.log("PASS: original media registry restored byte-for-byte after negative build");
