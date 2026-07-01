import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { Badge, Button, Card, Input, Select, Skeleton } from "@/components/ui";
import { ToastProvider } from "@/lib/toast";
import { useToast } from "@/lib/useToast";

function ToastHarness() {
  const { push } = useToast();
  return <button onClick={() => push({ message: "Saved", tone: "success" })}>Push toast</button>;
}

describe("ui + toast", () => {
  it("covers Card/Button/Input/Select/Badge/Skeleton branches", () => {
    const { container } = render(
      <div>
        <Card title="With title">Body</Card>
        <Card>Body 2</Card>
        <Button>Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Input className="custom-input" defaultValue="hello" />
        <Select className="custom-select" defaultValue="a">
          <option value="a">A</option>
        </Select>
        <Badge tone="neutral">N</Badge>
        <Badge tone="green">G</Badge>
        <Badge tone="yellow">Y</Badge>
        <Skeleton className="h-4" />
      </div>
    );

    expect(screen.getByText("With title")).toBeInTheDocument();
    expect(screen.getByText("Body 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Primary" }).className).toContain("bg-zinc-900");
    expect(screen.getByRole("button", { name: "Ghost" }).className).toContain("bg-transparent");
    expect(screen.getByRole("button", { name: "Danger" }).className).toContain("bg-rose-600");
    expect(container.querySelector("input.custom-input")).toBeTruthy();
    expect(container.querySelector("select.custom-select")).toBeTruthy();
    expect(screen.getByText("G").className).toContain("emerald");
    expect(screen.getByText("Y").className).toContain("amber");
    expect(screen.getByText("N").className).toContain("zinc");
    expect(container.querySelector(".animate-pulse.h-4")).toBeTruthy();
  });

  it("shows/removes toasts and throws when provider is missing", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /push toast/i }));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3001);
    });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    vi.useRealTimers();

    function Broken() {
      useToast();
      return null;
    }
    expect(() => render(<Broken />)).toThrow(/ToastProvider missing/);
  });
});
