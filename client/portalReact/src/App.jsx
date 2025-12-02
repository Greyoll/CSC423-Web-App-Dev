import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './auth/Login';
import DashboardPatient from './pages/DashboardPatient';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardAdmin from './pages/DashboardAdmin';
import AppointmentViewPatient from './pages/AppointmentViewPatient';
import AppointmentViewDoctor from './pages/AppointmentViewDoctor';
import AppointmentViewAdmin from './pages/AppointmentViewAdmin';
import UserManagementViewAdmin from './pages/UserManagementViewAdmin';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import Sidebar from './components/Sidebar.jsx';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <NotificationDisplay />
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />

      {/* Patient Routes */}
      <Route 
        path="/patient/dashboard" 
        element={
          <div className="dashboard-container">
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardPatient />
          </ProtectedRoute>
          </div>
        } 
      />
      <Route 
        path="/patient/appointments" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <AppointmentViewPatient />
          </ProtectedRoute>
        } 
      />

      {/* Doctor Routes */}
      <Route 
        path="/doctor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DashboardDoctor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor/appointments" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <AppointmentViewDoctor />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/appointments" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppointmentViewAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagementViewAdmin />
          </ProtectedRoute>
        } 
      />

      {/* Settings Route - Available to all authenticated users */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <Settings />
          </ProtectedRoute>
        } 
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;