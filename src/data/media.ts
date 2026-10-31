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
  {
    "id": "persephone-underworld-queen-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/persephone-enthroned-with-pomegranate-and-scepter.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Persephone seated on a stone throne in deep red Greek drapery, wearing a gold diadem and holding a pomegranate and scepter in a shadowed stone hall.",
    "decorative": false,
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original editorial illustration created at the project owner’s request for Mystagogia.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Owner approved the concept, requested built-in image generation, and authorized local incorporation on 2026-10-29. Generated source: exec-11e8b484-f05b-4ed5-aecb-8923c5f54be8.png. No third-party reference images were provided."
    }
  },
  {
    "id": "persephone-ascent-krater-met",
    "sourceFile": "src/assets/media/reference/greek-deities/persephone-ascent-krater-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Attic red-figure bell-krater showing Persephone rising from the earth beside Hermes, with torch-bearing Hekate and Demeter to the right.",
    "decorative": false,
    "caption": "Persephone rising from the underworld, accompanied by Hermes and Hekate, with Demeter at the right. Attic red-figure bell-krater attributed to the Persephone Painter, c. 440 BCE. The Metropolitan Museum of Art, Fletcher Fund, 1928, object 28.57.23. Open Access image; converted to WebP.",
    "creator": "Attributed to the Persephone Painter",
    "period": "Greek, Attic, c. 440 BCE",
    "repository": "The Metropolitan Museum of Art, object 28.57.23",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/252973",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "The image is marked Public Domain by The Metropolitan Museum of Art and made available under its CC0 Open Access policy; converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Fletcher Fund, 1928 · Open Access (CC0)",
      "evidenceUrl": "https://www.metmuseum.org/policies/image-resources"
    }
  },
  {
    "id": "persephone-bridal-bed-cleveland",
    "sourceFile": "src/assets/media/reference/greek-deities/persephone-bridal-bed-cleveland.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Fragmentary terracotta plaque showing Persephone arranging cloth on a bridal bed, with a rooster below the bed and a column behind her.",
    "decorative": false,
    "caption": "Votive Plaque (Pinax) with Persephone Making her Bridal Bed. Locri Epizephirii, South Italy, c. 490–450 BCE. Terracotta. Cleveland Museum of Art, Gift of Barbara S. Robinson and Family, accession 2023.103. Open Access image; resized and converted to WebP.",
    "period": "West Greek / South Italian, c. 490–450 BCE",
    "repository": "Cleveland Museum of Art, accession 2023.103",
    "sourceUrl": "https://www.clevelandart.org/art/2023.103",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Cleveland Museum of Art Open Access image, designated CC0 in the object metadata and available under the museum’s CC0 Open Access program; resized and converted to WebP.",
      "creditLine": "Cleveland Museum of Art · Gift of Barbara S. Robinson and Family · CC0",
      "evidenceUrl": "https://www.clevelandart.org/open-access",
      "evidenceNote": "Museum API object 394307, accession 2023.103, reports share_license_status: CC0."
    }
  },
  {
    id: "demeter-of-knidos-british-museum",
    sourceFile: "src/assets/media/reference/greek-deities/demeter-of-knidos-british-museum.webp",
    role: "reference",
    origin: "historical-reproduction",
    alt: "Marble statue of Demeter seated on a throne, excavated at Knidos and now in the British Museum.",
    decorative: false,
    caption: "Demeter of Knidos, seated marble statue from the Sanctuary of Demeter at Knidos, c. 350 BCE. British Museum, 1859,1226.26. Photograph: Raymond.ellis (CC0).",
    creator: "Raymond.ellis (photographer)",
    date: "2011-07-05",
    period: "Late Classical Greek, c. 350 BCE",
    repository: "British Museum; photograph via Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Marble_Statue_of_Demeter.jpg",
    rights: {
      status: "cleared",
      basis: "cc-license",
      license: "Creative Commons CC0 1.0 Universal Public Domain Dedication; resized and converted to WebP.",
      creditLine: "Photo: Raymond.ellis · CC0 1.0 · resized and converted to WebP",
      evidenceUrl: "https://commons.wikimedia.org/wiki/File:Marble_Statue_of_Demeter.jpg",
    },
  },
  {
    "id": "hades-enthroned-cerberus-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/hades-enthroned-with-scepter-and-cerberus.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Hades seated on a stone throne holding a gold scepter, with three-headed Cerberus beside him and a subterranean hall illuminated by warm golden light.",
    "decorative": false,
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original editorial illustration created at the project owner’s request for Mystagogia.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Owner approved concept and requested generation, then authorized local incorporation on 2026-10-29. Built-in image generation output exec-a66c8573-b12c-4cf0-b771-c22fbaca8d9c.png; no third-party reference images supplied."
    }
  },
  {
    "id": "hades-herakles-krater-met",
    "sourceFile": "src/assets/media/reference/greek-deities/hades-herakles-krater-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Attic red-figure calyx-krater with an upper frieze depicting Hades, Perithoos, Theseus, Herakles, and Hermes.",
    "decorative": false,
    "caption": "Herakles, Theseus, and Perithoos in Hades, depicted in the upper zone of an Attic red-figure calyx-krater, c. 450–440 BCE. Hades stands behind Perithoos. The Metropolitan Museum of Art, Rogers Fund, 1908, object 08.258.21. Open Access photograph; converted to WebP.",
    "creator": "Attributed to the Nekyia Painter",
    "period": "Greek, Attic, c. 450–440 BCE",
    "repository": "The Metropolitan Museum of Art, 08.258.21",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/248093",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Met Open Access photograph, marked Public Domain and provided under CC0; converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Rogers Fund, 1908 · CC0",
      "evidenceUrl": "https://www.metmuseum.org/policies/image-resources",
      "evidenceNote": "Object page marks the selected photograph Public Domain. Image endpoint: https://collectionapi.metmuseum.org/api/collection/v1/iiif/248093/544593/main-image"
    }
  },
  {
    "id": "hades-head-morgantina-getty",
    "sourceFile": "src/assets/media/reference/greek-deities/hades-head-morgantina-getty.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Terracotta head of Hades with thick curling hair and beard and surviving traces of colored pigment.",
    "decorative": false,
    "caption": "Terracotta head of Hades from Morgantina, Sicily, 400–300 BCE, with surviving traces of painted decoration. Former Getty inventory 85.AD.105, marked deaccessioned in the catalogue. Photograph published in Maria Lucia Ferruzza, Ancient Terracottas from South Italy and Sicily (2016), cat. 60; converted to WebP.",
    "period": "400–300 BCE",
    "repository": "Morgantina, Sicily; former Getty inventory 85.AD.105 (deaccessioned)",
    "sourceUrl": "https://www.getty.edu/publications/terracottas/catalogue/60/",
    "rights": {
      "status": "cleared",
      "basis": "cc-license",
      "license": "Getty Publications catalogue main photograph, made available for unrestricted use; catalogue licensed CC BY 4.0 except where otherwise noted. Converted to WebP.",
      "creditLine": "J. Paul Getty Museum / Getty Publications · CC BY 4.0",
      "evidenceUrl": "https://www.getty.edu/publications/terracottas/about/",
      "evidenceNote": "Downloaded cat60_85-AD-105.jpg from the official Catalogue Main Images archive; About page explicitly permits unrestricted use of these main photographs."
    }
  },
  {
    "id": "dionysus-ivy-thyrsus-panther-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/dionysus-with-ivy-thyrsus-and-panther.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Dionysus wearing an ivy wreath and wine-colored Greek drapery, holding a thyrsus and two-handled cup beside a resting panther among grapevines at sunset.",
    "decorative": false,
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original editorial illustration created at the project owner’s request for Mystagogia.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Owner approved concept, requested built-in image generation, and authorized local article incorporation on 2026-10-29. Generated source exec-77f2df5c-630f-4e5e-ac2a-1f6bca80ae44.png; no third-party reference images supplied."
    }
  },
  {
    "id": "dionysus-exekias-ship-cup",
    "sourceFile": "src/assets/media/reference/greek-deities/dionysus-exekias-ship-cup.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Interior of an Attic black-figure cup showing Dionysus reclining aboard a ship beneath a grapevine, surrounded by dolphins.",
    "decorative": false,
    "caption": "Dionysus aboard a ship surrounded by dolphins. Interior of an Attic black-figure kylix by Exekias, c. 530 BCE, found at Vulci. Staatliche Antikensammlungen, Munich, inventory 2044. Photograph by Bibi Saint-Pol, 2007; resized and converted to WebP.",
    "creator": "Exekias; photograph by Bibi Saint-Pol",
    "period": "Greek, Attic, c. 530 BCE",
    "repository": "Staatliche Antikensammlungen, Munich, inventory 2044",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Exekias_Dionysos_Staatliche_Antikensammlungen_2044_n2.jpg",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Photographer Bibi Saint-Pol released this photograph into the public domain worldwide; resized and converted to WebP.",
      "creditLine": "Photo: Bibi Saint-Pol · Public domain",
      "evidenceUrl": "https://commons.wikimedia.org/wiki/File:Exekias_Dionysos_Staatliche_Antikensammlungen_2044_n2.jpg"
    }
  },
  {
    "id": "dionysus-maenad-satyr-amphora-met",
    "sourceFile": "src/assets/media/reference/greek-deities/dionysus-maenad-satyr-amphora-met.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Attic black-figure neck-amphora with Dionysus, a maenad, and a satyr depicted between a pair of large painted eyes on its shoulder.",
    "decorative": false,
    "caption": "Dionysus with a maenad and satyr, painted between eyes on the shoulder of an Attic black-figure neck-amphora, last quarter of the sixth century BCE. The Metropolitan Museum of Art, Fletcher Fund, 1926, object 26.60.19. Open Access photograph; converted to WebP.",
    "period": "Greek, Attic, last quarter of the sixth century BCE",
    "repository": "The Metropolitan Museum of Art, 26.60.19",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/252486",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "The selected photograph is marked Public Domain and provided under the Met’s CC0 Open Access policy; converted to WebP.",
      "creditLine": "The Metropolitan Museum of Art · Fletcher Fund, 1926 · CC0",
      "evidenceUrl": "https://www.metmuseum.org/policies/image-resources",
      "evidenceNote": "Image endpoint: https://collectionapi.metmuseum.org/api/collection/v1/iiif/252486/534551/main-image"
    }
  },
  {
    "id": "asclepius-serpent-staff-sanctuary-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/asclepius-with-serpent-staff-and-dog.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Asclepius in ivory Greek drapery holding a wooden staff entwined by one serpent, with a dog resting beside him in a sunlit sanctuary colonnade.",
    "decorative": false,
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original editorial illustration created at the project owner’s request for Mystagogia.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Owner approved concept, requested built-in image generation, and authorized local incorporation on 2026-10-29. Generated source exec-15177e34-8390-4763-928e-b50a9c9f98bf.png; no third-party reference images supplied."
    }
  },
  {
    "id": "asclepius-epidaurus-abaton",
    "sourceFile": "src/assets/media/reference/greek-deities/asclepius-epidaurus-abaton.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Remains and reconstructed columns of the abaton at the sanctuary of Asclepius at Epidaurus.",
    "decorative": false,
    "caption": "The abaton at Epidaurus, the sanctuary building associated with sacred sleep. This modern photograph shows the archaeological remains and reconstructed colonnade. Photograph by Rabe!, 5 May 2011; resized and converted to WebP.",
    "creator": "Rabe! (photographer)",
    "date": "2011-05-05",
    "repository": "Sanctuary of Asclepius, Epidaurus, Greece",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Epidauros_-_Abaton.jpg",
    "rights": {
      "status": "cleared",
      "basis": "cc-license",
      "license": "Creative Commons Attribution-ShareAlike 3.0 Unported (https://creativecommons.org/licenses/by-sa/3.0/). Resized and converted to WebP; this derivative is distributed under the same license.",
      "creditLine": "Photo: Rabe! · CC BY-SA 3.0 · resized and converted to WebP",
      "evidenceUrl": "https://commons.wikimedia.org/wiki/File:Epidauros_-_Abaton.jpg"
    }
  },
  {
    "id": "asclepius-tyche-votive-leg",
    "sourceFile": "src/assets/media/reference/greek-deities/asclepius-tyche-votive-leg.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Marble relief of a left leg beside a Greek inscription dedicating a thank-offering from Tyche to Asclepius and Hygieia.",
    "decorative": false,
    "caption": "Marble anatomical votive dedicated by Tyche to Asclepius and Hygieia as a thank-offering, probably for recovery from an affliction of the left leg. From Melos, 100–200 CE. British Museum, 1867,0508.117. Photograph by Marie-Lan Nguyen, 2006; resized and converted to WebP.",
    "creator": "Marie-Lan Nguyen (photographer)",
    "date": "2006-11-22",
    "period": "Greek, Roman Imperial, 100–200 CE",
    "repository": "British Museum, 1867,0508.117",
    "sourceUrl": "https://www.britishmuseum.org/collection/object/G_1867-0508-117",
    "rights": {
      "status": "cleared",
      "basis": "public-domain",
      "license": "Photographer Marie-Lan Nguyen released this photograph into the public domain worldwide; resized and converted to WebP.",
      "creditLine": "Photo: Marie-Lan Nguyen · Public domain",
      "evidenceUrl": "https://commons.wikimedia.org/wiki/File:Votive_relief_Asklepios_BM809.jpg"
    }
  },
  {
    "id": "apollo-laurel-lyre-bow-hero",
    "sourceFile": "src/assets/media/editorial/greek-deities/apollo-with-laurel-lyre-and-bow.webp",
    "role": "editorial",
    "origin": "modern-artwork",
    "alt": "Dark-haired Apollo with a laurel wreath and ivory Greek drapery holds a lyre on a mountain sanctuary terrace, with bow and quiver beside him.",
    "decorative": false,
    "rights": {
      "status": "cleared",
      "basis": "owned",
      "license": "Original editorial illustration created at the project owner’s request for Mystagogia.",
      "creditLine": "Mystagogia",
      "evidenceNote": "Owner approved concept, requested built-in generation and a revision to dark brown hair and warmer olive complexion, then authorized local incorporation on 2026-10-29. Approved revised output exec-f6b5a930-0299-49a2-a939-a57916563986.png, edited from original project-generated exec-b6a8ae2f-b30c-4b3c-99e2-e0004f015a82.png."
    }
  },
  {
    "id": "apollo-temple-delphi",
    "sourceFile": "src/assets/media/reference/greek-deities/apollo-temple-delphi.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "Surviving foundations and standing columns of the Temple of Apollo at Delphi beneath steep mountain cliffs.",
    "decorative": false,
    "caption": "The archaeological remains of the Temple of Apollo at Delphi, beneath the cliffs of Mount Parnassus. Modern photograph by Luarvick; resized and converted to WebP.",
    "creator": "Luarvick (photographer)",
    "repository": "Sanctuary of Apollo, Delphi, Greece",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Temple_of_Apollo_at_Delphi.jpg",
    "rights": {
      "status": "cleared",
      "basis": "cc-license",
      "license": "Creative Commons Attribution-ShareAlike 3.0 Unported (https://creativecommons.org/licenses/by-sa/3.0/). Resized and converted to WebP; this derivative is distributed under the same license.",
      "creditLine": "Photo: Luarvick · CC BY-SA 3.0 · resized and converted to WebP",
      "evidenceUrl": "https://commons.wikimedia.org/wiki/File:The_Temple_of_Apollo_at_Delphi.jpg"
    }
  },
  {
    "id": "apollo-lyre-libation-cup",
    "sourceFile": "src/assets/media/reference/greek-deities/apollo-lyre-libation-cup.webp",
    "role": "reference",
    "origin": "historical-reproduction",
    "alt": "White-ground cup interior showing laurel-crowned Apollo seated with a lyre, pouring a libation from a shallow bowl, with a black bird opposite him.",
    "decorative": false,
    "caption": "Apollo holding a lyre and pouring a libation, accompanied by a black bird. Attic white-ground kylix, c. 470 BCE according to the museum catalogue. Archaeological Museum of Delphi, inventory 8140. Photograph by Fingalo, 2007; resized and converted to WebP.",
    "creator": "Fingalo (photographer)",
    "date": "2007-06-19",
    "period": "Greek, Attic, c. 470 BCE",
    "repository": "Archaeological Museum of Delphi, inventory 8140",
    "sourceUrl": "https://delphi.culture.gr/lefkh-kilika-2/",
    "rights": {
      "status": "cleared",
      "basis": "cc-license",
      "license": "Creative Commons Attribution-ShareAlike 2.0 Germany (https://creativecommons.org/licenses/by-sa/2.0/de/). Resized and converted to WebP; this derivative is distributed under the same license.",
      "creditLine": "Photo: Fingalo · CC BY-SA 2.0 DE · resized and converted to WebP",
      "evidenceUrl": "https://commons.wikimedia.org/wiki/File:Apollo_black_bird_AM_Delphi_8140.jpg",
      "evidenceNote": "Object date follows museum catalogue (c. 470 BCE); Commons description supplies an alternative date around 460 BCE and uncertain painter attributions, which are not asserted here."
    }
  },
];
