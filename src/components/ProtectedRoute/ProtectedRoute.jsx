import { Navigate, Outlet } from "react-router-dom";
import { useAuthUser } from "../../context/authUserContext";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuthUser();

  if (loading) {
    return;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // renders nested routes (like /admin/boarders)
};

export default ProtectedRoute;
