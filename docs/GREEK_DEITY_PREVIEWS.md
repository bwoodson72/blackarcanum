# Mystagogia — Three Greek Deity Layout Previews

**Owner authorization:** October 28, 2026. These are *publicly viewable placeholders*, not completed research or documented personal ritual experiences. They exist to make the Library, Grimoire, article reading shell, automatic TOC, and navigation reviewable before formal publication.

## The three temporary articles

| Section | Page | Editorial purpose |
| --- | --- | --- |
| Library | `/library/tyche-fortune-and-the-city/` | Tyche's civic imagery, chance, and symbolism; demonstrates source-led prose and nested headings. |
| Library | `/library/hekate-torches-and-crossroads/` | Hekate's early literary roles and later crossroads imagery; demonstrates editorial distinctions by time and medium. |
| Grimoire | `/grimoire/hermes-petition-template/` | Original, clearly untested illustrative petition template for Hermes; demonstrates steps, a short address, and reflection prompts without inventing first-person experiences. |

The first two link to verified external reading (the Archaeological Museum of Thessaloniki, Theoi's ancient-text collections); the Hermes example links to a published collection of Greek myth and Homeric Hymn excerpts. These are **inline reading links**, not a substitute for Prompt 17's structured citation and bibliography system. There is no claim that the modern Hermes template is a historically transmitted rite.

## Publishing and SEO safeguards

Each `.mdx` file has:

- `status: published` **only so the templates render and the archive cards link**;
- `preview: true`, a separate schema field propagated through the editorial view model;
- visible **"Layout preview"** labels on its article page and archive card;
- `noindex, nofollow` on its individual article page;
- no invented author byline or unapproved topic taxonomy;
- one **explicitly approved Tyche featured illustration**, with a reviewed media-registry ID and visible modern-artwork caption; Hekate and Hermes remain text-only.

While an archive contains **only preview entries**, its index is also `noindex`. Once real editorial work is published alongside previews, the archive can be indexed, while sample articles stay `noindex`. Content is not included in curated home features because the registry remains owner-controlled and empty.

The existing Library and Grimoire routes were already implemented; their navigation entries are now enabled, with Shop/Search/Subscribe still hidden. The homepage remains the truthful, `noindex` development shell.

## Removing or promoting previews later

**To remove them:** delete the three specific MDX files. The regular empty state will return automatically when each section has no published entries. Remove or adapt `scripts/test-sample-articles.mjs` and its `qa:content` invocation as part of that editorial change.

**To replace with finished articles:** rewrite the content with verified sources and any required bibliography, obtain editorial sign-off, and remove the `preview: true` flag. Doing so removes the special preview label and per-article `noindex`; do not remove it merely to make placeholders appear in search.

The CSS, public article routes, and automatic heading metadata remain shared. On October 28, 2026, the owner approved generating and deploying a modern depiction of Tyche; it is registered as `tyche-fortune-city-illustration` and appears as the Tyche article hero and Library thumbnail. This is **not** a photograph of an ancient artifact. The other two preview pages still have no featured artwork. No fabricated practitioner identity is introduced.

## Acceptance

`npm run qa:content` runs the permanent content/schema and presentation tests, the normal production Astro build, and `npm run test:samples` to verify that exactly three authorized previews exist, both archives link to them, the routes render a proper title and generated table of contents, and the pages and preview-only archives remain unindexed. Existing isolated historical CI fixture builds do not mutate committed content.

This is an explicitly authorized demonstration-content addition, **not execution of the next numbered implementation prompt (Prompt 17)**.
