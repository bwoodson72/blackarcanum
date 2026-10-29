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
  },  {
    "id": "homeric-hymn-hermes",
    "title": "Homeric Hymn to Hermes",
    "period": "Archaic Greek poetry",
    "stableUrl": "https://www.theoi.com/Text/HomericHymns2.html",
    "kind": "primary"
  },
  {
    "id": "hesiod-works-days",
    "title": "Works and Days",
    "creator": "Hesiod",
    "period": "Archaic Greek poetry",
    "stableUrl": "https://www.theoi.com/Text/HesiodWorksDays.html",
    "kind": "primary"
  },
  {
    "id": "homer-iliad",
    "title": "Iliad",
    "creator": "Homer",
    "period": "Archaic Greek epic",
    "kind": "primary"
  },
  {
    "id": "homer-odyssey",
    "title": "Odyssey",
    "creator": "Homer",
    "period": "Archaic Greek epic",
    "stableUrl": "https://www.theoi.com/Text/HomerOdyssey10.html",
    "kind": "primary"
  },
  {
    "id": "homeric-hymn-pan",
    "title": "Homeric Hymn to Pan",
    "period": "Greek hymn tradition",
    "stableUrl": "https://www.theoi.com/Text/HomericHymns3.html",
    "kind": "primary"
  },
  {
    "id": "apollodorus-library",
    "title": "Bibliotheca (Library)",
    "creator": "Pseudo-Apollodorus",
    "period": "Ancient Greek mythography",
    "kind": "primary"
  },
  {
    "id": "thucydides-peloponnesian-war",
    "title": "History of the Peloponnesian War",
    "creator": "Thucydides",
    "period": "Fifth century BCE",
    "kind": "primary"
  },
  {
    "id": "attic-inscription-igi3-776",
    "title": "Dedication to Hermes by a herald (IG I³ 776)",
    "period": "Early fifth century BCE",
    "archive": "Attic Inscriptions Online",
    "stableUrl": "https://www.atticinscriptions.com/inscription/IGI3/776",
    "kind": "primary"
  },
  {
    "id": "adak-klazomenai-hermes",
    "title": "Zwei Weihungen aus Klazomenai",
    "creator": "Mustafa Adak",
    "publisher": "Philia, 2015",
    "kind": "scholarly"
  },
  {
    "id": "pgm-vii-hermes-thoth",
    "title": "Greek Magical Papyri VII.664–685: Dream request to Hermes-Thoth",
    "period": "Roman Egyptian ritual tradition",
    "kind": "primary"
  },
  {
    "id": "vergados-homeric-hymn-hermes",
    "title": "The Homeric Hymn to Hermes: Introduction, Text and Commentary",
    "creator": "Athanassios Vergados",
    "publisher": "De Gruyter, 2013",
    "kind": "scholarly"
  },
  {
    "id": "miller-clay-tracking-hermes",
    "title": "Tracking Hermes, Pursuing Mercury",
    "creator": "John F. Miller and Jenny Strauss Clay (editors)",
    "publisher": "Oxford University Press, 2019",
    "stableUrl": "https://academic.oup.com/book/7176",
    "kind": "scholarly"
  },
  {
    "id": "fowden-egyptian-hermes",
    "title": "The Egyptian Hermes: A Historical Approach to the Late Pagan Mind",
    "creator": "Garth Fowden",
    "publisher": "Cambridge University Press, 1986",
    "kind": "scholarly"
  },
  {
    "id": "bull-tradition-hermes-trismegistus",
    "title": "The Tradition of Hermes Trismegistus",
    "creator": "Christian H. Bull",
    "publisher": "Brill, 2018",
    "kind": "scholarly"
  },
  {
    id: "pindar-olympian-12",
    title: "Olympian Ode 12",
    creator: "Pindar",
    period: "c. 472 BCE",
    kind: "primary",
  },
  {
    id: "menander-aspis",
    title: "Aspis (The Shield)",
    creator: "Menander",
    period: "Late fourth to early third century BCE",
    kind: "primary",
  },
  {
    id: "attic-inscription-agathe-tyche",
    title: "Dedication to Zeus Epiteleios Philios, Philia, and Agathe Tyche (IG II² 4627)",
    period: "Fourth century BCE",
    kind: "primary",
  },
  {
    id: "orphic-hymn-tyche",
    title: "Orphic Hymn 72 to Tyche",
    period: "Roman imperial period",
    stableUrl: "https://www.theoi.com/Text/OrphicHymns2.html",
    kind: "primary",
  },
  {
    id: "mikalson-hellenistic-athens",
    title: "Religion in Hellenistic Athens",
    creator: "Jon D. Mikalson",
    publisher: "University of California Press, 1998",
    kind: "scholarly",
  },
  {
    id: "pirenne-delforge-tyche",
    title: "Tychè en famille: généalogies et profil divin",
    creator: "Vinciane Pirenne-Delforge",
    publisher: "Kernos 37 (2024), 9–31",
    kind: "scholarly",
  },
  {
    id: "maillard-attributes-tyche",
    title: "Aux origines des attributs de Tychè",
    creator: "Pauline Maillard",
    publisher: "Kernos 37 (2024), 33–50",
    kind: "scholarly",
  },
  {
    id: "pollitt-hellenistic-art",
    title: "Art in the Hellenistic Age",
    creator: "J. J. Pollitt",
    publisher: "Cambridge University Press, 1986",
    kind: "scholarly",
  },
  {
    id: "miano-fortuna",
    title: "Fortuna: Deity and Concept in Archaic and Republican Italy",
    creator: "Daniele Miano",
    publisher: "Oxford University Press, 2018",
    stableUrl: "https://academic.oup.com/book/5742",
    kind: "scholarly",
  },

  {
    id: "diodorus-siculus-book-five",
    title: "Library of History, Book 5",
    creator: "Diodorus Siculus",
    period: "First century BCE",
    stableUrl: "https://www.theoi.com/Text/DiodorusSiculus5C.html",
    kind: "primary",
  },
  {
    id: "philostratus-imagines",
    title: "Imagines, Book 2",
    creator: "Philostratus the Elder",
    period: "Third century CE",
    stableUrl: "https://www.theoi.com/Text/PhilostratusElder2B.html",
    kind: "primary",
  },
  {
    id: "bowie-aristophanes",
    title: "Aristophanes: Myth, Ritual and Comedy",
    creator: "Angus M. Bowie",
    publisher: "Cambridge University Press, 1993",
    kind: "scholarly",
  },
  {
    id: "oxford-classical-dictionary-ploutos",
    title: "Ploutos",
    publisher: "Oxford Classical Dictionary, Oxford University Press",
    stableUrl: "https://academic.oup.com/edited-volume/61673/chapter-abstract/549703726",
    kind: "scholarly",
  },
];
