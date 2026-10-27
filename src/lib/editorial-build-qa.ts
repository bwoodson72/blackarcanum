import { getCollection } from "astro:content";
import { topics } from "../data/topics";
import { sources } from "../data/sources";
import { featuredContent } from "../data/features";
import { validateEditorialIntegrity, resolveFeatureSections } from "./editorial-qa";

/**
 * Astro-only adapter. Call during static page generation to fail the build
 * before a broken reference or unapproved feature can be deployed.
 */
export async function checkEditorialBuild() {
  const [library, grimoire] = await Promise.all([
    getCollection("library"),
    getCollection("grimoire"),
  ]);
  const input = {
    entries: [
      ...library.map((entry) => ({ ...entry, collection: "library" as const })),
      ...grimoire.map((entry) => ({ ...entry, collection: "grimoire" as const })),
    ],
    topics,
    sources,
    features: featuredContent,
  };

  validateEditorialIntegrity(input);
  return resolveFeatureSections(input);
}
