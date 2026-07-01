import { describe, it, expect } from "vitest";
import { TicketOut, TicketStatus, TICKET_STATUS_OPTIONS, ticketStatusTone } from "@/lib/schemas";

describe("schemas", () => {
  it("pins status options + tones", () => {
    expect(TicketStatus.options).toEqual(["open", "in_progress", "resolved"]);
    expect(TICKET_STATUS_OPTIONS.map((o) => o.value)).toEqual(TicketStatus.options);
    expect(ticketStatusTone("open")).toBe("neutral");
    expect(ticketStatusTone("in_progress")).toBe("yellow");
    expect(ticketStatusTone("resolved")).toBe("green");
  });

  it("validates ticket shape", () => {
    const ok = TicketOut.safeParse({
      id: 1,
      title: "Test",
      description: "",
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    expect(ok.success).toBe(true);
  });
});
