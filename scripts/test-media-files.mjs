// Run against the actual repository tree before the Astro production build.
// Do not emit or modify image files; validate only media metadata and paths.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { media } from "../src/data/media.ts";
import { validateMediaRegistry } from "../src/lib/media-registry.ts";

const root = process.cwd();
function listFiles(directory) {
  const result = [];
  const parent = path.join(root, directory);
  if (!fs.existsSync(parent)) return result;
  function visit(relative) {
    for (const name of fs.readdirSync(path.join(root, relative))) {
      const item = path.join(relative, name);
      const stat = fs.lstatSync(path.join(root, item));
      assert.equal(stat.isSymbolicLink(), false, "Media source must not be a symbolic link: " + item);
      if (stat.isDirectory()) visit(item);
      else if (stat.isFile() && !name.startsWith(".")) result.push(item.split(path.sep).join("/"));
    }
  }
  visit(directory);
  return result.sort();
}

const files = listFiles("src/assets/media").filter((file) => !file.endsWith("/README.md"));
const originals = listFiles("media-originals").filter((file) => !file.endsWith("/README.md"));
validateMediaRegistry(media, { files, originals });

const registered = new Set(media.map((item) => item.sourceFile));
for (const file of files) {
  assert.ok(registered.has(file), "Media asset is not in the registry: " + file);
}
assert.equal(new Set(media.map((item) => item.id)).size, media.length);
console.log("PASS: source images exist, declared masters exist, no unregistered media files or symlink escapes; " +
  media.length + " approved media records and " + files.length + " sources");
