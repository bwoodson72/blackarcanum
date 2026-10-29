// Regression checks for retained layout previews and approved Library articles.
// Run against the real (non-fixture) Astro build before CI swaps collections.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const expected = [
  {
    collection: "library",
    slug: "tyche-fortune-and-the-city",
    title: "Tyche: Fortune and the City",
  },
  {
    collection: "library",
    slug: "hekate-torches-and-crossroads",
    title: "Hekate: Torches and Crossroads",
  },
  {
    collection: "grimoire",
    slug: "hermes-petition-template",
    title: "Hermes: A Modern Petition Template",
  },
];

// Preview MDX is retained for visual/editorial QA, but not emitted as routes.
// Finished deity studies are distinct reviewed, published entries.
const finished = [{ collection: "library", slug: "hekate-crossroads-protection",
  title: "Hekate: The Ancient Greek Goddess of Crossroads, Protection, and Magic" },
  { collection: "library", slug: "hermes-trade-trickery-safe-passage",
    title: "Hermes: The Greek God of Trade, Trickery, and Safe Passage" },
  { collection: "library", slug: "tyche-goddess-fortune-prosperity-fate",
    title: "Tyche: The Greek Goddess of Fortune, Prosperity, and Fate" }];
for (const collection of ["library", "grimoire"]) {
  const files = fs.readdirSync(path.join("src/content", collection))
    .filter((name) => name.endsWith(".mdx"));
  const slugs = [...expected, ...finished].filter((entry) => entry.collection ¶»§q«^