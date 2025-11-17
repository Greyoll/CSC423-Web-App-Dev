import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Login from './auth/Login';
import DashboardPatient from './pages/DashboardPatient';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardAdmin from './pages/DashboardAdmin';
import AppointmentViewPatient from './pages/AppointmentViewPatient';
import AppointmentViewDoctor from './pages/AppointmentViewDoctor';
import AppointmentViewAdmin from './pages/AppointmentViewAdmin';
import UserManagementViewAdmin from './pages/UserManagementViewAdmin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Parse token safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.role) {
          setUserRole(payload.role);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={
            isLoggedIn && userRole ? (
              <Navigate to={`/${userRole}/dashboard`} replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />

        {/* Patient Routes */}
        <Route 
          path="/patient/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['patient']} userRole={userRole}>
              <DashboardPatient onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/appointments" 
          element={
            <ProtectedRoute allowedRoles={['patient']} userRole={userRole}>
              <AppointmentViewPatient onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Doctor Routes */}
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['doctor']} userRole={userRole}>
              <DashboardDoctor onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/appointments" 
          element={
            <ProtectedRoute allowedRoles={['doctor']} userRole={userRole}>
              <AppointmentViewDoctor onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']} userRole={userRole}>
              <DashboardAdmin onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/appointments" 
          element={
            <ProtectedRoute allowedRoles={['admin']} userRole={userRole}>
              <AppointmentViewAdmin onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']} userRole={userRole}>
              <UserManagementViewAdmin onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            isLoggedIn && userRole ? (
              <Navigate to={`/${userRole}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all */}
        <Route 
          path="*" 
          element={
            isLoggedIn && userRole ? (
              <Navigate to={`/${userRole}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
