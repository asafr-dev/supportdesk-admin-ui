import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/routes/TicketsPage", () => ({ TicketsPage: () => <div>Tickets page mock</div> }));
vi.mock("@/routes/TicketDetailPage", () => ({
  TicketDetailPage: () => <div>Ticket detail mock</div>
}));

import { App } from "@/app/App";

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
} as const;

describe("App routes", () => {
  it("redirects / and unknown routes to /tickets, and renders ticket detail route", async () => {
    const first = render(
      <MemoryRouter initialEntries={["/"]} future={routerFuture}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText("Tickets page mock")).toBeInTheDocument();
    first.unmount();

    const second = render(
      <MemoryRouter initialEntries={["/missing"]} future={routerFuture}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText("Tickets page mock")).toBeInTheDocument();
    second.unmount();

    render(
      <MemoryRouter initialEntries={["/tickets/7"]} future={routerFuture}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText("Ticket detail mock")).toBeInTheDocument();
  });
});
