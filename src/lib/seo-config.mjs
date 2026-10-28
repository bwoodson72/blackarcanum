import { existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

/** An explicit owner-approved public URL; Vercel previews are never canonical. */
export function configuredSiteUrl(value = process.env.MYSTAGOGIA_SITE_URL, testMode = process.env.MYSTAGOGIA_SEO_TEST === "1") {
  if (value == null || value === "") return undefined;
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error("MYSTAGOGIA_SITE_URL must be an absolute HTTPS origin."); }
  const host = parsed.hostname.toLowerCase();
  if (parsed.protocol !== "https:" || !host.includes(".") ||
      parsed.username || parsed.password || parsed.search || parsed.hash ||
      parsed.pathname !== "/" || parsed.port ||
      host === "localhost" || host.endsWith(".vercel.app") ||
      host === "example.com" || host.endsWith(".example.com") ||
      host === "example.org" || host.endsWith(".example.org") ||
      host === "example.net" || host.endsWith(".example.net") ||
      (!testMode && (host.endsWith(".test") || host.endsWith(".example") ||
        host.endsWith(".invalid") || host.endsWith(".localhost")))) {
    throw new Error("MYSTAGOGIA_SITE_URL must be a real approved HTTPS origin, not a placeholder or deployment preview.");
  }
  return parsed.origin;
}

/**
 * Astro's sitemap filter runs after static HTML is emitted. Only include a
 * real prerendered page whose actual generated HTML is indexable. This keeps
 * the sitemap in lockstep with preview, draft and page-count gates.
 */
export function isIndexableBuiltPage(absoluteUrl, outputDir = resolve("dist")) {
  let url;
  try { url = new URL(absoluteUrl); } catch { return false; }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return false; }
  if (!pathname.startsWith("/") || pathname.includes("..") ||
      !pathname.endsWith("/") || pathname.includes("\\")) return false;
  const htmlFile = join(outputDir, pathname.slice(1), "index.html");
  if (!existsSync(htmlFile)) return false;
  const html = readFileSync(htmlFile, "utf8");
  return !/<meta\b[^>]*name="robots"[^>]*content="[^"]*\bnoindex\b/i.test(html);
}
