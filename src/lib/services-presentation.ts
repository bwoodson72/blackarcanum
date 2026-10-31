import { serviceSpheres } from "../data/service-spheres.ts";
import type { ServiceSphere } from "../data/service-spheres.ts";
import { serviceProductUrl, serviceSphereUrl } from "./services-catalog.ts";
import type { PublishedService } from "./services-catalog.ts";
import { serviceSchema } from "./services-schema.ts";

export interface PublishedSphereView extends ServiceSphere {
  href: ReturnType<typeof serviceSphereUrl>;
  productCount: number;
}

/** Approved spheres remain browsable while individual offerings are in preparation. */
export function toPublishedSphereViews(
  products: readonly PublishedService[],
  spheres: readonly ServiceSphere[] = serviceSpheres,
): PublishedSphereView[] {
  return spheres.filter((sphere) => sphere.visible && sphere.published)
    .map((sphere) => ({ ...sphere, href: serviceSphereUrl(sphere.id),
      productCount: products.filter((product) => product.sphere === sphere.id &&
        product.status === "published" && product.approved).length,
    }))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export function formatServicePrice(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error("Approved positive integer USD cents required.");
  // Preserve exact cents even at the schema's maximum safe integer value.
  const value = BigInt(cents);
  return usd.formatToParts(value / 100n).map((part) =>
    part.type === "fraction" ? (value % 100n).toString().padStart(2, "0") : part.value,
  ).join("");
}

/** Cards accept published views only, never arbitrary URLs or incomplete drafts. */
export function serviceCardPresentation(product: PublishedService) {
  const data = serviceSchema.parse(product);
  const href = serviceProductUrl(data.sphere, data.slug);
  if (data.status !== "published" || !data.approved || product.id !== data.slug || product.href !== href) {
    throw new Error("Service cards require a canonical, approved published product.");
  }
  return { ...data, href, price: formatServicePrice(data.priceUsdCents!),
    kindLabel: data.kind === "reading" ? "Reading" : "Spellwork" };
}
