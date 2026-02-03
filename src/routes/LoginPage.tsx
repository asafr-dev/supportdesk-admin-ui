import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { health, validateKey } from "@/lib/api";

function nextFromLocationState(state: unknown): string | null {
  if (!state || typeof state !== "object") return null;
  const from = (state as { from?: unknown }).from;
  return typeof from === "string" ? from : null;
}

export function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { setApiKey } = useAuth();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = nextFromLocationState(loc.state) ?? "/tickets";

  return (
    <div className="mx-auto max-w-md py-10">
      <Card title="Admin login (API key)">
        <p className="text-sm text-zinc-600">
          This UI uses the FastAPI service. Paste your API key (header <code>X-API-Key</code>).
        </p>

        <div className="mt-4 grid gap-2">
          <label className="text-xs font-medium text-zinc-700" htmlFor="apiKey">
            API Key
          </label>
          <Input
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="dev-key-change-me"
            autoComplete="off"
          />
          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
          <Button
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const apiUp = await health();
                if (!apiUp) {
                  setError("API is not reachable. Start the FastAPI service first.");
                  return;
                }
                const ok = await validateKey(key);
                if (!ok) {
                  setError("Key rejected. Check API_KEY in the FastAPI service.");
                  return;
                }
                setApiKey(key);
                nav(next, { replace: true });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || key.trim().length === 0}
          >
            {loading ? "Checking…" : "Continue"}
          </Button>

          <p className="text-xs text-zinc-500">
            Tip: set defaults in <code>.env</code> (VITE_DEFAULT_API_KEY).
          </p>
        </div>
      </Card>
    </div>
  );
}
