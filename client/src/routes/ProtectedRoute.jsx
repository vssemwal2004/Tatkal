import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const getDefaultRouteForRole = (role) => (role === 'admin' ? '/admin' : '/client/builder-entry');

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
