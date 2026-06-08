import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "./LoadingState";
import { isJwtExpired } from "../utils/authToken";

function ProtectedRoute({ children }) {
  const { isAuthenticated, token, logout, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <LoadingState label="Restoring secure session" />;
  }

  if (token && isJwtExpired(token)) {
    logout("expired");
    return <Navigate to="/admin/login" state={{ from: location, expired: true }} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
