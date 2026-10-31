import { getPublishedServices } from "./services-public.ts";
import { toPublishedSphereViews } from "./services-presentation.ts";
import type { PublishedSphereView } from "./services-presentation.ts";
import { getServicesRouteReadiness } from "./services-route-readiness.ts";
import { canShowServicesNavigation } from "./services-visibility.ts";

/** Ordinary site navigation depends on real destinations, not commercial launch or inventory. */
export async function getServicesVisibility(): Promise<{ live: boolean; spheres: PublishedSphereView[] }> {
  const routes = getServicesRouteReadiness();
  const live = canShowServicesNavigation({ hub: routes.hub, sphereRoutes: routes.spheres, detailRoutes: routes.details });
  return { live, spheres: live ? toPublishedSphereViews(await getPublishedServices()) : [] };
}
