import { serviceSpheres } from "../data/service-spheres.ts";
import type { ServiceSphere } from "../data/service-spheres.ts";
import { servicesPublicReleaseApproved } from "../data/services-release.ts";
import { toPublishedSphereViews, serviceCardPresentation } from "./services-presentation.ts";
import type { PublishedService } from "./services-catalog.ts";

/** Build-time routes share the published selector's normalized products.
 * No empty category, future sphere or unapproved release is ever emitted. */
export function buildServiceSpherePaths(
  products: readonly PublishedService[],
  releaseApproved = servicesPublicReleaseApproved,
  spheres: readonly ServiceSphere[] = serviceSpheres,
) {
  if (!releaseApproved) return [];
  // Defensive check for callers other than the shared collection accessor.
  for (const product of products) serviceCardPresentation(product);
  return toPublishedSphereViews(products, spheres).map((sphere) => ({
    params: { sphere: sphere.id },
    props: { sphere, products: products.filter((product) => product.sphere === sphere.id) },
  }));
}
