import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Input, Select, Badge, Skeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { listTickets, toApiError } from "@/lib/api";
import { TicketStatus } from "@/lib/schemas";
import { useDebouncedValue } from "@/lib/hooks";

function statusTone(s: TicketStatus): "neutral" | "green" | "yellow" {
  if (s === "resolved") return "green";
  if (s === "in_progress") return "yellow";
  return "neutral";
}

export function TicketsPage() {
  const { apiKey } = useAuth();
  const [sp, setSp] = useSearchParams();

  const status = sp.get("status") ?? "";
  const q = sp.get("q") ?? "";
  const qDebounced = useDebouncedValue(q, 250);
  const limit = Number(sp.get("limit") ?? "20");
  const offset = Number(sp.get("offset") ?? "0");

  const queryKey = ["tickets", status, qDebounced, limit, offset];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const r = await listTickets(apiKey!, {
        status: status || undefined,
        q: qDebounced || undefined,
        limit,
        offset
      });
      return r;
    }
  });

  const rows = query.data?.data ?? [];
  const requestId = query.data?.requestId;

  const canPrev = offset > 0;
  const canNext = rows.length === limit;

  const title = useMemo(() => {
    const parts = [];
    if (status) parts.push(status);
    if (qDebounced) parts.push(`q="${qDebounced}"`);
    return parts.length ? `Tickets (${parts.join(", ")})` : "Tickets";
  }, [status, qDebounced]);

  return (
    <Card title={title}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            // keep offset=0 when filtering
            const next = new URLSearchParams(sp);
            next.set("offset", "0");
            setSp(next);
          }}
        >
          <div>
            <label className="text-xs font-medium text-zinc-700">Search</label>
            <Input
              name="q"
              value={q}
              onChange={(e) => {
                const next = new URLSearchParams(sp);
                next.set("q", e.target.value);
                setSp(next, { replace: true });
              }}
              placeholder="Title contains…"
              className="w-56"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Status</label>
            <Select
              value={status}
              onChange={(e) => {
                const next = new URLSearchParams(sp);
                const v = e.target.value;
                if (!v) next.delete("status");
                else next.set("status", v);
                next.set("offset", "0");
                setSp(next, { replace: true });
              }}
            >
              <option value="">Any</option>
              {TicketStatus.options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700">Page size</label>
            <Select
              value={String(limit)}
              onChange={(e) => {
                const next = new URLSearchParams(sp);
                next.set("limit", e.target.value);
                next.set("offset", "0");
                setSp(next, { replace: true });
              }}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        </form>

        <div className="flex items-center gap-2">
          {requestId ? <span className="text-xs text-zinc-500">req: {requestId}</span> : null}
          <Button variant="ghost" onClick={() => query.refetch()} disabled={query.isFetching}>
            {query.isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      </div>

      {query.isLoading ? (
        <div className="mt-4 grid gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : query.isError ? (
        <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-800 ring-1 ring-rose-200">
          {toApiError(query.error).message}
          {toApiError(query.error).requestId ? (
            <div className="mt-1 text-xs">request: {toApiError(query.error).requestId}</div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-zinc-500">
              <tr>
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-t border-zinc-100">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-600">{t.id}</td>
                  <td className="py-2 pr-4">
                    <Link to={`/tickets/${t.id}`} className="no-underline hover:underline">
                      {t.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
                    <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  </td>
                  <td className="py-2 pr-4 text-zinc-600">
                    {new Date(t.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">
                    No tickets found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="ghost"
          disabled={!canPrev}
          onClick={() => {
            const next = new URLSearchParams(sp);
            next.set("offset", String(Math.max(0, offset - limit)));
            setSp(next, { replace: true });
          }}
        >
          Prev
        </Button>
        <div className="text-xs text-zinc-500">
          offset {offset} • limit {limit}
        </div>
        <Button
          variant="ghost"
          disabled={!canNext}
          onClick={() => {
            const next = new URLSearchParams(sp);
            next.set("offset", String(offset + limit));
            setSp(next, { replace: true });
          }}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
