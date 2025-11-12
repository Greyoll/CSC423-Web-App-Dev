import { useState } from 'react';
import './App.css';
import Login from './auth/Login';
import DashboardPatient from './pages/DashboardPatient';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardAdmin from './pages/DashboardAdmin';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  if (isLoggedIn && userRole === "patient") {
    return <DashboardPatient />;
  }

  if (isLoggedIn && userRole === "doctor") {
    return <DashboardDoctor />;
  }

  if (isLoggedIn && userRole === "admin") {
    return <DashboardAdmin />;
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;