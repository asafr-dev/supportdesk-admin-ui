import { afterEach, describe, expect, it, vi } from "vitest";

import { getTicket, health, listTickets, patchStatus, toApiError } from "@/lib/api";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

describe("api client", () => {
  it("builds clamped ticket list queries and parses the response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Printer issue",
          description: "Paper jam",
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      headers: new Headers({ "X-Request-ID": "req-1" })
    });

    const result = await listTickets({ status: "open", q: "printer", limit: 999, offset: -5 });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tickets?status=open&q=printer&limit=100&offset=0",
      expect.objectContaining({ method: "GET" })
    );
    expect(result.requestId).toBe("req-1");
    expect(result.data[0]?.title).toBe("Printer issue");
  });

  it("surfaces API request ids and network errors", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        json: async () => ({ detail: "Bad status" }),
        headers: new Headers({ "X-Request-ID": "req-422" })
      })
      .mockRejectedValueOnce(new Error("boom"));

    await expect(patchStatus(1, { status: "resolved" })).rejects.toEqual({
      status: 422,
      message: "Bad status",
      requestId: "req-422"
    });
    await expect(getTicket(99)).rejects.toEqual({
      status: 0,
      message: "Network error (API unreachable)"
    });
  });

  it("maps unknown errors into stable API errors and health falls back to false", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));

    expect(toApiError("oops")).toEqual({ status: 0, message: "oops" });
    expect(await health()).toBe(false);
  });
});
