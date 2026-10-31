import { practitionerProfile } from "../data/practitioner.ts";
import { servicesPublicReleaseApproved } from "../data/services-release.ts";
import { selectPublishedPractitioner } from "./practitioner-profile.ts";
import { getServicesVisibility } from "./services-visibility-public.ts";
import { getServicesRouteReadiness } from "./services-route-readiness.ts";
/** A profile link requires a real emitted hub and the approved profile source. */
export async function getPublishedPractitioner() {
  if (!practitionerProfile) return undefined;
  const routes = getServicesRouteReadiness();
  const state = await getServicesVisibility();
  return selectPublishedPractitioner(practitionerProfile, servicesPublicReleaseApproved, state.live && routes.practitioner);
}
