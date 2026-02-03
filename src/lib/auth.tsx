import React, { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const STORAGE_KEY = "sd_admin_api_key";

type AuthCtx = {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

function defaultKeyFromEnv() {
  const k = import.meta.env.VITE_DEFAULT_API_KEY;
  return typeof k === "string" && k.length > 0 ? k : null;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    return fromStorage ?? defaultKeyFromEnv();
  });

  const value = useMemo<AuthCtx>(
    () => ({
      apiKey,
      setApiKey: (key: string) => {
        localStorage.setItem(STORAGE_KEY, key);
        setApiKeyState(key);
      },
      clearApiKey: () => {
        localStorage.removeItem(STORAGE_KEY);
        setApiKeyState(null);
      }
    }),
    [apiKey]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}

export function RequireAuth(props: { children: React.ReactNode }) {
  const { apiKey } = useAuth();
  const location = useLocation();
  if (!apiKey) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{props.children}</>;
}
