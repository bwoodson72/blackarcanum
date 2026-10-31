import { getCollection } from "astro:content";
import { selectPublishedServices } from "./services-catalog.ts";
import type { ServiceSphereId } from "../data/service-spheres.ts";

/** No routes are created here. Global Services activation is a separate step. */
export async function getPublishedServices(sphere?: ServiceSphereId) {
  const products = selectPublishedServices(await getCollection("services"));
  return sphere === undefined ? products : products.filter((product) => product.sphere === sphere);
}

export async function getPublishedService(id: string) {
  return (await getPublishedServices()).find((product) => product.id === id);
}
