import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../context/authUserContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (user?.role === "admin" || user?.role === "owner")) {
      navigate("/admin/boarders", { replace: true });
    }
  }, [loading, user, navigate]);

  return children;
}
