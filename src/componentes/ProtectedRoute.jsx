import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

console.log("PROTECTED ROUTE FILE LOADED");

const ProtectedRoute = ({ roles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log("🛡️ ProtectedRoute");
  console.log("📍 Ruta:", location.pathname);
  console.log("👤 User:", user);

  if (!isAuthenticated) {
    console.log("⛔ No autenticado");
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    console.log("⛔ Rol no autorizado");
    return <Navigate to="/home" replace />;
  }

  console.log("✅ Acceso permitido");
  return children;
};

export default ProtectedRoute;
