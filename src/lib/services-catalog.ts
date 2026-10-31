import { serviceSpheres, SERVICE_SPHERE_IDS } from "../data/service-spheres.ts";
import type { ServiceSphere, ServiceSphereId } from "../data/service-spheres.ts";
import { serviceSchema, SERVICE_SLUG_PATTERN } from "./services-schema.ts";
import type { ServiceData } from "./services-schema.ts";

export interface ServiceEntry { id: string; data: ServiceData }
export type PublishedService = ServiceData & {
  priceUsdCents: number;
  scope: string;
  inclusions: string[];
  process: string[];
  turnaround: string;
  clientRequirements: string[];
  id: string;
  href: string;
};

export function serviceSphereUrl(sphere: ServiceSphereId): string {
  if (!SERVICE_SPHERE_IDS.includes(sphere)) throw new Error("Unknown Services sphere.");
  return `/services/${sphere}/`;
}

export function serviceProductUrl(sphere: ServiceSphereId, slug: string): string {
  if (!SERVICE_SLUG_PATTERN.test(slug)) throw new Error("Invalid Services slug.");
  return `${serviceSphereUrl(sphere)}${slug}/`;
}

/** Validate the whole catalog before selecting; references may target drafts,
 * but only published targets may be exposed in a normalized public view. */
export function selectPublishedServices(
  entries: readonly ServiceEntry[],
  spheres: readonly ServiceSphere[] = serviceSpheres,
): PublishedService[] {
  const sphereMap = new Map<ServiceSphereId, ServiceSphere>();
  for (const sphere of spheres) {
    if (!SERVICE_SPHERE_IDS.includes(sphere.id) || sphereMap.has(sphere.id) ||
        !sphere.label.trim() || !Number.isSafeInteger(sphere.order) ||
        typeof sphere.visible !== "boolean" || typeof sphere.published !== "boolean") {
      throw new Error("Invalid or duplicate Services sphere.");
    }
    sphereMap.set(sphere.id, sphere);
  }
  const catalog = new Map<string, ServiceData>();
  for (const entry of entries) {
    const data = serviceSchema.parse(entry.data);
    if (entry.id !== data.slug || catalog.has(entry.id)) throw new Error("Duplicate or mismatched Services ID.");
    if (!sphereMap.has(data.sphere)) throw new Error("Unknown Services sphere reference.");
    catalog.set(entry.id, data);
  }
  for (const data of catalog.values()) {
    for (const id of data.relatedIds) if (!catalog.has(id)) throw new Error(`Unknown related Services ID "${id}".`);
  }
  const published = [...catalog.values()].filter((data) => {
    const sphere = sphereMap.get(data.sphere)!;
    return data.status === "published" && data.approved && sphere.published && sphere.visible;
  });
  const publicIds = new Set(published.map(({ slug }) => slug));
  return published.map((data) => ({
    ...data,
    id: data.slug,
    href: serviceProductUrl(data.sphere, data.slug),
    relatedIds: data.relatedIds.filter((id) => publicIds.has(id)),
  }) as PublishedService).sort((a, b) =>
    sphereMap.get(a.sphere)!.order - sphereMap.get(b.sphere)!.order ||
    (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
