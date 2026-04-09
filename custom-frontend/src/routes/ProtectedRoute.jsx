import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role = 'client' }) => {
  const { isAuthenticated, role: currentRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (role && currentRole !== role) {
    return <Navigate replace to="/" />;
  }

  return children;
};

export default ProtectedRoute;
