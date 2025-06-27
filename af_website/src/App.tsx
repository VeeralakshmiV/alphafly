import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chatbot from './components/chatbot';
import RequireAuth from "@/components/auth/RequireAuth";
import AuthPage from "./pages/AuthPage";
// Update the import path and casing if the file is named differently, e.g. 'AdminDashboard.tsx' or 'adminDashboard.tsx'
import AdminDashboard from './components/dashboards/AdminDashboard'; // Adjust the import path as necessary
// If the file is actually named 'adminDashboard.tsx', use:
// import AdminDashboard from './pages/admin/adminDashboard';
// Or adjust the path to match the actual file location and name.
import StaffDashboard from './components/dashboards/StaffDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';

const queryClient = new QueryClient();

function ChatbotWrapper() {
  const location = useLocation();
  return location.pathname === "/" ? <Chatbot /> : null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Index />
              </RequireAuth>
            }
          />
          <Route
  path="/admin/dashboard"
  element={
    <RequireAuth>
      <AdminDashboard onLogout={() => window.location.href = '/login'} />
    </RequireAuth>
  }
/>

<Route
  path="/staff/dashboard"
  element={
    <RequireAuth>
      <StaffDashboard onLogout={() => window.location.href = '/login'} />
    </RequireAuth>
  }
/>

<Route
  path="/student/dashboard"
  element={
    <RequireAuth>
      <StudentDashboard onLogout={() => window.location.href = '/login'} />
    </RequireAuth>
  }
/>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
