/** Browsing the practice does not require a published offering or permission to sell. */
export function canShowServicesNavigation(state: {
  hub: boolean;
  sphereRoutes: boolean;
  detailRoutes: boolean;
}): boolean {
  return state.hub && state.sphereRoutes && state.detailRoutes;
}
