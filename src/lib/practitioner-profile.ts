import { practitionerSchema } from "./practitioner-schema.ts";
export interface PublishedPractitioner {
  href: "/services/practitioner/";
  summary: string;
  biography: string[];
  practiceHistory: { period: string; title: string; description: string }[];
  disciplines: string[];
  training: { period: string; title: string; description: string }[];
  kindsOfWork: string[];
  selectedWork: string[];
  principles: string[];
}

/** Verification flags record reviewed owner-supplied facts; they never mean
 * the site independently certifies a credential. No identity is inferred. */
export function selectPublishedPractitioner(
  source: unknown,
  releaseApproved = false,
  routesReady = false,
): PublishedPractitioner | undefined {
  if (source === null || source === undefined) return undefined;
  const profile = practitionerSchema.parse(source);
  if (!releaseApproved || !routesReady || profile.status !== "published" || !profile.approved) return undefined;
  const facts = (items: { text: string; approved: boolean; verified: boolean }[]) =>
    items.filter(item => item.approved && item.verified).map(item => item.text);
  const timeline = (items: { period: string; title: string; description: string; approved: boolean; verified: boolean }[]) =>
    items.filter(item => item.approved && item.verified).map(({ period, title, description }) => ({ period, title, description }));
  return {
    href: "/services/practitioner/", summary: profile.summary!.text,
    biography: facts(profile.biography), practiceHistory: timeline(profile.practiceHistory),
    disciplines: facts(profile.disciplines), training: timeline(profile.training),
    kindsOfWork: facts(profile.kindsOfWork), selectedWork: facts(profile.selectedWork),
    principles: facts(profile.principles),
  };
}
