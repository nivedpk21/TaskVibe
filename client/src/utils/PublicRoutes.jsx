import { Navigate, Outlet } from "react-router-dom";
import { getAuthData } from "./auth";

const PublicRoutes = () => {
  const { isAuthenticated, role } = getAuthData();

  if (isAuthenticated) {
    if (role === "user") {
      return <Navigate to="/user/dashboard" />;
    }
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  return <Outlet />;
};

export default PublicRoutes;
