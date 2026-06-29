import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * Parses JWT token payload from Base64Url representation.
 */
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!token || !isAuthenticated) {
      localStorage.clear();
      toast.error("Session missing. Please log in.");
      navigate("/login");
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded) {
      localStorage.clear();
      toast.error("Session invalid. Please log in.");
      navigate("/login");
      return;
    }

    // Check expiration (exp is in seconds, convert to ms)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    // Check role authorization
    const userRole = decoded.role;
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      toast.error(`Unauthorized access attempt.`);
      navigate(`/${userRole}/dashboard`);
    }
  }, [token, isAuthenticated, allowedRoles, navigate]);

  if (!token || !isAuthenticated) {
    return null;
  }

  const decoded = parseJwt(token);
  if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
    return null;
  }

  const userRole = decoded.role;
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
