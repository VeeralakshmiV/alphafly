import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to login, preserve where user was going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
