import { afterEach, describe, expect, it, vi } from "vitest";

import { health, listTickets, toApiError } from "@/lib/api";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

describe("api extra branches", () => {
  it("covers object/error fallbacks, health true, invalid schema, and generic status text", async () => {
    expect(toApiError({ status: 418, message: "Teapot", requestId: "req-1" })).toEqual({
      status: 418,
      message: "Teapot",
      requestId: "req-1"
    });
    expect(toApiError(new Error("Boom"))).toEqual({ status: 0, message: "Boom" });
    expect(toApiError({ nope: true })).toEqual({ status: 0, message: "Request failed" });

    fetchMock.mockResolvedValueOnce({ ok: true });
    expect(await health()).toBe(true);

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: async () => ({}),
      headers: new Headers()
    });
    await expect(listTickets({})).rejects.toEqual({
      status: 500,
      message: "500 Server Error",
      requestId: undefined
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bad: true }),
      headers: new Headers({ "X-Request-ID": "req-bad" })
    });
    await expect(listTickets({})).rejects.toEqual({
      status: 500,
      message: "Invalid API response shape",
      requestId: "req-bad"
    });
  });
});
