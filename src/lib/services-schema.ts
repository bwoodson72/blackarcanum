import { z } from "astro/zod";
import { SERVICE_SPHERE_IDS, approvedServiceMediaIds } from "../data/service-spheres.ts";
import { media } from "../data/media.ts";
import { mediaPublicationIssues } from "./media-registry.ts";

export const SERVICE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z.string().regex(SERVICE_SLUG_PATTERN, "Use one lowercase hyphen-separated slug segment.");
const text = z.string().trim().min(1);
const money = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);

export function createServiceSchema(approvedMediaIds: readonly string[] = approvedServiceMediaIds) {
  return z.object({
    slug,
    title: text,
    summary: text,
    sphere: z.enum(SERVICE_SPHERE_IDS),
    kind: z.enum(["reading", "spellwork"]),
    status: z.enum(["draft", "review", "published"]),
    /** Explicit owner sign-off; status alone must not publish an offering. */
    approved: z.boolean().default(false),
    priceUsdCents: money.optional(),
    availability: z.enum(["closed", "unavailable", "open"]).default("unavailable"),
    mediaId: slug.optional(),
    scope: text.optional(),
    inclusions: z.array(text).min(1).optional(),
    process: z.array(text).min(1).optional(),
    turnaround: text.optional(),
    clientRequirements: z.array(text).min(1).optional(),
    relatedIds: z.array(slug).default([]),
    seoSummary: text.optional(),
  }).superRefine((entry, ctx) => {
    if (entry.status === "published") {
      for (const field of ["priceUsdCents", "scope", "inclusions", "process", "turnaround", "clientRequirements"] as const) {
        if (entry[field] === undefined) ctx.addIssue({ code: "custom", path: [field], message: `${field} is required for publication.` });
      }
      if (!entry.approved) ctx.addIssue({ code: "custom", path: ["approved"], message: "Owner approval is required for publication." });
    }
    if (entry.mediaId) {
      const record = media.find(({ id }) => id === entry.mediaId);
      if (!record || !approvedMediaIds.includes(entry.mediaId) || mediaPublicationIssues(record).length) {
        ctx.addIssue({ code: "custom", path: ["mediaId"], message: "Media requires registry clearance and explicit Services approval." });
      }
    }
    if (new Set(entry.relatedIds).size !== entry.relatedIds.length || entry.relatedIds.includes(entry.slug)) {
      ctx.addIssue({ code: "custom", path: ["relatedIds"], message: "Related IDs must be unique and cannot reference this product." });
    }
  });
}

export const serviceSchema = createServiceSchema();
export type ServiceData = z.infer<typeof serviceSchema>;

/** Slugs are globally unique within Services, even across different spheres. */
export function createServiceIdGenerator() {
  const seen = new Map<string, string>();
  return ({ entry, data }: { entry: string; data: Record<string, unknown> }): string => {
    const value = data.slug;
    if (typeof value !== "string" || !SERVICE_SLUG_PATTERN.test(value)) {
      throw new Error(`[services] ${entry}: explicit valid frontmatter slug required.`);
    }
    const first = seen.get(value);
    if (first && first !== entry) throw new Error(`[services] duplicate slug "${value}" in "${first}" and "${entry}".`);
    // A file may change its slug during a development watch reload.
    for (const [id, file] of seen) if (file === entry && id !== value) seen.delete(id);
    seen.set(value, entry);
    return value;
  };
}
