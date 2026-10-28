import { z } from "astro/zod";
import { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";
import { citationSchema } from "./editorial-citations.ts";
import { topics } from "../data/topics.ts";
import { sources } from "../data/sources.ts";
import type { Topic } from "../data/topics.ts";
import type { SourceRecord } from "../data/sources.ts";
import {
  validateTopicRegistry,
  validateSourceRegistry,
} from "./editorial-registry-validation.ts";

export { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";

/**
 * Public URL slugs are deliberate single-path segments, never derived
 * implicitly from a filename, and cannot contain spaces, slashes, or capitals.
 */
const slug = z.string().regex(
  EDITORIAL_SLUG_PATTERN,
  "Use a lowercase, hyphen-separated URL slug (one segment).",
);

const sharedFields = z.object({
  /** Stable public ID. Astro's glob loader uses this slug as entry.id. */
  slug,
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  status: z.enum(["draft", "review", "published"]),
  /** Explicitly approved public design sample: visible in archives, noindex. */
  preview: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  hero: z.object({
    src: z.string().trim().min(1),
    alt: z.string().trim().min(1),
  }).optional(),
  /** References ONLY to the owner-approved topic registry. */
  topics: z.array(slug).optional(),
  /** A related article's collection and stable ID, e.g. library:article-slug. */
  relatedIds: z.array(z.string().regex(/^(library|grimoire):[a-z0-9]+(?:-[a-z0-9]+)*$/)).optional(),
  /** Bibliographic IDs and individual citations refer to the SAME source registry. */
  sourceIds: z.array(slug).optional(),
  citations: z.array(citationSchema).optional(),
});

export interface EditorialRegistries {
  topics?: readonly Topic[];
  sources?: readonly SourceRecord[];
}

/**
 * Validate registries at collection load, then validate every incoming MDX
 * article's topic/source references. Fixture injection exists for tests only;
 * live collections use the immutable version-controlled registry exports.
 */
export function createEditorialSchema(registries: EditorialRegistries = {}) {
  const approvedTopics = registries.topics ?? topics;
  const approvedSources = registries.sources ?? sources;

  validateTopicRegistry(approvedTopics);
  validateSourceRegistry(approvedSources);

  const knownTopics = new Set(approvedTopics.map(({ id }) => id));
  const knownSources = new Set(approvedSources.map(({ id }) => id));

  return sharedFields.superRefine((entry, ctx) => {
    if (entry.status === "published" && !entry.publishedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "publishedAt is required when status is published.",
      });
    }

    for (const [index, topicId] of (entry.topics ?? []).entries()) {
      if (!knownTopics.has(topicId)) {
        ctx.addIssue({
          code: "custom",
          path: ["topics", index],
          message: `Unknown topic ID "${topicId}". Approve it in src/data/topics.ts first.`,
        });
      }
    }

    for (const [index, sourceId] of (entry.sourceIds ?? []).entries()) {
      if (!knownSources.has(sourceId)) {
        ctx.addIssue({
          code: "custom",
          path: ["sourceIds", index],
          message: `Unknown source ID "${sourceId}". Approve it in src/data/sources.ts first.`,
        });
      }
    }

    for (const [index, citation] of (entry.citations ?? []).entries()) {
      if (!knownSources.has(citation.sourceId)) {
        ctx.addIssue({
          code: "custom",
          path: ["citations", index, "sourceId"],
          message: `Unknown citation source ID "${citation.sourceId}". Approve it first.`,
        });
      }
    }
  });
}

/** Both editorial collections use exactly these approved empty registries. */
export const editorialSchema = createEditorialSchema();

/**
 * Enforce explicit, unique slugs per collection *before* Astro inserts an
 * entry into its content store (which otherwise keys entries by their ID).
 * A repeated load of the SAME file is permitted in watch mode.
 */
export function createEditorialIdGenerator(collection: "library" | "grimoire") {
  const seen = new Map<string, string>();

  return ({ entry, data }: { entry: string; data: Record<string, unknown> }): string => {
    const value = data.slug;
    if (typeof value !== "string" || !EDITORIAL_SLUG_PATTERN.test(value)) {
      throw new Error(
        `[${collection}] ${entry}: an explicit, valid frontmatter slug is required.`,
      );
    }

    const first = seen.get(value);
    if (first && first !== entry) {
      throw new Error(
        `[${collection}] duplicate slug "${value}" in "${first}" and "${entry}".`,
      );
    }
    seen.set(value, entry);
    return value;
  };
}
