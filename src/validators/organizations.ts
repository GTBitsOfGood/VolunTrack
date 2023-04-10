import { z } from "zod";

export const organizationInputValidator = z.object({
  name: z.string(),
  url: z.string().url(),
  imageUrl: z.string().url(),
  notificationEmail: z.string().email(),
  slug: z.string(),
  theme: z.string(),
  defaultEventState: z.string(), //.regex(/^[A-Z]{2}$/),
  defaultEventCity: z.string(),
  defaultEventAddress: z.string(),
  defaultEventZip: z.string(), //.regex(/^\d{5}$/),
  defaultContactName: z.string(),
  defaultContactEmail: z.string().email(),
  defaultContactPhone: z.string(),
  invitedAdmins: z.array(z.string().email()).optional(),
  originalAdminEmail: z.string().email(),
  active: z.boolean().optional(),
  eventSilver: z.number().optional(),
  eventGold: z.number().optional(),
  hoursSilver: z.number().optional(),
  hoursGold: z.number().optional(),
});
export type OrganizationInputData = z.infer<typeof organizationInputValidator>;
