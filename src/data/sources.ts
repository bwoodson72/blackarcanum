/**
 * Bibliographic registry of real, reviewed sources. Do not create fictional
 * works or infer authorship, dates, link stability, or usage rights.
 */
export interface SourceRecord {
  id: string;
  title: string;
  /** Omit rather than invent a creator for anonymous/unknown works. */
  creator?: string;
  edition?: string;
  translator?: string;
  period?: string;
  publisher?: string;
  archive?: string;
  /** Stable publicly accessible HTTP(S) catalog/DOI/archive link if known. */
  stableUrl?: string;
  /** Rights/license/reuse context, when independently established. */
  rights?: string;
  /** Identifies what kind of evidence is being referenced, when known. */
  kind?: "primary" | "scholarly" | "practitioner";
}

export const sources: readonly SourceRecord[] = [];
