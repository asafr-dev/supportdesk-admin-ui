import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { TicketsPage } from "@/routes/TicketsPage";
import { TicketDetailPage } from "@/routes/TicketDetailPage";
import { ToastProvider } from "@/lib/toast";

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/tickets" replace />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/tickets" replace />} />
      </Routes>
    </ToastProvider>
  );
}
