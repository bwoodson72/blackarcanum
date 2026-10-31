/** Approved spheres are browsable independently of individual offering publication. */
export const SERVICE_SPHERE_IDS = ["love", "money", "protection-uncrossing"] as const;
export type ServiceSphereId = typeof SERVICE_SPHERE_IDS[number];

export interface ServiceSphere {
  id: ServiceSphereId;
  label: string;
  summary?: string;
  order: number;
  visible: boolean;
  published: boolean;
}

export const serviceSpheres: readonly ServiceSphere[] = [
  { id: "love", label: "Love & Relationships", order: 1, visible: true, published: true },
  { id: "money", label: "Money & Prosperity", order: 2, visible: true, published: true },
  { id: "protection-uncrossing", label: "Protection & Uncrossing", order: 3, visible: true, published: true },
];

/** Editorial rights clearance alone never approves an image for Services. */
export const approvedServiceMediaIds: readonly string[] = [];
