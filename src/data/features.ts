/**
 * Explicit editorial picks only. The arrays are ordered: the first ID gets
 * the first slot. Never fill empty slots with "latest" articles.
 *
 * Add real, approved published article IDs only after editorial sign-off.
 */
export interface FeaturedContentRegistry {
  homepageLibrary: readonly string[];
  primaryGrimoire: string | null;
  libraryHub: readonly string[];
  grimoireHub: readonly string[];
}

export const featuredContent: FeaturedContentRegistry = {
  homepageLibrary: ["hekate-crossroads-protection", "hermes-trade-trickery-safe-passage"],
  primaryGrimoire: null,
  libraryHub: ["hekate-crossroads-protection", "hermes-trade-trickery-safe-passage"],
  grimoireHub: [],
};
