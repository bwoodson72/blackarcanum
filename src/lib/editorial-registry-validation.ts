import { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";
import type { Topic } from "../data/topics.ts";
import type { SourceRecord } from "../data/sources.ts";

function verifyIdentifiers(
  records: readonly { id: string }[],
  kind: "topic" | "source",
): void {
  const seen = new Set<string>();

  for (const record of records) {
    if (typeof record.id !== "string" || !EDITORIAL_SLUG_PATTERN.test(record.id)) {
      throw new Error(`Invalid ${kind} ID "${String(record.id)}". Use lowercase hyphen-separated IDs.`);
    }
    if (seen.has(record.id)) {
      throw new Error(`Duplicate ${kind} ID "${record.id}" in approved registry.`);
    }
    seen.add(record.id);
  }
}

const nonblank = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function validateTopicRegistry(records: readonly Topic[]): void {
  verifyIdentifiers(records, "topic");

  for (const topic of records) {
    if (!nonblank(topic.label) || typeof topic.enabled !== "boolean" ||
        typeof topic.showInBrowse !== "boolean") {
      throw new Error(`Invalid topic "${topic.id}": label, enabled and showInBrowse are required.`);
    }
    if (topic.description !== undefined && !nonblank(topic.description)) {
      throw new Error(`Invalid description for topic "${topic.id}".`);
    }
    if (topic.landingPage !== undefined &&
        (!nonblank(topic.landingPage) || !topic.landingPage.startsWith("/") ||
        topic.landingPage.startsWith("//"))) {
      throw new Error(`Invalid landingPage for topic "${topic.id}": expected a reviewed local route.`);
    }
  }
}

export function validateSourceRegistry(records: readonly SourceRecord[]): void {
  verifyIdentifiers(records, "source");

  for (const source of records) {
    if (!nonblank(source.title)) {
      throw new Error(`Invalid source "${source.id}": title is required.`);
    }
    for (const field of ["creator", "edition", "translator", "period", "publisher", "archive", "rights"] as const) {
      if (source[field] !== undefined && !nonblank(source[field])) {
        throw new Error(`Invalid source "${source.id}": ${field} must not be blank.`);
      }
    }
    if (source.stableUrl !== undefined) {
      try {
        const url = new URL(source.stableUrl);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("unsupported protocol");
      } catch {
        throw new Error(`Invalid stableUrl for source "${source.id}": expected an HTTP(S) URL.`);
      }
    }
    if (source.kind !== undefined && !["primary", "scholarly", "practitioner"].includes(source.kind)) {
      throw new Error(`Invalid evidence kind for source "${source.id}".`);
    }
  }
}
