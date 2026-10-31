/** Owner-approved Love & Relationships sphere and card copy (October 31, 2026).
 * These are informational previews, NOT published catalog entries or purchase offers.
 * A product must pass the existing service schema, prices and approval gates
 * before it can have a linked detail page or become available for purchase.
 */
export const loveIntroduction = [
  "Love can bring extraordinary happiness, but it can also leave us facing questions that are difficult to resolve. A promising connection may never develop into the relationship we hoped for. An established partnership may become strained by distance, misunderstanding, or changing circumstances. Sometimes a relationship ends while the attachment remains, leaving the possibility of reconciliation uncertain.",
  "Mystagogia offers private divination and ritual services addressing the different circumstances of romantic life, from the search for new love to the restoration of a relationship that has broken down.",
  "Through divination, we examine the influences surrounding a romantic situation, the difficulties that may be affecting it, and the possibilities that lie ahead. A reading can provide a fuller understanding of an existing relationship, explore the prospects for a new connection, or investigate the potential for reconciliation following separation.",
  "Ritual work approaches these matters differently. Rather than examining a situation, a magical operation is undertaken toward a particular objective. This may involve attracting a new relationship, restoring affection and harmony between partners, or working toward reunion after estrangement.",
  "Each service is individually undertaken and has a specific purpose. The offerings below address different romantic circumstances, allowing you to select the work most appropriate to your situation.",
] as const;

export interface InformationalServicePreview {
  slug: string;
  kind: "reading" | "spellwork";
  title: string;
  summary: string;
}

export const loveOfferingPreviews: readonly InformationalServicePreview[] = [
  {
    slug: "future-love-reading",
    kind: "reading",
    title: "Future Love Reading",
    summary: "Explore your romantic prospects and the possibilities surrounding a future relationship. This reading examines your present circumstances, influences affecting your love life, and opportunities for a meaningful new connection.",
  },
  {
    slug: "relationship-clarity-reading",
    kind: "reading",
    title: "Relationship Clarity Reading",
    summary: "When a relationship becomes difficult to understand, uncertainty can affect every decision. This reading examines the dynamics of an existing relationship, the influences shaping its present condition, and the direction in which it may be developing.",
  },
  {
    slug: "separation-reconciliation-reading",
    kind: "reading",
    title: "Separation & Reconciliation Reading",
    summary: "Estrangement does not always bring emotional resolution. Whether communication has ceased, a relationship has ended, or a separation has continued for months, this reading examines the circumstances surrounding the distance between you and the prospects for renewed contact and reconciliation.",
  },
  {
    slug: "love-attraction-working",
    kind: "spellwork",
    title: "Love Attraction Working",
    summary: "A personally performed magical operation directed toward attracting a new romantic relationship. This working is intended for those seeking to bring love into their lives and create favorable conditions for a meaningful romantic connection.",
  },
  {
    slug: "relationship-harmony-working",
    kind: "spellwork",
    title: "Relationship Harmony Working",
    summary: "Relationships can suffer when affection gives way to tension, emotional distance, or persistent disagreement. This working is directed toward restoring warmth, improving harmony, and strengthening the bonds of an existing relationship.",
  },
  {
    slug: "reconciliation-working",
    kind: "spellwork",
    title: "Reconciliation Working",
    summary: "A magical operation directed toward restoring a romantic relationship following separation or estrangement. Its purpose is to address the distance that has developed between partners, encourage renewed communication, and work toward reconciliation and reunion.",
  },
];
