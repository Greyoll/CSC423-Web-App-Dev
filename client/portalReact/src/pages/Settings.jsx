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
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [changeError, setChangeError] = useState(null);
  const [changeSuccess, setChangeSuccess] = useState(null);
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

  const handleChangePassword = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setChangeError(null);
    setChangeSuccess(null);

    if (!newPassword) {
      setChangeError('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New passwords do not match');
      return;
    }

    try {
      setIsChanging(true);
      const token = localStorage.getItem('token');
      if (!token || !userInfo) {
        setChangeError('Missing authentication or user info');
        return;
      }

      // Use Mongo _id if present, otherwise numeric id
      const idParam = userInfo._id || userInfo.id;
      const res = await fetch(`http://localhost:3000/api/users/${idParam}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setChangeError(data.error || data.message || 'Failed to change password');
        return;
      }

      setChangeSuccess('Password changed successfully');
      // update lastPasswordChange in UI
      setUserInfo(prev => ({ ...prev, lastPasswordChange: new Date().toISOString() }));
      // clear fields after short delay and close modal
      setTimeout(() => {
        setShowChangeModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setChangeSuccess(null);
      }, 900);
    } catch (err) {
      console.error('Error changing password:', err);
      setChangeError(err.message || 'Network error');
    } finally {
      setIsChanging(false);
    }
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
                <button
                  className="settings-button secondary"
                  onClick={(e) => { e.preventDefault(); setShowChangeModal(true); }}
                >
                  Change Password
                </button>
                <button 
                  className="settings-button danger"
                  onClick={(e) => { e.preventDefault(); handleLogout(); }}
                >
                  Logout
                </button>
              </div>
            </section>

            {/* Change Password Modal */}
            {showChangeModal && (
              <div className="popup-overlay">
                <div className="popup">
                  <button className="close-btn" onClick={() => setShowChangeModal(false)}>X</button>
                  <h2>Change Password</h2>
                  <div className="form-section">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {changeError && <p style={{ color: 'red' }}>{changeError}</p>}
                    {changeSuccess && <p style={{ color: 'green' }}>{changeSuccess}</p>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleChangePassword} disabled={isChanging}>
                        {isChanging ? 'Changing...' : 'Save'}
                      </button>
                      <button onClick={() => setShowChangeModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Settings;