import { serviceSpheres } from "../data/service-spheres.ts";
import type { ServiceSphere } from "../data/service-spheres.ts";
import type { PublishedService } from "./services-catalog.ts";
import { servicesPublicReleaseApproved } from "../data/services-release.ts";
import { buildServiceSpherePaths } from "./services-spheres.ts";

/** Detail and sphere routes use the same gated catalog and canonical spheres. */
export function buildServiceProductPaths(
  products: readonly PublishedService[],
  releaseApproved = servicesPublicReleaseApproved,
  spheres: readonly ServiceSphere[] = serviceSpheres,
) {
  const groups = buildServiceSpherePaths(products, releaseApproved, spheres);
  const eligible = groups.flatMap(({ props }) => props.products);
  const byId = new Map(eligible.map((product) => [product.id, product]));
  if (byId.size !== eligible.length) throw new Error("Duplicate published Services ID.");
  return groups.flatMap(({ props: { sphere, products } }) => products.map((product) => ({
    params: { sphere: sphere.id, slug: product.id },
    props: {
      product, sphere,
      // Curated order only. Never replace absent/unpublished references with latest.
      related: product.relatedIds.flatMap((id) => {
        const target = byId.get(id);
        return target && target.id !== product.id ? [target] : [];
      }),
    },
  })));
}
