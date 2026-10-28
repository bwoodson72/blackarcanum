import { citationSchema } from "./editorial-citations.ts";
import type { Citation, CitationLocator } from "./editorial-citations.ts";
import { sources } from "../data/sources.ts";
import type { SourceRecord } from "../data/sources.ts";
import { validateSourceRegistry } from "./editorial-registry-validation.ts";

/** An individual citation occurrence, not a unique bibliography source. */
export interface ArticleNote {
  number: number;
  citation: Citation;
  source: SourceRecord;
  locator?: string;
}

export interface ArticleReferencesModel {
  notes: ArticleNote[];
  /** Unique, in first-citation order, then explicitly listed source IDs. */
  bibliography: SourceRecord[];
}

/**
 * Render only information actually supplied by the owner-reviewed registry.
 * The optional locator identifies a passage in a particular use of a source.
 */
export function formatCitationLocator(locator?: CitationLocator): string | undefined {
  if (!locator) return undefined;
  const parts = [
    locator.passage && `passage ${locator.passage}`,
    locator.section && `section ${locator.section}`,
    locator.page && `page ${locator.page}`,
    locator.folio && `folio ${locator.folio}`,
  ].filter((part): part is string => typeof part === "string" && part.length > 0);
  return parts.length ? parts.join("; ") : undefined;
}

/**
 * Registry-backed notes/bibliography. Missing IDs, malformed locators and
 * invalid URLs are build errors. A missing *optional* URL is not invented.
 */
export function buildArticleReferences(
  citations: readonly Citation[] = [],
  sourceIds: readonly string[] = [],
  registry: readonly SourceRecord[] = sources,
): ArticleReferencesModel {
  validateSourceRegistry(registry);
  const byId = new Map(registry.map((record) => [record.id, record]));
  const bibliography: SourceRecord[] = [];
  const seen = new Set<string>();

  const sourceFor = (id: string): SourceRecord => {
    const record = byId.get(id);
    if (!record) throw new Error(`Unknown article citation/source ID "${id}". Add a verified source registry record first.`);
    if (!seen.has(id)) {
      seen.add(id);
      bibliography.push(record);
    }
    return record;
  };

  const notes = citations.map((input, offset): ArticleNote => {
    const citation = citationSchema.parse(input);
    const source = sourceFor(citation.sourceId);
    return {
      number: offset + 1,
      citation,
      source,
      ...(formatCitationLocator(citation.locator)
        ? { locator: formatCitationLocator(citation.locator) }
        : {}),
    };
  });

  for (const id of sourceIds) sourceFor(id);
  return { notes, bibliography };
}

/**
 * Inline citations use the same ordered frontmatter citation list as the
 * notes below the article, so locators never need a second handwritten copy.
 */
export function getArticleNote(
  index: number,
  citations: readonly Citation[],
  registry: readonly SourceRecord[] = sources,
): ArticleNote {
  if (!Number.isSafeInteger(index) || index < 1 || index > citations.length) {
    throw new Error(`SourceCitation index ${String(index)} must select an existing 1-based article citation.`);
  }
  return buildArticleReferences(citations, [], registry).notes[index - 1]!;
}
