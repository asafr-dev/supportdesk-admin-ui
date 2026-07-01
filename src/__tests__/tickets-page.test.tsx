import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TicketsPage } from "@/routes/TicketsPage";

const { listTickets } = vi.hoisted(() => ({
  listTickets: vi.fn()
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    listTickets,
    toApiError: actual.toApiError
  };
});

function renderPage(initialEntry = "/tickets?status=open&q=printer&limit=10&offset=0") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { gcTime: 0 }
    }
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]} future={routerFuture}>
        <Routes>
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
} as const;

describe("TicketsPage", () => {
  it("renders fetched ticket rows from the current filters", async () => {
    listTickets.mockResolvedValue({
      data: [
        {
          id: 7,
          title: "Printer is jammed",
          description: "Floor 3",
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      requestId: "req-list"
    });

    renderPage();

    expect(await screen.findByText('Tickets (Open, q="printer")')).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Printer is jammed" })).toHaveAttribute(
      "href",
      "/tickets/7"
    );
    await waitFor(() => {
      expect(listTickets).toHaveBeenCalledWith({
        status: "open",
        q: "printer",
        limit: 10,
        offset: 0
      });
    });
  });
});
