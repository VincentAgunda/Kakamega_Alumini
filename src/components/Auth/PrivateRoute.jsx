// FIX: Import Outlet from react-router-dom
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// FIX: The 'children' prop is no longer needed
export default function PrivateRoute() {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only check approval for non-admin users
  if (userData?.role !== 'admin' && !userData?.isApproved) {
    return <Navigate to="/pending-approval" state={{ from: location }} replace />;
  }

  // FIX: Return <Outlet /> to render the nested child routes (like UserDashboard)
  return <Outlet />;
}