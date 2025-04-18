import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Loader from "./Loader";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading.getMe) return <Loader />;

  return isAuthenticated ? <Navigate to="/profile" /> : children;
}

export default PublicRoute;
