export function canShowServicesNavigation(state: {
  releaseApproved: boolean;
  indexableHub: boolean;
  sphereRoutes: boolean;
  detailRoutes: boolean;
  publishedSphereCount: number;
}): boolean {
  return state.releaseApproved && state.indexableHub && state.sphereRoutes && state.detailRoutes &&
    Number.isSafeInteger(state.publishedSphereCount) && state.publishedSphereCount > 0;
}
