import { z } from "zod";

export const TicketStatus = z.enum(["open", "in_progress", "resolved"]);
export type TicketStatus = z.infer<typeof TicketStatus>;

export const TicketOut = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  status: TicketStatus,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});
export type TicketOut = z.infer<typeof TicketOut>;

export const TicketList = z.array(TicketOut);

export const StatusPatch = z.object({
  status: TicketStatus
});
export type StatusPatch = z.infer<typeof StatusPatch>;
