import { TicketList, TicketOut, StatusPatch, type TicketStatus } from "@/lib/schemas";
import { z } from "zod";
import { clampPagination } from "@/lib/pagination";

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

// IMPORTANT:
// - Frontend code always calls same-origin /api/*.
// - Dev: Vite proxy forwards /api/* -> API (for HMR).
// - Prod: Nginx forwards /api/* -> API.
const API_PREFIX = "/api";

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === "") continue;
      qs.set(k, String(v));
    }
  }
  const q = qs.toString();
  return `${API_PREFIX}${path}${q ? `?${q}` : ""}`;
}

async function request<T>(path: string, init: RequestInit | undefined, schema: z.ZodType<T>) {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
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
      const j: unknown = await res.json();
      if (typeof j === "object" && j !== null) {
        const obj = j as Record<string, unknown>;
        const detail = obj.detail;
        const error = obj.error;
        if (typeof detail === "string") message = detail;
        if (typeof error === "string") message = error;
      }
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
    const res = await fetch(buildUrl("/health"), { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function listTickets(args: {
  status?: TicketStatus;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const { limit, offset } = clampPagination({ limit: args.limit, offset: args.offset });
  const url = buildUrl("/tickets", {
    status: args.status,
    q: args.q,
    limit,
    offset
  });
  return request(url, { method: "GET" }, TicketList);
}

export async function getTicket(id: number) {
  const url = buildUrl(`/tickets/${id}`);
  return request(url, { method: "GET" }, TicketOut);
}

export async function patchStatus(id: number, body: StatusPatch) {
  const url = buildUrl(`/tickets/${id}/status`);
  return request(url, { method: "PATCH", body: JSON.stringify(body) }, TicketOut);
}
