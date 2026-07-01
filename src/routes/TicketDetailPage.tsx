import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge, Button, Card, Select, Skeleton } from "@/components/ui";
import { getTicket, patchStatus, toApiError } from "@/lib/api";
import { StatusPatch, TicketStatus, ticketStatusLabel, ticketStatusTone } from "@/lib/schemas";
import { useToast } from "@/lib/useToast";

type TicketDetailResult = Awaited<ReturnType<typeof getTicket>>;
type TicketDetailData = TicketDetailResult["data"];

export function TicketDetailPage() {
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
    enabled: validId,
    queryFn: async () => getTicket(tid)
  });

  const mutation = useMutation({
    mutationFn: async (body: StatusPatch) => patchStatus(tid, body),
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
    return <InvalidTicketCard />;
  }

  const ticket = q.data?.data;
  const requestId = q.data?.requestId;
  const title = ticket ? `Ticket #${ticket.id}` : "Ticket";

  return (
    <div className="grid gap-4">
      <Card title={title}>
        <TicketHeader
          ticket={ticket}
          requestId={requestId}
          isLoading={q.isLoading}
          isSaving={mutation.isPending}
          nextStatus={nextStatus}
          onNextStatusChange={setNextStatus}
          onSave={(status) => mutation.mutate({ status })}
        />

        <TicketDescription
          description={ticket?.description}
          isLoading={q.isLoading}
          isError={q.isError}
          error={q.error}
        />

        <div className="mt-4 text-sm">
          <Link to="/tickets">← Back to tickets</Link>
        </div>
      </Card>
    </div>
  );
}

function InvalidTicketCard() {
  return (
    <Card title="Ticket">
      <div className="text-sm text-zinc-700">Invalid ticket id.</div>
      <div className="mt-3 text-sm">
        <Link to="/tickets">← Back to tickets</Link>
      </div>
    </Card>
  );
}

type TicketHeaderProps = {
  ticket?: TicketDetailData;
  requestId?: string;
  isLoading: boolean;
  isSaving: boolean;
  nextStatus: TicketStatus | "";
  onNextStatusChange: (status: TicketStatus) => void;
  onSave: (status: TicketStatus) => void;
};

function TicketHeader({
  ticket,
  requestId,
  isLoading,
  isSaving,
  nextStatus,
  onNextStatusChange,
  onSave
}: TicketHeaderProps) {
  const currentStatus = ticket?.status ?? "";
  const effectiveNext = nextStatus || currentStatus;
  const parsedNext = TicketStatus.safeParse(effectiveNext);
  const canSave = parsedNext.success && parsedNext.data !== currentStatus;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-lg font-semibold">
          {isLoading ? <Skeleton className="h-6 w-72" /> : ticket?.title}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
          {ticket ? (
            <Badge tone={ticketStatusTone(ticket.status)}>{ticketStatusLabel(ticket.status)}</Badge>
          ) : null}
          {requestId ? <span className="text-xs text-zinc-500">req: {requestId}</span> : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={effectiveNext}
          onChange={(e) => onNextStatusChange(e.target.value as TicketStatus)}
          disabled={!ticket || isSaving}
        >
          {TicketStatus.options.map((status) => (
            <option key={status} value={status}>
              {ticketStatusLabel(status)}
            </option>
          ))}
        </Select>
        <Button
          variant="ghost"
          disabled={!ticket || !canSave || isSaving}
          onClick={() => {
            if (parsedNext.success) {
              onSave(parsedNext.data);
            }
          }}
        >
          {isSaving ? "Saving…" : "Update"}
        </Button>
      </div>
    </div>
  );
}

type TicketDescriptionProps = {
  description?: string;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
};

function TicketDescription({ description, isLoading, isError, error }: TicketDescriptionProps) {
  return (
    <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-800 ring-1 ring-zinc-200">
      {isLoading ? (
        <div className="grid gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : isError ? (
        <div className="text-rose-700">{toApiError(error).message}</div>
      ) : description ? (
        description
      ) : (
        <span className="text-zinc-500">No description.</span>
      )}
    </div>
  );
}
