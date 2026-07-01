import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/AppShell";
import { clampPagination, DEFAULT_LIMIT, MAX_LIMIT } from "@/lib/pagination";
import {
  StatusPatch,
  TicketList,
  TicketOut,
  ticketStatusLabel,
  ticketStatusTone
} from "@/lib/schemas";
import { useToast } from "@/lib/useToast";

function MissingToastHarness() {
  useToast();
  return null;
}

describe("helpers + shell branches", () => {
  it("covers AppShell active nav/outlet rendering", () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/tickets" element={<div>Outlet body</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("SupportDesk Admin")).toBeInTheDocument();
    expect(screen.getByText("Outlet body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tickets/i }).className).toContain("bg-zinc-100");
    expect(screen.getByText(/Admin UI \(React\/Vite\)/i)).toBeInTheDocument();
  });

  it("covers pagination clamps and schema helper fallbacks", () => {
    expect(clampPagination({ limit: Number.POSITIVE_INFINITY, offset: Number.NaN })).toEqual({
      limit: DEFAULT_LIMIT,
      offset: 0
    });
    expect(clampPagination({ limit: 0, offset: -5 })).toEqual({ limit: 1, offset: 0 });
    expect(clampPagination({ limit: 999, offset: 2.9 })).toEqual({ limit: MAX_LIMIT, offset: 2 });

    expect(ticketStatusLabel("resolved")).toBe("Resolved");
    expect(ticketStatusTone("in_progress")).toBe("yellow");
    expect(ticketStatusLabel("unknown" as never)).toBe("unknown");
    expect(ticketStatusTone("unknown" as never)).toBe("neutral");

    const ticket = {
      id: 1,
      title: "Printer",
      description: "Jam",
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    expect(TicketOut.safeParse(ticket).success).toBe(true);
    expect(TicketList.safeParse([ticket]).success).toBe(true);
    expect(StatusPatch.safeParse({ status: "resolved" }).success).toBe(true);
    expect(StatusPatch.safeParse({ status: "bad" }).success).toBe(false);
  });

  it("covers the missing-provider branch for useToast", () => {
    expect(() => render(<MissingToastHarness />)).toThrow(/ToastProvider missing/i);
  });
});
