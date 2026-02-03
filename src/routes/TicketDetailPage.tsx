import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge, Button, Card, Select, Skeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { getTicket, patchStatus, toApiError } from "@/lib/api";
import { StatusPatch, TicketStatus } from "@/lib/schemas";
import { useToast } from "@/lib/toast";

function tone(s: TicketStatus): "neutral" | "green" | "yellow" {
  if (s === "resolved") return "green";
  if (s === "in_progress") return "yellow";
  return "neutral";
}

export function TicketDetailPage() {
  const { apiKey } = useAuth();
  const { id } = useParams();
  const tid = Number(id);
  const validId = Number.isFinite(tid) && tid > 0;

  const qc = useQueryClient();
  const { push } = useToast();

  // Hooks must be called unconditionally; gate data-fetching with `enabled`.
  const [nextStatus, setNextStatus] = useState<TicketStatus | "">("");

  const q = useQuery({
    // Avoid NaN in query keys; TanStack hashes query keys and NaN can be surprising.
    queryKey: ["ticket", validId ? tid : "invalid"],
    enabled: Boolean(apiKey) && validId,
    queryFn: async () => getTicket(apiKey as string, tid)
  });

  const mutation = useMutation({
    mutationFn: async (body: StatusPatch) => {
      if (!apiKey) throw new Error("Missing API key");
      return patchStatus(apiKey, tid, body);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["ticket", tid] });
      await qc.invalidateQueries({ queryKey: ["tickets"] });
      push({ message: "Status updated", tone: "success" });
    },
    onError: (e) => {
      const err = toApiError(e);
      push({ message: err.message, tone: "error" });
    }
  });

  if (!validId) {
    return (
      <Card title="Ticket">
        <div className="text-sm text-zinc-700">Invalid ticket id.</div>
        <div className="mt-3 text-sm">
          <Link to="/tickets">← Back to tickets</Link>
        </div>
      </Card>
    );
  }

  const t = q.data?.data;
  const requestId = q.data?.requestId;

  const current = t?.status ?? "";
  const effectiveNext = nextStatus || current;

  const parsedNext = TicketStatus.safeParse(effectiveNext);
  const canSave = parsedNext.success && parsedNext.data !== current;

  const title = t ? `Ticket #${t.id}` : "Ticket";

  return (
    <div className="grid gap-4">
      <Card title={title}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">
              {q.isLoading ? <Skeleton className="h-6 w-72" /> : t?.title}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              {t ? <Badge tone={tone(t.status)}>{t.status}</Badge> : null}
              {requestId ? <span className="text-xs text-zinc-500">req: {requestId}</span> : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={effectiveNext}
              onChange={(e) => setNextStatus(e.target.value as TicketStatus)}
              disabled={!t || mutation.isPending}
            >
              {TicketStatus.options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Button
              variant="ghost"
              disabled={!t || !canSave || mutation.isPending}
              onClick={() => {
                if (!parsedNext.success) return;
                mutation.mutate({ status: parsedNext.data });
              }}
            >
              {mutation.isPending ? "Saving…" : "Update"}
            </Button>
          </div>
        </div>

        <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-800 ring-1 ring-zinc-200">
          {q.isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : q.isError ? (
            <div className="text-rose-700">{toApiError(q.error).message}</div>
          ) : t?.description ? (
            t.description
          ) : (
            <span className="text-zinc-500">No description.</span>
          )}
        </div>

        <div className="mt-4 text-sm">
          <Link to="/tickets">← Back to tickets</Link>
        </div>
      </Card>
    </div>
  );
}
