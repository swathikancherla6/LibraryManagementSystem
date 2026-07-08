import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../utils/constants';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length) {
    const userRoles = user?.roles ? Array.from(user.roles) : [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export { ROLES };
