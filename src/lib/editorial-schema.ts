import { z } from "astro/zod";

/**
 * Public URL slugs are deliberate, lowercase, single-path segments. No slash,
 * percent encoding, whitespace or accidental filename-derived public paths.
 */
export const EDITORIAL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  hero: z.object({
    src: z.string().trim().min(1),
    alt: z.string().trim().min(1),
  }).optional(),
  /** Controlled registry and referential validation arrive in Prompt 10. */
  topics: z.array(slug).optional(),
  /** A related article's collection and stable ID, e.g. library:article-slug. */
  relatedIds: z.array(z.string().regex(/^(library|grimoire):[a-z0-9]+(?:-[a-z0-9]+)*$/)).optional(),
  sourceIds: z.array(slug).optional(),
});

/**
 * The single schema for both editorial collections. Draft and review entries
 * need no publication date, but a published entry MUST have one.
 */
export const editorialSchema = sharedFields.superRefine((entry, ctx) => {
  if (entry.status === "published" && !entry.publishedAt) {
    ctx.addIssue({
      code: "custom",
      path: ["publishedAt"],
      message: "publishedAt is required when status is published.",
    });
  }
});

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
