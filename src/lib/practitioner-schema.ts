import { z } from "astro/zod";
const text = z.string().trim().min(1);
const approval = {
  verified: z.boolean().default(false),
  approved: z.boolean().default(false),
  /** Private provenance/approval context; never included in public views. */
  verificationNote: text.optional(),
};
const fact = z.object({ text, ...approval }).strict();
const timelineItem = z.object({ period: text, title: text, description: text, ...approval }).strict();
export const practitionerSchema = z.object({
  status: z.enum(["draft", "review", "published"]),
  approved: z.boolean().default(false),
  summary: fact.optional(),
  biography: z.array(fact).default([]),
  practiceHistory: z.array(timelineItem).default([]),
  disciplines: z.array(fact).default([]),
  training: z.array(timelineItem).default([]),
  kindsOfWork: z.array(fact).default([]),
  selectedWork: z.array(fact).default([]),
  principles: z.array(fact).default([]),
}).strict().superRefine((profile, ctx) => {
  if (profile.status !== "published") return;
  if (!profile.approved) ctx.addIssue({ code: "custom", path: ["approved"], message: "Profile publication requires explicit owner approval." });
  if (!profile.summary?.approved || !profile.summary.verified) {
    ctx.addIssue({ code: "custom", path: ["summary"], message: "A verified, approved summary is required for publication." });
  }
  if (!profile.biography.some(fact => fact.approved && fact.verified)) {
    ctx.addIssue({ code: "custom", path: ["biography"], message: "A verified, approved biography is required for publication." });
  }
});
export type PractitionerProfile = z.infer<typeof practitionerSchema>;
