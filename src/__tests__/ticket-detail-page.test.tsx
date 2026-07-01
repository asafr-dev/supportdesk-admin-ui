import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TicketDetailPage } from "@/routes/TicketDetailPage";
import { ToastProvider } from "@/lib/toast";

const { getTicket, patchStatus } = vi.hoisted(() => ({
  getTicket: vi.fn(),
  patchStatus: vi.fn()
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    getTicket,
    patchStatus,
    toApiError: actual.toApiError
  };
});

function renderPage(initialEntry = "/tickets/7") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { gcTime: 0 }
    }
  });
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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
} as const;

describe("TicketDetailPage", () => {
  it("renders ticket details and submits a status update", async () => {
    getTicket.mockResolvedValue({
      data: {
        id: 7,
        title: "Printer is jammed",
        description: "Floor 3",
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      requestId: "req-ticket"
    });
    patchStatus.mockResolvedValueOnce({
      data: {
        id: 7,
        title: "Printer is jammed",
        description: "Floor 3",
        status: "resolved",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      requestId: "req-patch"
    });

    renderPage();

    expect(await screen.findByText("Printer is jammed")).toBeInTheDocument();
    expect(screen.getByText(/req: req-ticket/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "resolved" } });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(patchStatus).toHaveBeenCalledWith(7, { status: "resolved" });
    });
  });

  it("shows an invalid-id fallback", () => {
    renderPage("/tickets/not-a-number");

    expect(screen.getByText(/invalid ticket id/i)).toBeInTheDocument();
  });
});
