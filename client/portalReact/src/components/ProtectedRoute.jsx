import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, userRole, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if user is logged in
  if (!isLoggedIn || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the right role
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
}

export default ProtectedRoute;