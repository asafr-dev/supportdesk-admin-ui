import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TicketDetailPage } from "@/routes/TicketDetailPage";
import { ToastProvider } from "@/lib/toast";

const { getTicket, patchStatus } = vi.hoisted(() => ({ getTicket: vi.fn(), patchStatus: vi.fn() }));
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, getTicket, patchStatus, toApiError: actual.toApiError };
});

function renderPage(initialEntry = "/tickets/7") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <MemoryRouter initialEntries={[initialEntry]} future={routerFuture}>
          <Routes>
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TicketDetailPage branches", () => {
  it("covers missing description and error state", async () => {
    getTicket.mockResolvedValueOnce({
      data: {
        id: 7,
        title: "Printer",
        description: "",
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      requestId: undefined
    });
    renderPage();
    expect(await screen.findByText(/No description/i)).toBeInTheDocument();

    getTicket.mockRejectedValueOnce(new Error("Nope"));
    renderPage("/tickets/8");
    expect(await screen.findByText("Nope")).toBeInTheDocument();
  });
});
