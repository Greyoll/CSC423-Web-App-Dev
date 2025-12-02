import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';
import Sidebar from '../components/Sidebar.jsx';

function DashboardAdmin() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const handleLogout = useHandleLogout();

  // Helper function to convert 24hr to 12hr format
  const formatTime = (time24) => {
    if (!time24) return '—';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const payload = parseJwt(token);
      if (!payload) return;

      const userId = payload.id;

      setUserName(`${payload.firstName || ""} ${payload.lastName || ""}`.trim());

      try {
        // Fetch appointments
        const res = await fetch(`http://localhost:3000/api/appointments/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.ok ? await res.json() : []);

        // Fetch users
        const userRes = await fetch(`http://localhost:3000/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.ok ? await userRes.json() : [];
        setUsers(userData);

        // Filter doctors
        const doctorUsers = userData.filter((u) => u.role === "doctor");
        setDoctors(doctorUsers);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAppts(false);
        setLoadingUsers(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <header className="main-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>System Overview & Management</p>
          </div>
        </header>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/chart-column.png"/></div>
            <div className="stat-content">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/users.png"/></div>
            <div className="stat-content">
              <h3>{loadingUsers ? "...": users.length}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/stethoscope.png"/></div>
            <div className="stat-content">
              <h3>{loadingUsers ? "…" : doctors.length}</h3>
              <p>Doctors</p>
            </div>
          </div>
        </div>

        <section className="appointments-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Recent Appointments</h2>
            <Link to="/admin/appointments" style={{ 
              color: '#3498db', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              View All →
            </Link>
          </div>
          <div className="appointment-cards">
            {loadingAppts ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><img src="/Images/chart-column.png"/></div>
                <h3>No Appointments</h3>
                <p>There are no appointments in the system.</p>
              </div>
            ) : (
              appointments.slice(0, 3).map((apt) => (
                <div className="card" key={apt.id || apt._id}>
                  <h1><img src="/Images/user.png"/> {apt.patientName} with Dr. {apt.doctorName}</h1>
                  <h2><img src="/Images/calendar-days.png"/> {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }) : '—'}</h2>
                  <p className="time-badge"><img src="/Images/clock.png"/> {formatTime(apt.startTime)} - {formatTime(apt.endTime)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="appointments-section">
          <h2>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <Link to="/admin/users" className="stat-card">
              <span className="stat-icon"><img src="/Images/users.png"/></span>
              <div>
                <h3>User Management</h3>
                <p>Manage system users</p>
              </div>
            </Link>
            <Link to="/admin/appointments" className="stat-card">
              <span className="stat-icon"><img src="/Images/calendar-days.png"/></span>
              <div>
                <h3>Appointments</h3>
                <p>View and manage appointments</p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardAdmin;