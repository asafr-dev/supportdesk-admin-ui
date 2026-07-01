import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TicketsPage } from "@/routes/TicketsPage";

const { listTickets, toApiError } = vi.hoisted(() => ({
  listTickets: vi.fn(),
  toApiError: vi.fn((e: unknown) => ({
    status: 500,
    message: e instanceof Error ? e.message : "Boom",
    requestId: "req-err"
  }))
}));

vi.mock("@/lib/hooks", () => ({ useDebouncedValue: (v: string) => v }));
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, listTickets, toApiError };
});

function renderPage(initialEntry = "/tickets?status=bad_status&q=&limit=10&offset=10") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } }
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

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TicketsPage branches", () => {
  it("covers invalid status title, empty rows, and paging/filter controls", async () => {
    listTickets
      .mockResolvedValueOnce({ data: [], requestId: "req-empty" })
      .mockResolvedValue({ data: [], requestId: "req-empty" });

    renderPage();

    expect(await screen.findByText("Tickets (bad_status)")).toBeInTheDocument();
    expect(await screen.findByText(/No tickets found/i)).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => el?.textContent === "offset 10 • limit 10")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /prev/i }));
    await waitFor(() => {
      expect(
        screen.getByText((_, el) => el?.textContent === "offset 0 • limit 10")
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Title contains/i), {
      target: { value: "printer" }
    });
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "open" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "20" } });

    await waitFor(() => {
      expect(listTickets).toHaveBeenLastCalledWith({
        status: "open",
        q: "printer",
        limit: 20,
        offset: 0
      });
    });
  });

  it("covers the error UI branch", async () => {
    listTickets.mockRejectedValueOnce(new Error("API exploded"));
    renderPage("/tickets?offset=0&limit=10");
    expect(await screen.findByText("API exploded")).toBeInTheDocument();
    expect(screen.getByText(/request: req-err/i)).toBeInTheDocument();
  });
});
