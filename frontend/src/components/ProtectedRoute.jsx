import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Loader from './Loader.jsx';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader message="Loading your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
