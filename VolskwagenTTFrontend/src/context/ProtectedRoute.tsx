import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { player } = useAuth();

  if (!player) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
