import { serviceSpheres } from "../data/service-spheres.ts";
import type { ServiceSphere } from "../data/service-spheres.ts";
import { toPublishedSphereViews, serviceCardPresentation } from "./services-presentation.ts";
import type { PublishedService } from "./services-catalog.ts";

/** Build-time routes share the published selector's normalized products.
 * Approved categories can be browsed before offerings are published. */
export function buildServiceSpherePaths(
  products: readonly PublishedService[],
  destinationsReady = true,
  spheres: readonly ServiceSphere[] = serviceSpheres,
) {
  if (!destinationsReady) return [];
  // Defensive check for callers other than the shared collection accessor.
  for (const product of products) serviceCardPresentation(product);
  return toPublishedSphereViews(products, spheres).map((sphere) => ({
    params: { sphere: sphere.id },
    props: { sphere, products: products.filter((product) => product.sphere === sphere.id) },
  }));
}
