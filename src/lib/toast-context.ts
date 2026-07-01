import { createContext } from "react";

export type Toast = { id: string; message: string; tone?: "neutral" | "success" | "error" };

export type ToastCtx = {
  push: (t: Omit<Toast, "id">) => void;
};

export const ToastContext = createContext<ToastCtx | null>(null);
