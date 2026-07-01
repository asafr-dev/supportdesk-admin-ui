import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/AppShell";

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
} as const;

describe("AppShell", () => {
  it("renders brand, tickets nav, outlet content, and footer copy", () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]} future={routerFuture}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route path="tickets" element={<div>Tickets route content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("SupportDesk Admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tickets/i })).toHaveAttribute("href", "/tickets");
    expect(screen.getByText("Tickets route content")).toBeInTheDocument();
    expect(
      screen.getByText(/Admin UI \(React\/Vite\) talking to the FastAPI service\./i)
    ).toBeInTheDocument();
  });
});
