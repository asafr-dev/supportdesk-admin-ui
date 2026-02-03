import { TicketList, TicketOut, StatusPatch } from "@/lib/schemas";
import { z } from "zod";

export type ApiError = { status: number; message: string; requestId?: string };

export function toApiError(e: unknown): ApiError {
  if (typeof e === "object" && e !== null) {
    const anyE = e as Record<string, unknown>;
    const message = typeof anyE.message === "string" ? anyE.message : undefined;
    const status = typeof anyE.status === "number" ? anyE.status : 0;
    const requestId = typeof anyE.requestId === "string" ? anyE.requestId : undefined;
    if (message) return { status, message, requestId };
  }
  if (e instanceof Error) return { status: 0, message: e.message };
  if (typeof e === "string") return { status: 0, message: e };
  return { status: 0, message: "Request failed" };
}

const baseUrl = (() => {
  const v = import.meta.env.VITE_API_BASE_URL;
  return typeof v === "string" && v.length > 0 ? v : "http://localhost:8000";
})();

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const u = new URL(path, baseUrl);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === "") return;
    u.searchParams.set(k, String(v));
  });
  return u.toString();
}

async function request<T>(
  apiKey: string,
  input: RequestInfo,
  init: RequestInit | undefined,
  schema: z.ZodType<T>
): Promise<{ data: T; requestId?: string }> {
  let res: Response;
  try {
    res = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        ...(init?.headers ?? {})
      }
    });
  } catch {
    throw { status: 0, message: "Network error (API unreachable)" } satisfies ApiError;
  }

  const requestId = res.headers.get("X-Request-ID") ?? undefined;

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      if (typeof j?.detail === "string") message = j.detail;
      if (typeof j?.error === "string") message = j.error;
    } catch {
      // ignore
    }
    throw { status: res.status, message, requestId } satisfies ApiError;
  }

  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw { status: 500, message: "Invalid API response shape", requestId } satisfies ApiError;
  }
  return { data: parsed.data, requestId };
}

export async function health() {
  try {
    const res = await fetch(new URL("/health", baseUrl).toString(), { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function validateKey(apiKey: string) {
  // /health is public in the API service; validate by hitting an auth-protected endpoint.
  const url = withQuery("/tickets", { limit: 1, offset: 0 });
  try {
    const res = await fetch(url, { method: "GET", headers: { "X-API-Key": apiKey } });
    return res.ok;
  } catch {
    return false;
  }
}

export async function listTickets(
  apiKey: string,
  args: { status?: string; q?: string; limit?: number; offset?: number }
) {
  const url = withQuery("/tickets", {
    status: args.status,
    q: args.q,
    limit: args.limit ?? 20,
    offset: args.offset ?? 0
  });
  return request(apiKey, url, { method: "GET" }, TicketList);
}

export async function getTicket(apiKey: string, id: number) {
  const url = new URL(`/tickets/${id}`, baseUrl).toString();
  return request(apiKey, url, { method: "GET" }, TicketOut);
}

export async function patchStatus(apiKey: string, id: number, body: StatusPatch) {
  const url = new URL(`/tickets/${id}/status`, baseUrl).toString();
  return request(apiKey, url, { method: "PATCH", body: JSON.stringify(body) }, TicketOut);
}
