import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { LoginPage } from "@/routes/LoginPage";
import { TicketsPage } from "@/routes/TicketsPage";
import { TicketDetailPage } from "@/routes/TicketDetailPage";
import { RequireAuth } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/tickets" replace />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/tickets" replace />} />
      </Routes>
    </ToastProvider>
  );
}
