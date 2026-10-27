/**
 * The single editorially approved topic registry. A new topic is NOT a public
 * category or nav link: visibility and landing pages require separate approval.
 *
 * Keep empty until the owner approves real subjects.
 */
export interface Topic {
  id: string;
  label: string;
  /** Whether the editor may assign this topic to new content. */
  enabled: boolean;
  /** Whether a future browse interface may offer this approved label. */
  showInBrowse: boolean;
  description?: string;
  /** Optional *existing, reviewed* route. Never generate one from an ID. */
  landingPage?: `/${string}`;
}

export const topics: readonly Topic[] = [];
