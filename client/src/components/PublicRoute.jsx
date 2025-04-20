import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Loader from "./Loader";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading.getMe) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Render the public route component for non-authenticated users
  return children;
}

export default PublicRoute;
