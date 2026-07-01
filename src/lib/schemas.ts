import { z } from "zod";

export const TicketStatus = z.enum(["open", "in_progress", "resolved"]);
export type TicketStatus = z.infer<typeof TicketStatus>;

export const TICKET_STATUS_OPTIONS: ReadonlyArray<{
  value: TicketStatus;
  label: string;
  tone: "neutral" | "green" | "yellow";
}> = [
  { value: "open", label: "Open", tone: "neutral" },
  { value: "in_progress", label: "In progress", tone: "yellow" },
  { value: "resolved", label: "Resolved", tone: "green" }
] as const;

export function ticketStatusLabel(s: TicketStatus): string {
  return TICKET_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}

export function ticketStatusTone(s: TicketStatus): "neutral" | "green" | "yellow" {
  return TICKET_STATUS_OPTIONS.find((o) => o.value === s)?.tone ?? "neutral";
}

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
