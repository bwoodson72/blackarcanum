import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { createEditorialIdGenerator, editorialSchema } from "./lib/editorial-schema";

/**
 * Intentionally MDX only. Both folders start empty; adding a file does not
 * publish a public route. Publication also requires explicit editorial review.
 */
const library = defineCollection({
  loader: glob({
    base: "./src/content/library",
    pattern: "**/*.mdx",
    generateId: createEditorialIdGenerator("library"),
  }),
  schema: editorialSchema,
});

const grimoire = defineCollection({
  loader: glob({
    base: "./src/content/grimoire",
    pattern: "**/*.mdx",
    generateId: createEditorialIdGenerator("grimoire"),
  }),
  schema: editorialSchema,
});

export const collections = { library, grimoire };
