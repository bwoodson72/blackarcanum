/**
 * Owner-reviewed media registry. Empty until an image and its reproduction
 * rights have actually been researched and approved.
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
   * The actual image meaning, not a description of the surrounding article.
   * Decorative images must have empty alt and decorative=true.
   */
  alt: string;
  decorative: boolean;
  /** Human-reviewed caption for figures; required for reference imagery. */
  caption?: string;
  /** Only metadata independently established about this exact image/work. */
  creator?: string;
  date?: string;
  period?: string;
  repository?: string;
  /** Museum/catalog/source record for the image, not necessarily rights proof. */
  sourceUrl?: string;
  rights: MediaRights;
}

export const media: readonly MediaRecord[] = [];
