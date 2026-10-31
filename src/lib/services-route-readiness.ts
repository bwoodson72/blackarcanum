/** Check real route modules before emitting ordinary Services links. */
export function servicesRouteReadiness(files: readonly string[]) {
  const has = (name: string) => files.includes("../pages/services/" + name);
  return {
    hub: has("[...index].astro") || has("index.astro"),
    indexableHub: has("[...index].astro"),
    spheres: has("[sphere].astro"),
    details: has("[sphere]/[slug].astro"),
    practitioner: has("practitioner/[...page].astro"),
  };
}
export function getServicesRouteReadiness() {
  return servicesRouteReadiness(Object.keys(import.meta.glob("../pages/services/**/*.astro")));
}
