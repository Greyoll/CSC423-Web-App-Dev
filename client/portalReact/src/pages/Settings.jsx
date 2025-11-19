import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar.jsx';

function Settings() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
        if (!payload) {
          setError("Invalid token");
          setLoading(false);
          return;
        }

        // Get all users and find the current user by id
        const res = await fetch(`http://localhost:3000/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          setError("Failed to fetch user info: " + errText);
          setLoading(false);
          return;
        }

        const users = await res.json();
        const currentUser = users.find(user => user.id === payload.id);
        
        if (!currentUser) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUserInfo(currentUser);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching user info: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const getDashboardLink = () => {
    if (userRole === 'patient') return '/patient/dashboard';
    if (userRole === 'doctor') return '/doctor/dashboard';
    if (userRole === 'admin') return '/admin/dashboard';
    return '/';
  };

  const getNavigationItems = () => {
    if (userRole === 'patient') {
      return (
        <>
          <Link className="nav-item" to="/patient/dashboard">Dashboard</Link>
          <Link className="nav-item" to="/patient/appointments">Appointments</Link>
          <a className="nav-item" href="#">Schedule an appointment</a>
          <a className="nav-item" href="#">Contact a doctor</a>
          <a className="nav-item" href="#">Refill prescription</a>
        </>
      );
    }
    if (userRole === 'doctor') {
      return (
        <>
          <Link className="nav-item" to="/doctor/dashboard">Dashboard</Link>
          <a className="nav-item" href="#">Patient Records</a>
          <Link className="nav-item" to="/doctor/appointments">Appointments</Link>
          <a className="nav-item" href="#">Prescriptions</a>
          <a className="nav-item" href="#">Messages</a>
        </>
      );
    }
    if (userRole === 'admin') {
      return (
        <>
          <Link className="nav-item" to="/admin/dashboard">Dashboard</Link>
          <a className="nav-item" href="#">Patient Records</a>
          <Link className="nav-item" to="/admin/appointments">Appointments</Link>
          <a className="nav-item" href="#">Prescriptions</a>
          <a className="nav-item" href="#">Messages</a>
        </>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <Sidebar role={userRole} />

      <main className="main-content">
        <header className="main-header">
          <h1>Settings</h1>
          <div className="user-info">
            <span>{userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'User'}</span>
          </div>
        </header>

        {loading && <p style={{ padding: '20px' }}>Loading user information...</p>}
        
        {error && <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>}

        {!loading && !error && userInfo && (
          <>
            <section className="appointments-section">
              <h2>User Information</h2>
              <div className="user-info-grid">
                <div className="info-item">
                  <label>First Name:</label>
                  <p>{userInfo.firstName}</p>
                </div>
                <div className="info-item">
                  <label>Last Name:</label>
                  <p>{userInfo.lastName}</p>
                </div>
                <div className="info-item">
                  <label>Username:</label>
                  <p>{userInfo.username}</p>
                </div>
                <div className="info-item">
                  <label>Role:</label>
                  <p>{userInfo.role}</p>
                </div>
                <div className="info-item">
                  <label>User ID:</label>
                  <p>{userInfo.id}</p>
                </div>
                <div className="info-item">
                  <label>Last Login:</label>
                  <p>{userInfo.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : 'Never'}</p>
                </div>
                <div className="info-item">
                  <label>Last Password Change:</label>
                  <p>{userInfo.lastPasswordChange ? new Date(userInfo.lastPasswordChange).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </section>

            <section className="appointments-section">
              <h2>Appearance</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Dark Mode</h3>
                    <p>Switch between light and dark theme</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={darkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </section>

            <section className="appointments-section">
              <h2>Account Actions</h2>
              <div className="settings-group">
                <button className="settings-button secondary">Change Password</button>
                <button 
                  className="settings-button danger"
                  onClick={(e) => { e.preventDefault(); handleLogout(); }}
                >
                  Logout
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Settings;