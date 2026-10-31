import { servicesPublicReleaseApproved } from "../data/services-release.ts";
import { getPublishedServices } from "./services-public.ts";
import { toPublishedSphereViews } from "./services-presentation.ts";
import type { PublishedSphereView } from "./services-presentation.ts";
import { getServicesRouteReadiness } from "./services-route-readiness.ts";
import { canShowServicesNavigation } from "./services-visibility.ts";

/** One source for the real hub route, header/footer navigation and homepage invitation. */
export async function getServicesVisibility(): Promise<{ live: boolean; spheres: PublishedSphereView[] }> {
  const routes = getServicesRouteReadiness();
  if (!servicesPublicReleaseApproved || !routes.indexableHub || !routes.spheres || !routes.details) {
    return { live: false, spheres: [] };
  }
  const spheres = toPublishedSphereViews(await getPublishedServices());
  const live = canShowServicesNavigation({ releaseApproved: servicesPublicReleaseApproved,
    indexableHub: routes.indexableHub, sphereRoutes: routes.spheres, detailRoutes: routes.details,
    publishedSphereCount: spheres.length });
  return { live, spheres: live ? spheres : [] };
}
