import { useState, useEffect } from 'react';
import AppointmentViewDoctor from './AppointmentViewDoctor';
import { parseJwt, handleLogout } from '../hooks/useLogin';

function DashboardDoctor() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (currentPage === "appointments") {
    return <AppointmentViewDoctor onBack={() => setCurrentPage("dashboard")} />;
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
        </div>
        <nav className="nav-menu">
          <a className="nav-item active" href="#">Dashboard</a>
          <a className="nav-item" href="#">Patient Records</a>
          <a className="nav-item" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("appointments"); }}>Appointments</a>
          <a className="nav-item" href="#">Prescriptions</a>
          <a className="nav-item" href="#">Messages</a>
        </nav>
        <div className="settings">
          <a href="#">Settings</a>
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Doctor Dashboard</h1>
          <div className="user-info">
            <span>Dr. Stanley Valdez</span>
          </div>
        </header>
        <section className="appointments-section">
          <h2>Today's Appointments</h2>
          <div className="appointment-cards">
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments scheduled.</p>
            ) : (
              appointments.map((apt) => (
                <div className="card" key={apt._id || apt.id}>
                  <h1>Patient ID: {apt.patientId}</h1>
                  <h2>Date: {new Date(apt.date).toLocaleDateString()}</h2>
                  <p>{apt.startTime} - {apt.endTime}</p>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="appointments-section">
          <h2>Recent Patient Updates</h2>
          <div className="appointment-cards">
            <div className="card">
              <h1>Jane Foster</h1>
              <h2>New Lab Results Available</h2>
              <p>Uploaded: 10/12/2025</p>
            </div>
            <div className="card">
              <h1>Peter Parker</h1>
              <h2>Medication Adjustment Submitted</h2>
              <p>Submitted: 10/13/2025</p>
            </div>
            <div className="card">
              <h1>Tony Stark</h1>
              <h2>Cardiology Referral Sent</h2>
              <p>Updated: 10/10/2025</p>
            </div>
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

export default DashboardDoctor;