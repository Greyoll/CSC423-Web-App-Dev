import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles, userRole }) {
  const token = localStorage.getItem("token");

  // No token → force login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Invalid/missing role → clear token and redirect
  if (!userRole) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
}

export default ProtectedRoute;
