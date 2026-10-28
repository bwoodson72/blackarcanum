import { EDITORIAL_SLUG_PATTERN } from "./editorial-identifiers.ts";
import type { MediaRecord } from "../data/media.ts";

const MEDIA_SOURCE_PATH = /^src\/assets\/media\/(editorial|reference|decorative)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.(?:jpg|jpeg|png|webp|avif|svg)$/;
const MEDIA_ORIGINAL_PATH = /^media-originals\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.(?:jpg|jpeg|png|webp|avif|tif|tiff|psd|svg)$/;
const MEDIA_ROLES = new Set(["editorial", "reference", "decorative"]);
const MEDIA_ORIGINS = new Set(["historical-reproduction", "modern-artwork"]);
const RIGHTS_STATUSES = new Set(["pending", "cleared", "restricted"]);
const RIGHTS_BASES = new Set(["public-domain", "cc-license", "permission", "owned"]);

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function webUrl(value: unknown): boolean {
  if (!hasText(value)) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      !!parsed.hostname && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

/** Figure references and all historical reproductions require stricter proof. */
export function requiresHistoricalProvenance(record: MediaRecord): boolean {
  return record.role === "reference" || record.origin === "historical-reproduction";
}

/**
 * A record can be researched while rights are pending, but must NEVER be used
 * by a published article until a concrete reuse basis is documented.
 */
export function mediaPublicationIssues(record: MediaRecord): string[] {
  const issues: string[] = [];
  const rights = record.rights;
  if (!rights || rights.status !== "cleared") {
    issues.push("rights status must be cleared before publication");
    return issues;
  }

  if (!RIGHTS_BASES.has(rights.basis ?? "")) {
    issues.push("rights basis is required for publication");
  }
  if (!hasText(rights.creditLine)) {
    issues.push("rights creditLine is required for publication");
  }
  if (!hasText(rights.license)) {
    issues.push("rights license or specific permission statement is required for publication");
  }
  const strict = requiresHistoricalProvenance(record);
  if (strict && !webUrl(record.sourceUrl)) {
    issues.push("historical/reference images require a verified sourceUrl");
  }
  if (strict && !webUrl(rights.evidenceUrl)) {
    issues.push("historical/reference images require a separate rights evidenceUrl");
  }
  if (!strict && !webUrl(rights.evidenceUrl) && !hasText(rights.evidenceNote)) {
    issues.push("rights evidenceUrl or evidenceNote is required for publication");
  }
  return issues;
}

export interface MediaInventory {
  /** Normalized repo-root file paths from the actual filesystem or Vite glob. */
  files: readonly string[];
  /** If supplied, verify every separately retained archival master too. */
  originals?: readonly string[];
}

/**
 * Verify record shape, path safety and rights integrity for the entire
 * registry. When given a real file inventory, reject missing image files.
 *
 * Non-cleared records may be staged in the registry for rights research;
 * published articles fail closed through mediaPublicationIssues.
 */
export function validateMediaRegistry(
  records: readonly MediaRecord[],
  inventory?: MediaInventory,
): void {
  const ids = new Set<string>();
  const usedFiles = new Set<string>();
  const knownFiles = inventory ? new Set(inventory.files) : undefined;
  const originals = inventory?.originals ? new Set(inventory.originals) : undefined;

  for (const item of records) {
    const label = `Media "${String(item.id)}"`;
    if (!hasText(item.id) || !EDITORIAL_SLUG_PATTERN.test(item.id)) {
      throw new Error(`${label}: invalid stable media ID (lowercase-kebab-case required).`);
    }
    if (ids.has(item.id)) throw new Error(`${label}: duplicate media ID.`);
    ids.add(item.id);

    if (!hasText(item.sourceFile) || !MEDIA_SOURCE_PATH.test(item.sourceFile)) {
      throw new Error(`${label}: invalid sourceFile; expected src/assets/media/<role>/.../<file> with an image extension.`);
    }
    const sourceRole = MEDIA_SOURCE_PATH.exec(item.sourceFile)![1]!;
    if (!MEDIA_ROLES.has(item.role) || item.role !== sourceRole) {
      throw new Error(`${label}: role must match the sourceFile folder.`);
    }
    if (usedFiles.has(item.sourceFile)) {
      throw new Error(`${label}: duplicate sourceFile; reuse the existing media ID instead.`);
    }
    usedFiles.add(item.sourceFile);
    if (knownFiles && !knownFiles.has(item.sourceFile)) {
      throw new Error(`${label}: missing source image "${item.sourceFile}".`);
    }

    if (item.originalFile !== undefined) {
      if (!hasText(item.originalFile) || !MEDIA_ORIGINAL_PATH.test(item.originalFile)) {
        throw new Error(`${label}: invalid originalFile; keep masters under media-originals/.`);
      }
      if (originals && !originals.has(item.originalFile)) {
        throw new Error(`${label}: missing high-resolution original "${item.originalFile}".`);
      }
    }
    if (!MEDIA_ORIGINS.has(item.origin)) {
      throw new Error(`${label}: origin must distinguish historical-reproduction from modern-artwork.`);
    }
    if (typeof item.decorative !== "boolean") {
      throw new Error(`${label}: decorative must be a boolean.`);
    }
    if (item.decorative !== (item.role === "decorative")) {
      throw new Error(`${label}: decorative flag must agree with the media role.`);
    }
    if (typeof item.alt !== "string" ||
        (item.decorative ? item.alt !== "" : !hasText(item.alt))) {
      throw new Error(`${label}: descriptive alt text is required for nondecorative images; decorative alt must be empty.`);
    }
    if (item.role === "reference" && !hasText(item.caption)) {
      throw new Error(`${label}: reference images require a meaningful figure caption.`);
    }
    for (const field of ["caption", "creator", "date", "period", "repository"] as const) {
      if (item[field] !== undefined && !hasText(item[field])) {
        throw new Error(`${label}: ${field} must not be blank when provided.`);
      }
    }
    if (item.sourceUrl !== undefined && !webUrl(item.sourceUrl)) {
      throw new Error(`${label}: invalid sourceUrl; use HTTP(S) without embedded credentials.`);
    }
    if (requiresHistoricalProvenance(item) && !webUrl(item.sourceUrl)) {
      throw new Error(`${label}: historical/reference records require a traceable sourceUrl.`);
    }

    const rights = item.rights;
    if (!rights || !RIGHTS_STATUSES.has(rights.status)) {
      throw new Error(`${label}: rights status is required (pending, cleared or restricted).`);
    }
    if (rights.basis !== undefined && !RIGHTS_BASES.has(rights.basis)) {
      throw new Error(`${label}: invalid rights basis.`);
    }
    for (const field of ["license", "creditLine", "evidenceNote"] as const) {
      if (rights[field] !== undefined && !hasText(rights[field])) {
        throw new Error(`${label}: rights ${field} must not be blank when provided.`);
      }
    }
    if (rights.evidenceUrl !== undefined && !webUrl(rights.evidenceUrl)) {
      throw new Error(`${label}: invalid rights evidenceUrl.`);
    }
    if (rights.status === "cleared") {
      const issues = mediaPublicationIssues(item);
      if (issues.length) {
        throw new Error(`${label}: ${issues.join("; ")}.`);
      }
    }
  }
}

/** Resolve the SAME approved media ID across any number of articles. */
export function getMediaRecord(
  id: string,
  records: readonly MediaRecord[],
): MediaRecord {
  validateMediaRegistry(records);
  const record = records.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown media ID "${id}".`);
  return record;
}
