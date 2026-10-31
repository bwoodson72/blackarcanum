/** Minimal teaser contract only; full practitioner content belongs to SF-07. */
export interface PractitionerTeaser {
  approved: boolean;
  published: boolean;
  excerpt: string;
}

/** No default biography or inferred identity. The caller must supply a real,
 * approved profile whose route exists before enabling its teaser. */
export function approvedPractitionerTeaser(teaser?: PractitionerTeaser) {
  if (!teaser?.approved || !teaser.published || !teaser.excerpt.trim()) return undefined;
  return { excerpt: teaser.excerpt.trim(), href: "/services/practitioner/" as const };
}
