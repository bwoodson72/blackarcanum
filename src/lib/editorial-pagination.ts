import type { EditorialSection } from "./editorial-qa";

/** The canonical first-page URL has no /page/1/ alias. */
export function archivePath(collection: EditorialSection, page: number): string {
  if (collection !== "library" && collection !== "grimoire") {
    throw new Error("Unknown editorial collection.");
  }
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new RangeError("Page must be a positive safe integer.");
  }
  return page === 1 ? `/${collection}/` : `/${collection}/page/${page}/`;
}

export type PagePart = { kind: "page"; page: number } | { kind: "ellipsis" };

export interface PaginationModel {
  current: number;
  total: number;
  previous?: string;
  next?: string;
  parts: readonly PagePart[];
}

export function getPaginationModel(
  collection: EditorialSection,
  current: number,
  total: number,
): PaginationModel | undefined {
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new RangeError("Total page count must be a nonnegative safe integer.");
  }
  if (!Number.isSafeInteger(current) || current < 1 || (total > 0 && current > total)) {
    throw new RangeError("Current page is outside the archive.");
  }
  if (total === 0) {
    if (current !== 1) throw new RangeError("An empty archive has only page 1.");
    return undefined;
  }

  // Validate the section even when pagination is not displayed.
  archivePath(collection, current);
  if (total === 1) return undefined;

  const visible = new Set<number>([1, total, current]);
  for (let offset = -1; offset <= 1; offset++) {
    const target = current + offset;
    if (target >= 1 && target <= total) visible.add(target);
  }
  const sorted = [...visible].sort((a, b) => a - b);
  const parts: PagePart[] = [];
  for (const page of sorted) {
    const previous = parts.at(-1);
    if (previous?.kind === "page" && page > previous.page + 1) {
      if (page === previous.page + 2) {
        parts.push({ kind: "page", page: page - 1 });
      } else {
        parts.push({ kind: "ellipsis" });
      }
    }
    parts.push({ kind: "page", page });
  }

  return {
    current,
    total,
    previous: current > 1 ? archivePath(collection, current - 1) : undefined,
    next: current < total ? archivePath(collection, current + 1) : undefined,
    parts,
  };
}
