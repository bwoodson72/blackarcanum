import { getCollection } from "astro:content";
import { topics } from "../data/topics";
import { sources } from "../data/sources";
import { media } from "../data/media";
import { mediaAssetFiles } from "./media-asset-inventory";
import { validateMediaRegistry } from "./media-registry";
import { featuredContent } from "../data/features";
import { resolveFeatureSections } from "./editorial-qa";

/**
 * Astro-only adapter. Call during static page generation to fail the build
 * before a broken reference or unapproved feature can be deployed.
 */
export async function checkEditorialBuild() {
  // The build must not succeed if the registry points at a missing file.
  // Archival masters are checked separately by the Node filesystem test.
  validateMediaRegistry(media, { files: mediaAssetFiles });
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
    media,
    features: featuredContent,
  };

  // Resolution validates all relationships and feature picks before returning.
  return resolveFeatureSections(input);
}
