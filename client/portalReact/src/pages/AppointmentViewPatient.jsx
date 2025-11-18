import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';

function AppointmentViewPatient() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
        if (!payload) {
          setError("Invalid token");
          setLoading(false);
          return;
        }
        const userId = payload.id;

        const res = await fetch(`http://localhost:3000/api/appointments/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          setError("Failed to fetch appointments: " + errText);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching appointments: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
        </div>
        <nav className="nav-menu">
          <Link className="nav-item" to="/patient/dashboard">Dashboard</Link>
          <Link className="nav-item active" to="/patient/appointments">Appointments</Link>
          <a className="nav-item" href="#">Schedule an appointment</a>
          <a className="nav-item" href="#">Contact a doctor</a>
          <a className="nav-item" href="#">Refill prescription</a>
        </nav>
        <div className="settings">
          <Link className="nav-item active" to="/settings">Settings</Link>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>All Appointments</h1>
          <div className="user-info">
            <span>Patient Name</span>
          </div>
        </header>

        {loading && <p style={{ padding: '20px' }}>Loading appointments...</p>}
        
        {error && <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <p style={{ padding: '20px' }}>No appointments found.</p>
        )}

        {!loading && !error && appointments.length > 0 && (
          <section className="appointments-section">
            <h2>Your Appointments</h2>
            <div className="appointment-cards">
              {appointments.map((apt) => (
                <div className="card" key={apt._id || apt.id}>
                  <h1>Appointment #{apt.id}</h1>
                  <h2>Date: {new Date(apt.date).toLocaleDateString()}</h2>
                  <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
                  <p><strong>Doctor ID:</strong> {apt.doctorId}</p>
                  <p><strong>Patient ID:</strong> {apt.patientId}</p>
                  <p><strong>Last Updated:</strong> {new Date(apt.lastUpdated).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AppointmentViewPatient;