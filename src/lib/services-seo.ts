import { servicesPublicReleaseApproved } from "../data/services-release.ts";

/** Normal browsing is independent of indexing. Astro.site is validated by the
 * shared approved-origin policy; preview URLs must never become canonicals. */
export function servicesNoindex(site: URL | undefined, releaseApproved = servicesPublicReleaseApproved): boolean {
  return !site || !releaseApproved;
}
