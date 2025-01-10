import { Outlet, Navigate } from "react-router-dom";
import { getAuthData } from "./auth";

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, role } = getAuthData();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  // eslint-disable-next-line react/prop-types
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
