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
    alt: "Tyche wearing a city-wall crown and holding a cornucopia above a sunlit ancient Greek harbor.",
    decorative: false,
    creator: "AI-generated illustration for Mystagogia",
    date: "2026-10-28",
    rights: {
      status: "cleared",
      basis: "owned",
      license: "Original AI-generated illustration created at the project owner's request for use on Mystagogia.",
      creditLine: "Mystagogia",
      evidenceNote: "The owner approved this depiction in chat on 2026-10-28, requested its creation and then explicitly requested deployment. Generated with OpenAI image generation, gen_id f17d33ba-4cf9-4a6a-9483-55d5a8214e47. Source SHA-256: 4ab5a488f25818962e0894133d2e96435eecb506f7a05e56fad550b885743d0e.",
    },
  },
  {
    "id": "hekate-temple-gates-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/hekate-at-temple-gates.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Hekate holding two burning torches before the entrance to a Greek sanctuary at dusk.",
    "decorative": false,
    "creator": "AI-generated illustration for Mystagogia",
    "date": "2026-10-28",
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original AI-generated illustration created at the owner's request for use on Mystagogia.",
      "creditLine": "Mystagogia",
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
  },  {
    "id": "hermes-divine-traveler-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/hermes-divine-traveler.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Hermes walks along a rugged Greek road carrying a herald's staff, with a sunlit city and mountains in the distance.",
    "decorative": false,
    "creator": "Illustration for Mystagogia",
    "date": "2026-10-28",
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Illustration created at the project owner's request for Mystagogia.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Owner-approved generated hero, image generation ID c04ae5f7-01d7-4fcb-bcec-74da80d3cdab, prepared for self-hosting; local optimized asset SHA-256 a9ee0fdd829e2e59cc7911dad8c99f097110ea737cad82078741648c2a5ab56e."
    }
  },
  {
    "id": "hermes-herm-head-met",
    "sourceFile": "src/assets/media/reference/greek-deities/hermes-herm-head-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "A bearded Greek marble head from a herm, probably representing Hermes, against a neutral museum background.",
    "decorative": false,
    "caption": "Greek marble head from a herm, probably representing Hermes, late fifth century BCE. The Metropolitan Museum of Art, accession 59.11.24.",
    "date": "Probably late fifth century BCE",
    "period": "Classical Greek",
    "repository": "The Metropolitan Museum of Art",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/255016",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Public Domain / The Met Open Access (CC0); resized and converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Public Domain",
      "evidenceUrl": "https://www.metmuseum.org/hubs/open-access"
    }
  },
  {
    "id": "hermes-soul-guide-met",
    "sourceFile": "src/assets/media/reference/greek-deities/hermes-soul-guide-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Attic white-ground lekythos depicting Hermes guiding a deceased youth toward Charon's boat.",
    "decorative": false,
    "caption": "Hermes guides a deceased youth toward Charon's boat on an Attic white-ground lekythos, attributed to the Sabouroff Painter, ca. 450 BCE. The Metropolitan Museum of Art, accession 21.88.17.",
    "creator": "Attributed to the Sabouroff Painter",
    "date": "ca. 450 BCE",
    "period": "Greek, Attic, Classical",
    "repository": "The Metropolitan Museum of Art",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/251043",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Public Domain / The Met Open Access (CC0); resized and converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Public Domain",
      "evidenceUrl": "https://www.metmuseum.org/hubs/open-access"
    }
  },
  {
    id: "tyche-antioch-met",
    sourceFile: "src/assets/media/reference/greek-deities/tyche-antioch-met.webp",
    role: "reference",
    origin: "historical-reproduction",
    alt: "Roman bronze statuette of Tyche seated and wearing a mural crown, based on the Tyche of Antioch.",
    decorative: false,
    caption: "Bronze statuette of Tyche (Good Fortune), Roman, first century CE, based on the Hellenistic image of Antioch by Eutychides. The Metropolitan Museum of Art, accession 13.227.8.",
    date: "1st century CE",
    period: "Roman, Early Imperial",
    repository: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/248790",
    rights: {
      status: "cleared",
      basis: "public-domain",
      license: "Public Domain / The Met Open Access (CC0); resized and converted to WebP.",
      creditLine: "The Metropolitan Museum of Art · Public Domain",
      evidenceUrl: "https://www.metmuseum.org/art/collection/search/248790",
    },
  },
  {
    id: "tyche-ploutos-istanbul",
    sourceFile: "src/assets/media/reference/greek-deities/tyche-ploutos-istanbul.webp",
    role: "reference",
    origin: "historical-reproduction",
    alt: "Roman stone sculpture of Tyche wearing a mural crown and carrying the child Ploutos, god of wealth.",
    decorative: false,
    caption: "Tyche holding the child Ploutos, Roman period, second century CE. Istanbul Archaeological Museums. Photo by Incituna, 2 November 2022; resized and converted to WebP (CC BY-SA 4.0).",
    creator: "Incituna (Inci Tuna), photographer",
    date: "2022-11-02",
    period: "Roman, 2nd century CE",
    repository: "Istanbul Archaeological Museums; photograph via Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Goddess_Tyche,_Istanbul_Archaeology_Museum,_Turkey.jpg",
    rights: {
      status: "cleared",
      basis: "cc-license",
      license: "Creative Commons Attribution–ShareAlike 4.0 International (CC BY-SA 4.0); resized WebP adaptation remains CC BY-SA 4.0.",
      creditLine: "Photo: Incituna · CC BY-SA 4.0 · resized and converted to WebP",
      evidenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },

  {
    id: "ploutos-abundance-hero",
    sourceFile: "src/assets/media/editorial/greek-deities/ploutos-god-of-wealth.webp",
    role: "editorial",
    origin: "modern-artwork",
    alt: "Young Ploutos holds a cornucopia of fruits and grain overlooking an ancient Greek coastal landscape at sunset.",
    decorative: false,
    creator: "AI-generated illustration for Mystagogia",
    date: "2026-10-28",
    rights: {
      status: "cleared",
      basis: "owned",
      license: "Original AI-generated illustration created at the owner's request for Mystagogia.",
      creditLine: "Mystagogia",
      evidenceNote: "Owner-approved youthful Ploutos illustration, generated in ChatGPT, gen_id 1cb966e6-e4f8-4531-83f7-da598a011739; optimized to WebP for editorial use.",
    },
  },
  {
    id: "ploutos-eirene-munich",
    sourceFile: "src/assets/media/reference/greek-deities/ploutos-eirene-munich.webp",
    role: "reference",
    origin: "historical-reproduction",
    alt: "Roman marble copy of the statue of Eirene, the goddess of Peace, carrying the infant Ploutos.",
    decorative: false,
    caption: "Eirene holding the infant Ploutos. Roman marble copy after a Greek bronze by Kephisodotos the Elder, c. 370 BCE. Glyptothek, Munich, inventory 219. Photograph: Bibi Saint-Pol.",
    creator: "Bibi Saint-Pol (photographer)",
    date: "2007-02-08",
    period: "Roman copy after Greek original, c. 370 BCE",
    repository: "Glyptothek, Munich",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eirene_Ploutos_Glyptothek_Munich_219_n3.jpg",
    rights: {
      status: "cleared",
      basis: "public-domain",
      license: "Photograph released worldwide into the public domain by the photographer; resized and converted to WebP.",
      creditLine: "Photo: Bibi Saint-Pol · Public Domain",
      evidenceUrl: "https://commons.wikimedia.org/wiki/File:Eirene_Ploutos_Glyptothek_Munich_219_n3.jpg",
    },
  },
  {
    id: "ploutos-demeter-vase-athens",
    sourceFile: "src/assets/media/reference/greek-deities/ploutos-demeter-vase-athens.webp",
    role: "reference",
    origin: "historical-reproduction",
    alt: "Attic red-figure vase painting showing Ploutos holding a horn of plenty opposite Demeter with agricultural attributes.",
    decorative: false,
    caption: "Ploutos with cornucopia and Demeter with plough and sceptre. Attic red-figure pelike attributed to the Orestes Painter, c. 450–440 BCE. National Archaeological Museum, Athens, inventory 16346. Photograph: ArchaiOptix (CC BY-SA 4.0).",
    creator: "ArchaiOptix (photographer)",
    date: "2023-09-15",
    period: "Attic, Classical Greek, c. 450–440 BCE",
    repository: "National Archaeological Museum, Athens",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Orestes_Painter_-_ARV_1113_11_-_Ploutos_and_Demeter_-_draped_youths_-_Athens_NAM_16346_-_01.jpg",
    rights: {
      status: "cleared",
      basis: "cc-license",
      license: "Creative Commons Attribution–ShareAlike 4.0 International; resized WebP adaptation remains CC BY-SA 4.0.",
      creditLine: "Photo: ArchaiOptix · CC BY-SA 4.0 · resized and converted to WebP",
      evidenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      evidenceNote: "The Commons page advises contacting the museum regarding its own conditions for commercial photography; photograph is offered by its creator under CC BY-SA 4.0.",
    },
  },
  {
    "id": "demeter-wheat-torch-sunset-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/demeter-wheat-and-torch-at-sunset.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Demeter wearing a veil and draped Greek clothing, holding a burning torch and ripe wheat above cultivated fields at sunset.",
    "decorative": false,
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "AI-generated editorial artwork created for Mystagogia using the built-in image-generation capability; approved for local article incorporation by the owner.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Concept approved and generation requested in this chat on 2026-10-29; owner subsequently requested the article and images be placed in the local repository. Generated source: exec-e7062e9d-21a6-4c87-acce-8075f3fe4597.png. No third-party reference image was supplied to generation."
    }
  },
  {
    "id": "demeter-knidos-british-museum",
    "sourceFile": "src/assets/media/reference/greek-deities/demeter-knidos-british-museum.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Marble statue of a veiled Demeter seated on a throne, with draped clothing and missing lower arms, displayed in the British Museum.",
    "decorative": false,
    "caption": "Demeter of Knidos, c. 350–330 BCE. Marble statue from the sanctuary of Demeter at Knidos. British Museum, inventory 1859,1226.26. Photograph: Raymond Ellis, 2011; CC0. Resized and converted to WebP.",
    "creator": "Raymond Ellis (photographer)",
    "date": "2011-07-05",
    "period": "Greek, c. 350–330 BCE",
    "repository": "British Museum, inventory 1859,1226.26",
    "sourceUrl": "https://www.britishmuseum.org/collection/object/G_1859-1226-26",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "CC0 1.0 Universal Public Domain Dedication applied to this photograph by Raymond.ellis on Wikimedia Commons; resized and converted to WebP.",
      "creditLine": "Photo: Raymond Ellis · CC0 1.0",
      "evidenceUrl": "https://commons.wikimedia.org/wiki/File:Marble_Statue_of_Demeter.jpg"
    }
  },
  {
    "id": "demeter-eleusinian-relief-met",
    "sourceFile": "src/assets/media/reference/greek-deities/demeter-eleusinian-relief-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Eleusinian relief showing Demeter with a scepter on the left, a young figure generally identified as Triptolemos in the center, and Persephone on the right.",
    "decorative": false,
    "caption": "Demeter, Persephone, and a youth generally identified as Triptolemos. Ten Roman marble fragments of the Great Eleusinian Relief, c. 27 BCE–14 CE, embedded in a cast of the surviving Greek original. The Metropolitan Museum of Art, Rogers Fund, 1914, object 14.130.9. Open Access image; resized and converted to WebP.",
    "period": "Roman, c. 27 BCE–14 CE, after a fifth-century BCE Greek original",
    "repository": "The Metropolitan Museum of Art, object 14.130.9",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/248899",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "The object’s image is marked Public Domain by The Metropolitan Museum of Art and made available under its CC0 Open Access policy; resized and converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Rogers Fund, 1914 · Open Access (CC0)",
      "evidenceUrl": "https://www.metmuseum.org/policies/image-resources"
    }
  },
];
