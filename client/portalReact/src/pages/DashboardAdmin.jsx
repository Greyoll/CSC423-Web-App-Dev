import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';

function DashboardAdmin() {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
        if (!payload) {
          console.error("Invalid token");
          return;
        }
        const userId = payload.id;

        const res = await fetch(`http://localhost:3000/api/appointments/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setAppointments(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoadingAppts(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
          <h1 className="nav-item">Admin Page</h1>
        </div>
        <nav className="nav-menu">
          <Link className="nav-item active" to="/admin/dashboard">Dashboard</Link>
          <a className="nav-item" href="#">Patient Records</a>
          <Link className="nav-item" to="/admin/appointments">Appointments</Link>
          <a className="nav-item" href="#">Prescriptions</a>
          <a className="nav-item" href="#">Messages</a>
        </nav>
        <div className="settings">
          <Link className="nav-item" to="/admin/users">User Management</Link>
          <a href="#">System Settings</a>
          <Link to="/settings">Settings</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>
        <section className="appointments-section">
          <h2>Recent Appointments</h2>
          <div className="appointment-cards">
            {loadingAppts ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              appointments.slice(0, 3).map((apt) => (
                <div className="card" key={apt._id || apt.id}>
                  <h1>Appointment #{apt.id}</h1>
                  <h2>Date: {new Date(apt.date).toLocaleDateString()}</h2>
                  <p>{apt.startTime} - {apt.endTime}</p>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="appointments-section">
          <h2>New Messages</h2>
          <div className="appointment-cards">
            <div className="card">
              <h1>From: John Doe</h1>
              <h2>Subject: Question about medication</h2>
              <p>Received: 10/14/2025</p>
            </div>
            <div className="card">
              <h1>From: Sarah Connor</h1>
              <h2>Subject: Appointment follow-up</h2>
              <p>Received: 10/13/2025</p>
            </div>
            <div className="card">
              <h1>From: Pharmacy Team</h1>
              <h2>Subject: Prescription refill approval</h2>
              <p>Received: 10/12/2025</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardAdmin;