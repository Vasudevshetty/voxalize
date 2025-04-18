import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Loader from "./Loader";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading.getMe) return <Loader />;

  return isAuthenticated ? children : <Navigate to="/auth/login" />;
}

export default PrivateRoute;
