import React, { createContext, useContext, useMemo, useState } from "react";
import { clsx } from "clsx";

type Toast = { id: string; message: string; tone?: "neutral" | "success" | "error" };

type ToastCtx = {
  push: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider(props: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000);
  };

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastContext.Provider value={value}>
      {props.children}
      <div className="fixed bottom-4 right-4 z-50 grid gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "max-w-sm rounded-2xl px-3 py-2 text-sm shadow-lg ring-1",
              t.tone === "success"
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                : t.tone === "error"
                  ? "bg-rose-50 text-rose-800 ring-rose-200"
                  : "bg-white text-zinc-800 ring-zinc-200"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}
