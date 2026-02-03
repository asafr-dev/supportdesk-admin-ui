import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Ticket } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export function AppShell() {
  const nav = useNavigate();
  const { clearApiKey, apiKey } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white">
              SupportDesk Admin
            </div>
            <nav className="flex items-center gap-1">
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm no-underline hover:bg-zinc-100 ${isActive ? "bg-zinc-100" : ""}`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <Ticket size={16} /> Tickets
                </span>
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-zinc-500 md:inline">
              key: {apiKey ? apiKey.slice(0, 6) + "…" : "-"}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                clearApiKey();
                nav("/login");
              }}
            >
              <span className="inline-flex items-center gap-2">
                <LogOut size={16} /> Logout
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-xs text-zinc-500">
        Admin UI (React/Vite) talking to the FastAPI service.
      </footer>
    </div>
  );
}
