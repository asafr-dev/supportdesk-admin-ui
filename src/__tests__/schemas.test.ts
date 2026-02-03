import { describe, it, expect } from "vitest";
import { TicketOut } from "@/lib/schemas";

describe("schemas", () => {
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
