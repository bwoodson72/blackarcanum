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

export const media: readonly MediaRecord[] = [
  {
    id: "tyche-fortune-city-illustration",
    sourceFile: "src/assets/media/editorial/greek-deities/tyche-fortune-and-city.webp",
    role: "editorial",
    origin: "modern-artwork",
    alt: "Modern artistic depiction of Tyche wearing a city-wall crown and holding a cornucopia above a sunlit ancient Greek harbor.",
    decorative: false,
    caption: "Modern AI-generated artistic interpretation of Tyche (2026); not an ancient artifact.",
    creator: "AI-generated illustration for Mystagogia",
    date: "2026-10-28",
    rights: {
      status: "cleared",
      basis: "owned",
      license: "Original AI-generated illustration created at the project owner's request for use on Mystagogia.",
      creditLine: "Mystagogia · AI-generated artistic interpretation (2026)",
      evidenceNote: "The owner approved this depiction in chat on 2026-10-28, requested its creation and then explicitly requested deployment. Generated with OpenAI image generation, gen_id f17d33ba-4cf9-4a6a-9483-55d5a8214e47. Source SHA-256: 4ab5a488f25818962e0894133d2e96435eecb506f7a05e56fad550b885743d0e.",
    },
  },
];
