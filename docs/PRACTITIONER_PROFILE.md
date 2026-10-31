# Practitioner profile — SF-07

## Empty real source and review boundary

src/data/practitioner.ts is explicitly null: no résumé, biography, name, credential, initiation, affiliation, publication or photograph has been supplied or approved. Do not populate it from test fixtures or infer facts from the site's subjects. Real verified material and release approval are still required before any public profile can exist.

The schema is Services-specific typed content, separate from editorial collections. It supports a summary, biography paragraphs, practice-history timeline, disciplines/traditions, training/initiations, kinds of work, selected work/writings and approach/ethics. Arrays may be empty; no missing section forces invented content. No identity field or automatic pseudonym exists. Legal identity must not be inserted into public paragraphs either.

Each fact/timeline row has explicit approved and verified flags, defaulting to false. Published profiles require overall approval plus at least an approved, verified summary and biography. Draft/review sources can remain incomplete. Verification flags record reviewed owner-supplied facts, not independent certification by Mystagogia. Private verificationNote fields may hold provenance/review context, but are stripped before public props are created. Unknown fields are rejected to avoid silently introducing identity/credential metadata.

## Shared publication gate and layout

selectPublishedPractitioner validates the source and returns only approved, verified public text. Unapproved/unverified optional facts are omitted, and notes/approval flags never enter the normalized public view. The selector preserves owner-specified order and does not invent dates, chronology or qualifications.

getPublishedPractitioner is the single gate used by the profile route, ServicesHub and ServiceDetail. It requires a published/approved source, explicit Services release approval, and actual hub/profile route modules. Since SF-08 it also awaits the shared hub live state, so a present-but-unemitted hub module cannot expose a profile or link. The real source is null, release approval remains false and the catalog is empty, so the profile and all profile links stay off.

The canonical /services/practitioner/ route uses practitioner/[...page].astro: getStaticPaths emits only its index path when ready, otherwise no path. It does not publish an empty résumé or allow arbitrary extra profile paths. The page reuses BaseLayout, typed Services breadcrumbs, text-only PageHero, Container and existing action controls. It has one H1, a readable biography and optional reusable timeline/fact sections. Empty sections and headings are absent. There is no credential badge, testimonial, Person schema, photograph, intake or booking interaction.

The hub's provisional SF-03 teaser-prop contract has been replaced by this shared approved profile source. The detail page conditionally adds the same real profile link. No caller-provided excerpt can bypass the source/claim/release/route gates. src/lib/services-hub.ts is removed; its former minimal teaser tests are superseded by the full profile suite.

## Checks

The practitioner schema/selector suite is part of qa:units/qa:fast. It checks null/draft/review states, required published approvals, per-fact verification, route/release closure, identity-field rejection, omission of private notes/unapproved claims, and empty optional sections.

`npm run test:practitioner` uses the existing isolated-source/CDP harness and actual hub, sphere, detail and profile routes. All biography/résumé strings are explicitly synthetic technical fixtures, never real experience or credentials. They exist only in the temporary copy and are removed afterward.

At 375, 768, 1024, 1280 and 1440px: one H1 and appropriate résumé headings, title/description/noindex, no invented canonical domain, readable width/no overflow, 44px actions, visible keyboard focus, Tab/Enter navigation, working Services ancestor/return link and conditional hub/detail links pass. Private-note/unverified/unapproved sentinels never appear in rendered output. Release-closed, draft and missing-hub states emit no profile page or links; a minimal biography emits no empty résumé headings. Desktop and mobile screenshots were visually reviewed.

The updated hub regression passes all five widths and keeps its normal/no-profile and unavailable states intact. The previous approved-teaser fixture is replaced by the real source/route integration suite. Existing homepage hero dimensions/artwork remain unchanged.

Production build, 16 unit suites plus newsletter checks, typecheck (zero errors/warnings; two existing hints), and the high/critical vulnerability audit pass. Full qa:fast still stops at the unchanged, pre-existing sample-article catalog expectation, including Demeter's former filename. Existing low/moderate dependency advisories remain; no package versions changed.

No Services/profile routes, links, synthetic facts, private verification notes or identity appear in real production output. No public résumé is ready until genuine factual content is supplied and approved. Stopped after SF-07 with a local commit for review; no push or deployment.
