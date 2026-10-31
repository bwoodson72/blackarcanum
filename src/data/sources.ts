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
  {
    "id": "callimachus-hymn-demeter",
    "title": "Hymn 6: To Demeter",
    "creator": "Callimachus",
    "translator": "A. W. Mair",
    "period": "Third century BCE",
    "stableUrl": "https://www.theoi.com/Text/CallimachusHymns2.html",
    "kind": "primary"
  },
  {
    "id": "karoglou-mystery-cults",
    "title": "Mystery Cults in the Greek and Roman World",
    "creator": "Kiki Karoglou",
    "publisher": "The Metropolitan Museum of Art, Heilbrunn Timeline of Art History",
    "period": "2013",
    "stableUrl": "https://www.metmuseum.org/essays/mystery-cults-in-the-greek-and-roman-world",
    "kind": "scholarly"
  },
  {
    "id": "oxford-thesmophoria",
    "title": "Thesmophoria",
    "creator": "Nils Martin Persson Nilsson, Michael H. Jameson, and Kevin Clinton",
    "publisher": "Oxford Classical Dictionary",
    "stableUrl": "https://doi.org/10.1093/acrefore/9780199381135.013.6391",
    "kind": "scholarly"
  },
  {
    "id": "eleusis-first-fruits-decree",
    "title": "On the first-fruits at Eleusis (I Eleusis 28a)",
    "translator": "Stephen Lambert and Robin Osborne",
    "period": "Fifth century BCE; conventionally c. 435 BCE, date uncertain",
    "archive": "Attic Inscriptions Online",
    "stableUrl": "https://www.atticinscriptions.com/inscription/IEleus/28a",
    "kind": "primary"
  },
  {
    "id": "piraeus-thesmophorion-decree",
    "title": "Decree of deme Piraeus concerning the Thesmophorion (IG II² 1177)",
    "period": "Mid-fourth century BCE",
    "archive": "Attic Inscriptions Online",
    "stableUrl": "https://www.atticinscriptions.com/inscription/IGII2/1177",
    "kind": "primary"
  },
  {
    "id": "met-eleusinian-relief",
    "title": "Ten marble fragments of the Great Eleusinian Relief, object 14.130.9",
    "archive": "The Metropolitan Museum of Art",
    "period": "Roman, c. 27 BCE–14 CE",
    "stableUrl": "https://www.metmuseum.org/art/collection/search/248899",
    "kind": "scholarly"
  },
  {
    "id": "oxford-persephone-kore",
    "title": "Persephone/Kore",
    "creator": "Ana Isabel Jiménez San Cristóbal",
    "publisher": "Oxford Classical Dictionary, Oxford University Press",
    "edition": "Updated 30 July 2020; first published 7 March 2016",
    "stableUrl": "https://doi.org/10.1093/acrefore/9780199381135.013.4880",
    "kind": "scholarly"
  },
  {
    "id": "diodorus-siculus-book-four",
    "title": "Library of History, Book 4",
    "creator": "Diodorus Siculus",
    "period": "First century BCE",
    "kind": "primary"
  },
  {
    "id": "cleveland-persephone-bridal-bed",
    "title": "Votive Plaque (Pinax) with Persephone Making her Bridal Bed, 2023.103",
    "archive": "Cleveland Museum of Art",
    "period": "c. 490–450 BCE",
    "stableUrl": "https://www.clevelandart.org/art/2023.103",
    "kind": "scholarly"
  },
  {
    "id": "sourvinou-inwood-persephone-aphrodite-locri",
    "title": "Persephone and Aphrodite at Locri: A Model for Personality Definitions in Greek Religion",
    "creator": "Christiane Sourvinou-Inwood",
    "publisher": "The Journal of Hellenic Studies 98 (1978), 101–121",
    "stableUrl": "https://www.cambridge.org/core/journals/journal-of-hellenic-studies/article/abs/persephone-and-aphrodite-at-locri-a-model-for-personality-definitions-in-greek-religion/A3BC291B9BF958E1DC3B10455E3B6585",
    "kind": "scholarly"
  },
  {
    "id": "eisenfeld-lokrian-goddess",
    "title": "Life, Death, and a Lokrian Goddess: Revisiting the Nature of Persephone in the Gold Leaves of Magna Graecia",
    "creator": "Hanne Eisenfeld",
    "publisher": "Kernos 29 (2016), 41–72",
    "stableUrl": "https://journals.openedition.org/kernos/2388",
    "kind": "scholarly"
  },
  {
    "id": "clinton-myth-and-cult",
    "title": "Myth and Cult: The Iconography of the Eleusinian Mysteries",
    "creator": "Kevin Clinton",
    "publisher": "Swedish Institute at Athens, 1992",
    "stableUrl": "https://ecsi.se/actaath-8-11/",
    "kind": "scholarly"
  },
  {
    "id": "cosmopoulos-bronze-age-eleusis",
    "title": "Bronze Age Eleusis and the Origins of the Eleusinian Mysteries",
    "creator": "Michael B. Cosmopoulos",
    "publisher": "Cambridge University Press, 2015",
    "kind": "scholarly"
  },
  {
    "id": "graf-johnston-ritual-texts-afterlife",
    "title": "Ritual Texts for the Afterlife: Orpheus and the Bacchic Gold Tablets",
    "creator": "Fritz Graf and Sarah Iles Johnston",
    "edition": "Second edition",
    "publisher": "Routledge, 2013",
    "stableUrl": "https://www.routledge.com/Ritual-Texts-for-the-Afterlife-Orpheus-and-the-Bacchic-Gold-Tablets-2nd/Graf-Johnston/p/book/9780203564240",
    "kind": "scholarly"
  },
  {
    "id": "edmonds-myths-underworld-journey",
    "title": "Myths of the Underworld Journey: Plato, Aristophanes, and the Orphic Gold Tablets",
    "creator": "Radcliffe G. Edmonds III",
    "publisher": "Cambridge University Press, 2004",
    "kind": "scholarly"
  },
  {
    "id": "bernabe-jimenez-instructions-netherworld",
    "title": "Instructions for the Netherworld: The Orphic Gold Tablets",
    "creator": "Alberto Bernabé and Ana Isabel Jiménez San Cristóbal",
    "publisher": "Brill, 2008",
    "kind": "scholarly"
  },
  {
    "id": "plato-meno",
    "title": "Meno",
    "creator": "Plato",
    "period": "Fourth century BCE",
    "kind": "primary"
  },
  {
    "id": "burkert-greek-religion",
    "title": "Greek Religion: Archaic and Classical",
    "creator": "Walter Burkert",
    "translator": "John Raffan",
    "publisher": "Harvard University Press, 1985",
    "kind": "scholarly"
  },
  {
    "id": "cicero-against-verres",
    "title": "Against Verres",
    "creator": "Cicero",
    "period": "70 BCE",
    "kind": "primary"
  },
  {
    "id": "met-persephone-ascent-krater",
    "title": "Terracotta bell-krater attributed to the Persephone Painter, object 28.57.23",
    "archive": "The Metropolitan Museum of Art",
    "period": "c. 440 BCE",
    "stableUrl": "https://www.metmuseum.org/art/collection/search/252973",
    "kind": "scholarly"
  },
  {
    id: "foley-homeric-hymn-demeter",
    title: "The Homeric Hymn to Demeter: Translation, Commentary, and Interpretive Essays",
    creator: "Helene P. Foley",
    publisher: "Princeton University Press, 1994",
    stableUrl: "https://www.jstor.org/stable/j.ctt3fgxdk",
    kind: "scholarly",
  },
  {
    id: "eleusinian-first-fruits-decree",
    title: "On the First-Fruits at Eleusis (IEleus 28a)",
    period: "Fifth century BCE",
    archive: "Attic Inscriptions Online",
    stableUrl: "https://www.atticinscriptions.com/inscription/IEleus/28a",
    kind: "primary",
  },
  {
    id: "oxford-classical-dictionary-thesmophoria",
    title: "Thesmophoria",
    archive: "Oxford Classical Dictionary",
    stableUrl: "https://academic.oup.com/edited-volume/61673/chapter-abstract/548213840",
    kind: "scholarly",
  },
  {
    id: "hamburg-miletus-demeter",
    title: "Temple of Demeter",
    creator: "Sandra Golling",
    archive: "University of Hamburg, Miletus Excavation",
    stableUrl: "https://www.miletgrabung.uni-hamburg.de/en/milet-tour/tour-humeitepe/demetertempel.html",
    kind: "scholarly",
  },
  {
    "id": "sekita-hades-heracles-pylos",
    "title": "Hades and Heracles at Pylos: Dione’s Tale Dismantled",
    "creator": "Karolina Sekita",
    "publisher": "The Classical Quarterly 68.1 (2018): 1–9",
    "stableUrl": "https://doi.org/10.1017/S0009838818000216",
    "kind": "scholarly"
  },
  {
    "id": "virgil-georgics",
    "title": "Georgics",
    "creator": "Virgil",
    "kind": "primary"
  },
  {
    "id": "ovid-metamorphoses",
    "title": "Metamorphoses",
    "creator": "Ovid",
    "kind": "primary"
  },
  {
    "id": "plato-cratylus",
    "title": "Cratylus",
    "creator": "Plato",
    "kind": "primary"
  },
  {
    "id": "oxford-hades",
    "title": "Hades",
    "creator": "Ellie Mackin Roberts",
    "publisher": "Oxford Classical Dictionary, Oxford University Press, 2023",
    "stableUrl": "https://doi.org/10.1093/acrefore/9780199381135.013.ORE_CLA-08995.R1",
    "kind": "scholarly"
  },
  {
    "id": "burton-worshipping-hades",
    "title": "Worshipping Hades: Myth and Cult in Elis and Triphylia",
    "creator": "Diana Burton",
    "publisher": "Archiv für Religionsgeschichte 20.1 (2018): 211–227",
    "stableUrl": "https://doi.org/10.1515/arege-2018-0013",
    "kind": "scholarly"
  },
  {
    "id": "getty-underworld-exhibition",
    "title": "Underworld: Imagining the Afterlife",
    "archive": "J. Paul Getty Museum",
    "stableUrl": "https://www.getty.edu/art/exhibitions/ancient_underworld/inner.html",
    "kind": "scholarly"
  },
  {
    "id": "getty-head-hades",
    "title": "Head of Hades, catalogue 60, Ancient Terracottas from South Italy and Sicily",
    "creator": "Maria Lucia Ferruzza",
    "publisher": "Getty Publications, 2016",
    "stableUrl": "https://www.getty.edu/publications/terracottas/catalogue/60/",
    "kind": "scholarly"
  },
  {
    "id": "euripides-bacchae",
    "title": "Bacchae",
    "creator": "Euripides",
    "period": "First performed 405 BCE",
    "kind": "primary"
  },
  {
    "id": "homeric-hymn-seven-dionysus",
    "title": "Homeric Hymn 7 to Dionysus",
    "kind": "primary"
  },
  {
    "id": "bernabe-dionysos-mycenaean-world",
    "title": "Dionysos in the Mycenaean World",
    "creator": "Alberto Bernabé",
    "publisher": "In Redefining Dionysos, De Gruyter, 2013, pp. 23–37",
    "stableUrl": "https://doi.org/10.1515/9783110301328.23",
    "kind": "scholarly"
  },
  {
    "id": "bremmer-maenads",
    "title": "Maenads",
    "creator": "Jan N. Bremmer",
    "publisher": "Oxford Classical Dictionary, Oxford University Press, 2016",
    "stableUrl": "https://academic.oup.com/edited-volume/61673/chapter-abstract/549652240",
    "kind": "scholarly"
  },
  {
    "id": "dodds-maenadism-bacchae",
    "title": "Maenadism in the Bacchae",
    "creator": "E. R. Dodds",
    "publisher": "Harvard Theological Review 33 (1940): 155–176",
    "stableUrl": "https://www.cambridge.org/core/journals/harvard-theological-review/article/abs/maenadism-in-the-bacchae/D8D3C87CB63128C1AE28856EF55B268B",
    "kind": "scholarly"
  },
  {
    "id": "magnesia-dionysian-associations",
    "title": "I.Magnesia 215: foundation tradition of Dionysian associations at Magnesia",
    "archive": "Inventory of Ancient Associations, University of Copenhagen",
    "stableUrl": "https://ancientassociations.ku.dk/assoc/viewing.php?id=1401&view=resultassoc",
    "kind": "primary"
  },
  {
    "id": "kraemer-womens-religions",
    "title": "Women’s Religions in the Greco-Roman World: A Sourcebook",
    "creator": "Ross Shepard Kraemer (editor)",
    "publisher": "Oxford University Press, 2004",
    "kind": "scholarly"
  },
  {
    "id": "parker-anthesteria",
    "title": "Anthesteria",
    "creator": "Robert Parker",
    "publisher": "Oxford Classical Dictionary, Oxford University Press, 2015",
    "kind": "scholarly"
  },
  {
    "id": "parker-polytheism-athens",
    "title": "Polytheism and Society at Athens",
    "creator": "Robert Parker",
    "publisher": "Oxford University Press, 2005",
    "stableUrl": "https://academic.oup.com/book/11496",
    "kind": "scholarly"
  },
  {
    "id": "edmonds-orphic-gold-tablets",
    "title": "The “Orphic” Gold Tablets and Greek Religion: Further Along the Path",
    "creator": "Radcliffe G. Edmonds III (editor)",
    "publisher": "Cambridge University Press, 2011",
    "kind": "scholarly"
  },
  {
    "id": "heraclitus-fragments",
    "title": "Fragments",
    "creator": "Heraclitus",
    "kind": "primary"
  },
  {
    "id": "edmonds-tearing-zagreus",
    "title": "Tearing Apart the Zagreus Myth: A Few Disparaging Remarks on Orphism and Original Sin",
    "creator": "Radcliffe G. Edmonds III",
    "publisher": "Classical Antiquity 18.1 (1999): 35–73",
    "stableUrl": "https://doi.org/10.2307/25011092",
    "kind": "scholarly"
  },
  {
    "id": "bernabe-redefining-dionysos",
    "title": "Redefining Dionysos",
    "creator": "Alberto Bernabé, Miguel Herrero de Jáuregui, Ana Isabel Jiménez San Cristóbal, and Raquel Martín Hernández (editors)",
    "publisher": "De Gruyter, 2013",
    "kind": "scholarly"
  },
  {
    "id": "carpenter-dionysian-imagery",
    "title": "Dionysian Imagery in Fifth-Century Athens",
    "creator": "Thomas H. Carpenter",
    "publisher": "Oxford University Press, 1997",
    "kind": "scholarly"
  },
  {
    "id": "edmonds-redefining-orphism",
    "title": "Redefining Ancient Orphism: A Study in Greek Religion",
    "creator": "Radcliffe G. Edmonds III",
    "publisher": "Cambridge University Press, 2013",
    "kind": "scholarly"
  },
  {
    "id": "seaford-dionysos",
    "title": "Dionysos",
    "creator": "Richard Seaford",
    "publisher": "Routledge, 2006",
    "kind": "scholarly"
  },
  {
    "id": "epidaurian-healing-inscriptions",
    "title": "Epidaurian healing inscriptions (iamata), IG IV² 1.121–124",
    "period": "Fourth century BCE",
    "kind": "primary"
  },
  {
    "id": "lidonnici-epidaurian-miracles",
    "title": "The Epidaurian Miracle Inscriptions: Text, Translation, and Commentary",
    "creator": "Lynn R. LiDonnici",
    "publisher": "Scholars Press, 1995",
    "kind": "scholarly"
  },
  {
    "id": "dillon-didactic-iamata",
    "title": "The Didactic Nature of the Epidaurian Iamata",
    "creator": "Michael P. J. Dillon",
    "publisher": "Zeitschrift für Papyrologie und Epigraphik 101 (1994): 239–260",
    "stableUrl": "https://www.uni-koeln.de/phil-fak/ifa/zpe/downloads/1994/101pdf/101239.pdf",
    "kind": "scholarly"
  },
  {
    "id": "graf-incubation",
    "title": "Incubation",
    "creator": "Fritz Graf",
    "publisher": "Oxford Classical Dictionary",
    "stableUrl": "https://doi.org/10.1093/acrefore/9780199381135.013.3275",
    "kind": "scholarly"
  },
  {
    "id": "pindar-pythian-three",
    "title": "Pythian Ode 3",
    "creator": "Pindar",
    "kind": "primary"
  },
  {
    "id": "telemachos-asklepieion-monument",
    "title": "Monument of Telemachos, founder of the Asklepieion (IG II³ 4.665)",
    "archive": "PHI Greek Inscriptions",
    "stableUrl": "https://inscriptions.packhum.org/text/360195",
    "kind": "primary"
  },
  {
    "id": "livy-periochae",
    "title": "Periochae",
    "creator": "Livy",
    "kind": "primary"
  },
  {
    "id": "hippocratic-oath",
    "title": "Hippocratic Oath",
    "kind": "primary"
  },
  {
    "id": "aristides-sacred-tales",
    "title": "Sacred Tales (Hieroi Logoi)",
    "creator": "Aelius Aristides",
    "kind": "primary"
  },
  {
    "id": "israelowich-sacred-tales",
    "title": "Society, Medicine and Religion in the Sacred Tales of Aelius Aristides",
    "creator": "Ido Israelowich",
    "publisher": "Brill, 2012",
    "kind": "scholarly"
  },
  {
    "id": "british-museum-tyche-votive-leg",
    "title": "Marble anatomical votive relief dedicated by Tyche to Asclepius and Hygieia, 1867,0508.117",
    "archive": "British Museum",
    "stableUrl": "https://www.britishmuseum.org/collection/object/G_1867-0508-117",
    "kind": "scholarly"
  },
  {
    "id": "plato-phaedo",
    "title": "Phaedo",
    "creator": "Plato",
    "kind": "primary"
  },
  {
    "id": "edelsteins-asclepius-testimonies",
    "title": "Asclepius: Collection and Interpretation of the Testimonies",
    "creator": "Emma J. Edelstein and Ludwig Edelstein",
    "publisher": "Johns Hopkins University Press, 1945",
    "kind": "scholarly"
  },
  {
    "id": "nutton-ancient-medicine",
    "title": "Ancient Medicine",
    "creator": "Vivian Nutton",
    "edition": "Second edition",
    "publisher": "Routledge, 2013",
    "kind": "scholarly"
  },
  {
    "id": "wickkiser-asklepios-medicine-politics",
    "title": "Asklepios, Medicine, and the Politics of Healing in Fifth-Century Greece: Between Craft and Cult",
    "creator": "Bronwen L. Wickkiser",
    "publisher": "Johns Hopkins University Press, 2008",
    "kind": "scholarly"
  },
  {
    "id": "athenian-sacred-orgas-decree",
    "title": "Decree of Athens concerning the boundaries of the sacred Orgas (IG II³ 1.292 / IG II² 204)",
    "archive": "PHI Greek Inscriptions",
    "period": "352/351 BCE",
    "stableUrl": "https://inscriptions.packhum.org/text/347149",
    "kind": "primary"
  },
  {
    "id": "scott-delphi-history",
    "title": "Delphi: A History of the Center of the Ancient World",
    "creator": "Michael Scott",
    "publisher": "Princeton University Press, 2014",
    "kind": "scholarly"
  },
  {
    "id": "unesco-delphi",
    "title": "Archaeological Site of Delphi",
    "archive": "UNESCO World Heritage Centre",
    "stableUrl": "https://whc.unesco.org/en/list/393/",
    "kind": "scholarly"
  },
  {
    "id": "homeric-hymn-apollo",
    "title": "Homeric Hymn to Apollo",
    "kind": "primary"
  },
  {
    "id": "aeschylus-eumenides",
    "title": "Eumenides",
    "creator": "Aeschylus",
    "kind": "primary"
  },
  {
    "id": "plutarch-pythian-oracles",
    "title": "On the Oracles of the Pythia (De Pythiae Oraculis)",
    "creator": "Plutarch",
    "kind": "primary"
  },
  {
    "id": "plutarch-obsolescence-oracles",
    "title": "On the Obsolescence of Oracles (De Defectu Oraculorum)",
    "creator": "Plutarch",
    "kind": "primary"
  },
  {
    "id": "herodotus-histories",
    "title": "Histories",
    "creator": "Herodotus",
    "kind": "primary"
  },
  {
    "id": "delphi-hymns-apollo",
    "title": "The hymns to Apollo",
    "archive": "Ephorate of Antiquities of Phocis, Archaeological Site of Delphi",
    "stableUrl": "https://delphi.culture.gr/the-hymns-to-apollo-and-the-white-kylix/",
    "kind": "scholarly"
  },
  {
    "id": "bilic-apollo-sun",
    "title": "Early Identifications of Apollo with the Physical Sun in Ancient Greece: Tradition and Interpretation",
    "creator": "Tomislav Bilić",
    "publisher": "Mnemosyne 74.5 (2021)",
    "kind": "scholarly"
  },
  {
    "id": "bowden-athens-delphic-oracle",
    "title": "Classical Athens and the Delphic Oracle: Divination and Democracy",
    "creator": "Hugh Bowden",
    "publisher": "Cambridge University Press, 2005",
    "kind": "scholarly"
  },
  {
    "id": "fontenrose-delphic-oracle",
    "title": "The Delphic Oracle: Its Responses and Operations with a Catalogue of Responses",
    "creator": "Joseph Fontenrose",
    "publisher": "University of California Press, 1978",
    "kind": "scholarly"
  },
  {
    "id": "johnston-ancient-greek-divination",
    "title": "Ancient Greek Divination",
    "creator": "Sarah Iles Johnston",
    "publisher": "Wiley-Blackwell, 2008",
    "kind": "scholarly"
  },
  {
    "id": "kindt-revisiting-delphi",
    "title": "Revisiting Delphi: Religion and Storytelling in Ancient Greece",
    "creator": "Julia Kindt",
    "publisher": "Cambridge University Press, 2016",
    "kind": "scholarly"
  },
];
