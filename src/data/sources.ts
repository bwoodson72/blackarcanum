/**
 * Bibliographic registry of real, reviewed sources. Do not create fictional
 * works or infer authorship, dates, link stability, or usage rights.
 */
export interface SourceRecord {
  id: string;
  title: string;
  /** Omit rather than invent a creator for anonymous/unknown works. */
  creator?: string;
  edition?: string;
  translator?: string;
  period?: string;
  publisher?: string;
  archive?: string;
  /** Stable publicly accessible HTTP(S) catalog/DOI/archive link if known. */
  stableUrl?: string;
  /** Rights/license/reuse context, when independently established. */
  rights?: string;
  /** Identifies what kind of evidence is being referenced, when known. */
  kind?: "primary" | "scholarly" | "practitioner";
}

export const sources: readonly SourceRecord[] = [
  {
    "id": "hesiod-theogony",
    "title": "Theogony",
    "creator": "Hesiod",
    "period": "Archaic Greek poetry",
    "stableUrl": "https://chs.harvard.edu/primary-source/hesiod-theogony-sb/",
    "kind": "primary"
  },
  {
    "id": "homeric-hymn-demeter",
    "title": "Homeric Hymn to Demeter",
    "period": "Archaic Greek poetry",
    "stableUrl": "https://chs.harvard.edu/primary-source/homeric-hymn-to-demeter-sb/",
    "kind": "primary"
  },
  {
    "id": "pausanias-description-greece",
    "title": "Description of Greece",
    "creator": "Pausanias",
    "period": "Second century CE",
    "stableUrl": "https://www.theoi.com/Text/Pausanias2B.html",
    "kind": "primary"
  },
  {
    "id": "aristophanes-wealth",
    "title": "Wealth (Plutus)",
    "creator": "Aristophanes",
    "period": "388 BCE",
    "stableUrl": "https://classics.mit.edu/Aristophanes/plutus.html",
    "kind": "primary"
  },
  {
    "id": "euripides-medea",
    "title": "Medea",
    "creator": "Euripides",
    "period": "431 BCE",
    "stableUrl": "https://chs.harvard.edu/primary-source/euripides-medea/",
    "kind": "primary"
  },
  {
    "id": "theocritus-idyll-two",
    "title": "Idyll 2 (The Sorceress)",
    "creator": "Theocritus",
    "period": "Third century BCE",
    "stableUrl": "https://www.theoi.com/Text/TheocritusIdylls1.html",
    "kind": "primary"
  },
  {
    "id": "pgm-iv",
    "title": "Greek Magical Papyri, PGM IV.2714–2783",
    "period": "Fourth-century CE manuscript",
    "archive": "See Magical Hymns from Roman Egypt (Cambridge University Press)",
    "stableUrl": "https://www.cambridge.org/core/books/abs/magical-hymns-from-roman-egypt/hymn-to-hecateselenepersephoneartemis-iv-271483-fourth-century/9A0F53A8305D38B7BD41FE9838459718",
    "kind": "primary"
  },
  {
    "id": "orphic-hymns",
    "title": "Orphic Hymns, Hymn 1 to Hekate",
    "period": "Roman imperial period",
    "stableUrl": "https://www.theoi.com/Text/OrphicHymns1.html",
    "kind": "primary"
  },
  {
    "id": "herring-lagina-2022",
    "title": "Hekate of Lagina: A Goddess Performing Her Civic Duty",
    "creator": "Amanda Herring",
    "publisher": "Anatolian Studies 72 (2022), 141–165",
    "stableUrl": "https://doi.org/10.1017/S0066154622000072",
    "kind": "scholarly"
  },
  {
    "id": "herring-lagina-2020",
    "title": "Reconstructing the Sacred Experience at the Sanctuary of Hekate at Lagina",
    "creator": "Amanda Herring",
    "publisher": "Journal of the Society of Architectural Historians 79, no. 3 (2020), 247–263",
    "stableUrl": "https://online.ucpress.edu/jsah/article-abstract/79/3/247/111804/Reconstructing-the-Sacred-Experience-at-the",
    "kind": "scholarly"
  },
  {
    "id": "johnston-restless-dead",
    "title": "Restless Dead: Encounters Between the Living and the Dead in Ancient Greece",
    "creator": "Sarah Iles Johnston",
    "publisher": "University of California Press, 1999",
    "stableUrl": "https://doi.org/10.1525/california/9780520217072.003.0006",
    "kind": "scholarly"
  },
  {
    "id": "johnston-hekate-soteira",
    "title": "Hekate Soteira: A Study of Hekate's Roles in the Chaldean Oracles and Related Literature",
    "creator": "Sarah Iles Johnston",
    "publisher": "Scholars Press, 1990",
    "kind": "scholarly"
  },
  {
    "id": "clay-hesiods-cosmos",
    "title": "Hesiod's Cosmos",
    "creator": "Jenny Strauss Clay",
    "publisher": "Cambridge University Press, 2003",
    "kind": "scholarly"
  },
];
