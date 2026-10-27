import { z } from "astro/zod";
import { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";

/**
 * Locators are deliberately strings: real editions use Roman numerals, ranges,
 * folio recto/verso, named passages, or nonnumeric section identifiers.
 */
const locationText = z.string().trim().min(1);

export const citationLocatorSchema = z.object({
  page: locationText.optional(),
  passage: locationText.optional(),
  section: locationText.optional(),
  folio: locationText.optional(),
}).refine((value) => Object.values(value).some((part) => part !== undefined), {
  message: "Provide at least one page, passage, section, or folio locator.",
});

export const citationSchema = z.object({
  sourceId: z.string().regex(EDITORIAL_SLUG_PATTERN),
  locator: citationLocatorSchema.optional(),
  /** Editorial note about why/how this source is used, if needed. */
  note: locationText.optional(),
});

export type Citation = z.infer<typeof citationSchema>;
export type CitationLocator = z.infer<typeof citationLocatorSchema>;
