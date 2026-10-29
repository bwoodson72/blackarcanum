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
  {
    "id": "hekate-temple-gates-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/hekate-at-temple-gates.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Modern illustration of Hekate holding two burning torches before the entrance to a Greek sanctuary at dusk.",
    "decorative": false,
    "caption": "Modern AI-generated artistic interpretation of Hekate; not an ancient depiction.",
    "creator": "AI-generated illustration for Mystagogia",
    "date": "2026-10-28",
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original AI-generated illustration created at the owner's request for use on Mystagogia.",
      "creditLine": "Mystagogia · AI-generated illustration (2026)",
      "evidenceNote": "Approved in conversation on 2026-10-28. Generated image gen_id df543202-704d-4d9e-a5ae-27057c6cf5b8; locally optimized for editorial use."
    }
  },
  {
    "id": "hekate-triple-bodied-met",
    "sourceFile": "src/assets/media/reference/greek-deities/hekate-triple-bodied-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Roman marble statuette showing a triple-bodied Hekate and the Three Graces, photographed against a gray background.",
    "decorative": false,
    "caption": "Roman marble hekataion depicting triple-bodied Hekate and the Three Graces, 1st–2nd century CE. The Metropolitan Museum of Art, accession 1987.11.2.",
    "date": "1st–2nd century CE",
    "period": "Roman, Late Hellenistic style",
    "repository": "The Metropolitan Museum of Art",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/255881",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Public Domain / The Met Open Access (CC0); image resized and converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Public Domain",
      "evidenceUrl": "https://www.metmuseum.org/art/collection/search/255881"
    }
  },
  {
    "id": "hekate-lagina-temple",
    "sourceFile": "src/assets/media/reference/greek-deities/hekate-lagina-temple.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Archaeological remains of the Temple of Hekate at Lagina, with low stone foundations, standing columns, and mountains behind.",
    "decorative": false,
    "caption": "Remains of the Temple of Hekate at Lagina, Caria, photographed on 7 April 2015. Resized and converted to WebP for this article; adaptation remains under CC BY-SA 2.0.",
    "creator": "Carole Raddato",
    "date": "2015-04-07",
    "repository": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Corinthian_Temple_of_Hecate,_its_architectural_type_was_pseudodipteral_with_pronaos,_Sanctuary_of_Hecate_in_Lagina,_dated_to_the_last_quarter_of_the_2nd_century_BC,_Caria,_Turkey_(17103394970).jpg",
    "rights": {
      "status": "cleared",
      "basis": "cc-license",
      "license": "Creative Commons Attribution-ShareAlike 2.0 Generic (CC BY-SA 2.0); resized WebP adaptation is also CC BY-SA 2.0.",
      "creditLine": "Photo: Carole Raddato · CC BY-SA 2.0 · resized and converted to WebP",
      "evidenceUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
    }
  },
];
