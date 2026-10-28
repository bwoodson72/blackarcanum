/** Only implemented, published top-level navigation routes are available. */
export const CONTENT_CTA_ROUTES = ["/", "/about/", "/library/", "/grimoire/"] as const;
export type ContentCtaRoute = (typeof CONTENT_CTA_ROUTES)[number];

export function assertLiveCtaRoute(href: string): asserts href is ContentCtaRoute {
  if (typeof href !== "string" || !(CONTENT_CTA_ROUTES as readonly string[]).includes(href)) {
    throw new Error('ContentCTA href "' + String(href) + '" is not a live approved route.');
  }
}
