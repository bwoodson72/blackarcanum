import type { APIRoute } from "astro";

export const prerender = true;

/**
 * No approved public domain means no crawler invitation. Once the real
 * MYSTAGOGIA_SITE_URL is configured, expose the sitemap of indexable pages.
 */
export const GET: APIRoute = ({ site }) => {
  const isPublic = Boolean(site) && import.meta.env.PROD;
  const text = isPublic
    ? "User-agent: *\nAllow: /\nSitemap: " + new URL("/sitemap-index.xml", site!).href + "\n"
    : "User-agent: *\nDisallow: /\n";
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
