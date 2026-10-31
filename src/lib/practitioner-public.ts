import { practitionerProfile } from "../data/practitioner.ts";
import { servicesPublicReleaseApproved } from "../data/services-release.ts";
import { selectPublishedPractitioner } from "./practitioner-profile.ts";

/** Shared by hub, product details and the profile route. Data, release and
 * real ancestor/profile modules must all be ready before exposing a link. */
export function getPublishedPractitioner() {
  const routes = import.meta.glob("../pages/services/**/*.astro");
  const ready = !!routes["../pages/services/index.astro"] &&
    !!routes["../pages/services/practitioner/[...page].astro"];
  return selectPublishedPractitioner(practitionerProfile, servicesPublicReleaseApproved, ready);
}
