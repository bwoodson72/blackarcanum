/**
 * Owner-reviewed media registry. Only explicitly selected artwork with
 * documented source and publication authorization is recorded.
 *
 * Register ONE ID per original image; reuse that ID on multiple articles.
 * Do not put Vercel URLs, remote hotlinks or author-identifying data here.
 */
export type MediaRole = "editorial" | "reference" | "decorative";
export type MediaOrigin = "historical-reproduction" | "modern-artwork";
export type MediaRightsStatus = "pending" | "cleared" | "restricted";
export type MediaRightsBasis = "public-domain" | "cc-license" | "permission" | "owned";

export interface MediaRights {
  /** 'cleared' alone never proves that reuse is permitted. */
  status: MediaRightsStatus;
  basis?: MediaRightsBasis;
  /** Specific license, release or reuse statement, not just 'free to use'. */
  license?: string;
  /** Credit to display when this image is published. */
  creditLine?: string;
  /** HTTP(S) link to the rights statement, permission or license evidence. */
  evidenceUrl?: string;
  /** Internal evidence context for rights owned directly by Mystagogia. */
  evidenceNote?: string;
}

export interface MediaRecord {
  /** Stable unique article-facing ID, using lowercase-kebab-case. */
  id: string;
  /** Actual version-controlled source for Astro's future image pipeline. */
  sourceFile: string;
  /** Optional non-public archival master, outside src/assets and public/. */
  originalFile?: string;
  role: MediaRole;
  origin: MediaOrigin;
  /**
   ¶»§q«^