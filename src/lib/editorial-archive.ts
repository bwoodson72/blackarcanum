/**
 * Pure, deterministic publication and pagination helpers.
 * Source MDX collections remain authoritative. Never feature draft/review entries.
 */
export const EDITORIAL_PAGE_SIZE = 12;

export interface ArchiveCandidate {
  id: string;
  data: {
    status: "draft" | "review" | "published";
    publishedAt?: Date;
  };
}

/**
 * Newest publication first. Same-date ties sort by stable slug ID (ascending),
 * avoiding locale-dependent ordering and filename/input-order differences.
 */
export function sortPublishedEntries<T extends ArchiveCandidate>(
  entries: readonly T[],
): T[] {
  return entries
    .filter((entry) =>
      entry.data.status === "published" &&
      entry.data.publishedAt instanceof Date &&
      Number.isFinite(entry.data.publishedAt.valueOf()),
    )
    .sort((left, right) => {
      const byDate = right.data.publishedAt!.valueOf() - left.data.publishedAt!.valueOf();
      if (byDate !== 0) return byDate;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    });
}

export interface EditorialArchivePage<T> {
  entries: readonly T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

/**
 * The first archive route always exists, even with zero articles.
 * Numbered routes exist only for actual pages 2+ with published entries.
 */
export function getArchivePage<T extends ArchiveCandidate>(
  entries: readonly T[],
  pageNumber = 1,
  pageSize = EDITORIAL_PAGE_SIZE,
): EditorialArchivePage<T> {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError("Archive page size must be a positive safe integer.");
  }
  if (!Number.isSafeInteger(pageNumber) || pageNumber < 1) {
    throw new RangeError("Archive page number must be a positive safe integer.");
  }
  const sorted = sortPublishedEntries(entries);
  const totalPages = Math.ceil(sorted.length / pageSize);

  if (pageNumber > Math.max(1, totalPages)) {
    throw new RangeError("Archive page is out of range.");
  }

  const start = (pageNumber - 1) * pageSize;
  return {
    entries: sorted.slice(start, start + pageSize),
    currentPage: pageNumber,
    totalItems: sorted.length,
    totalPages,
  };
}
