import { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";
import type { Topic } from "../data/topics.ts";
import type { SourceRecord } from "../data/sources.ts";
import type { FeaturedContentRegistry } from "../data/features.ts";
import { validateTopicRegistry, validateSourceRegistry } from "./editorial-registry-validation.ts";

export type EditorialSection = "library" | "grimoire";

export interface EditorialRecord {
  id: string;
  collection: EditorialSection;
  data: {
    status: "draft" | "review" | "published";
    publishedAt?: Date;
    updatedAt?: Date;
    topics?: readonly string[];
    sourceIds?: readonly string[];
    citations?: readonly { sourceId: string }[];
    relatedIds?: readonly string[];
  };
}

export interface EditorialQaInput {
  entries: readonly EditorialRecord[];
  topics: readonly Topic[];
  sources: readonly SourceRecord[];
  features: FeaturedContentRegistry;
}

export interface ResolvedFeatureSections {
  homepageLibrary?: readonly EditorialRecord[];
  primaryGrimoire?: EditorialRecord;
  libraryHub?: readonly EditorialRecord[];
  grimoireHub?: readonly EditorialRecord[];
}

/**
 * Fail with stable, specific diagnostics for referential or date errors.
 * All articles are checked, including drafts, so stale IDs cannot lurk until
 * somebody switches their publication status.
 *
 * A published article must not link readers to unpublished related content.
 */
export function validateEditorialIntegrity(input: EditorialQaInput): void {
  validateTopicRegistry(input.topics);
  validateSourceRegistry(input.sources);

  const knownTopics = new Set(input.topics.map(({ id }) => id));
  const knownSources = new Set(input.sources.map(({ id }) => id));
  const allArticles = new Map<string, EditorialRecord>();
  const errors: string[] = [];

  for (const article of input.entries) {
    const ref = `${article.collection}:${article.id}`;
    if (!EDITORIAL_SLUG_PATTERN.test(article.id)) {
      errors.push(`${ref}: invalid article ID`);
    }
    if (allArticles.has(ref)) {
      errors.push(`${ref}: duplicate article ID`);
    } else {
      allArticles.set(ref, article);
    }
  }

  for (const article of input.entries) {
    const ref = `${article.collection}:${article.id}`;
    const { data } = article;
    const published = data.status === "published";

    if (published && !(data.publishedAt instanceof Date && !Number.isNaN(data.publishedAt.valueOf()))) {
      errors.push(`${ref}: published entry requires a valid publishedAt date`);
    }
    if (data.updatedAt !== undefined &&
        (!(data.updatedAt instanceof Date) || Number.isNaN(data.updatedAt.valueOf()))) {
      errors.push(`${ref}: invalid updatedAt date`);
    }
    if (data.publishedAt instanceof Date && data.updatedAt instanceof Date &&
        !Number.isNaN(data.publishedAt.valueOf()) && !Number.isNaN(data.updatedAt.valueOf()) &&
        data.updatedAt.valueOf() < data.publishedAt.valueOf()) {
      errors.push(`${ref}: updatedAt must not be earlier than publishedAt`);
    }

    for (const topicId of data.topics ?? []) {
      if (!knownTopics.has(topicId)) errors.push(`${ref}: unknown topic ID "${topicId}"`);
    }
    for (const sourceId of data.sourceIds ?? []) {
      if (!knownSources.has(sourceId)) errors.push(`${ref}: unknown source ID "${sourceId}"`);
    }
    for (const citation of data.citations ?? []) {
      if (!knownSources.has(citation.sourceId)) {
        errors.push(`${ref}: unknown citation source ID "${citation.sourceId}"`);
      }
    }

    for (const relatedId of data.relatedIds ?? []) {
      const target = allArticles.get(relatedId);
      if (!target) {
        errors.push(`${ref}: unknown related article "${relatedId}"`);
      } else if (relatedId === ref) {
        errors.push(`${ref}: article cannot be related to itself`);
      } else if (published && target.data.status !== "published") {
        errors.push(`${ref}: related article "${relatedId}" is not published`);
      }
    }
  }

  const checkSelections = (name: string, collection: EditorialSection, ids: readonly string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      const key = `${collection}:${id}`;
      if (!EDITORIAL_SLUG_PATTERN.test(id)) {
        errors.push(`${name}: invalid featured ID "${id}"`);
      }
      if (seen.has(id)) {
        errors.push(`${name}: duplicate featured ID "${id}"`);
      }
      seen.add(id);

      const article = allArticles.get(key);
      if (!article) {
        errors.push(`${name}: featured article "${key}" does not exist`);
      } else if (article.data.status !== "published" ||
          !(article.data.publishedAt instanceof Date) ||
          Number.isNaN(article.data.publishedAt.valueOf())) {
        errors.push(`${name}: featured article "${key}" is not published`);
      }
    }
  };

  checkSelections("homepageLibrary", "library", input.features.homepageLibrary);
  checkSelections("libraryHub", "library", input.features.libraryHub);
  checkSelections("grimoireHub", "grimoire", input.features.grimoireHub);
  if (input.features.primaryGrimoire !== null) {
    checkSelections("primaryGrimoire", "grimoire", [input.features.primaryGrimoire]);
  }

  if (errors.length > 0) {
    throw new Error("Editorial QA failed:\n" + errors.sort().map((error) => `- ${error}`).join("\n"));
  }
}

/**
 * Consumers render a section ONLY when its property exists. Empty feature
 * lists never cause fallback to new/latest content or placeholder cards.
 * Always run validateEditorialIntegrity first; resolution never masks errors.
 */
export function resolveFeatureSections(input: EditorialQaInput): ResolvedFeatureSections {
  validateEditorialIntegrity(input);

  const lookup = new Map(input.entries.map((entry) => [`${entry.collection}:${entry.id}`, entry]));
  const result: {
    homepageLibrary?: readonly EditorialRecord[];
    primaryGrimoire?: EditorialRecord;
    libraryHub?: readonly EditorialRecord[];
    grimoireHub?: readonly EditorialRecord[];
  } = {};

  if (input.features.homepageLibrary.length) {
    result.homepageLibrary = input.features.homepageLibrary.map((id) => lookup.get(`library:${id}`)!);
  }
  if (input.features.primaryGrimoire !== null) {
    result.primaryGrimoire = lookup.get(`grimoire:${input.features.primaryGrimoire}`)!;
  }
  if (input.features.libraryHub.length) {
    result.libraryHub = input.features.libraryHub.map((id) => lookup.get(`library:${id}`)!);
  }
  if (input.features.grimoireHub.length) {
    result.grimoireHub = input.features.grimoireHub.map((id) => lookup.get(`grimoire:${id}`)!);
  }
  return result;
}
