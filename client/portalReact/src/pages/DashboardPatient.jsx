import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';

function DashboardPatient() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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

        // Set full name from JWT
        const firstName = payload.firstName || "";
        const lastName = payload.lastName || "";
        setUserName(`${firstName} ${lastName}`.trim() || "User");

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

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>{userName}</span>
          </div>
        </header>
        <section className="appointments-section">
          <h2>Upcoming Appointments</h2>
          <div className="appointment-cards">
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments scheduled.</p>
            ) : (
              appointments.map((apt) => (
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
          <h2>Appointment History</h2>
          <div className="appointment-cards">
            <div className="card">
              <h1>Blood Test</h1>
              <h2>Dr. Stanley Valdez</h2>
              <p>04/20/2022 06:09AM</p>
            </div>
            <div className="card">
              <h1>Physical</h1>
              <h2>Dr. Jenny E</h2>
              <p>07/07/2023 07:50AM</p>
            </div>
            <div className="card">
              <h1>General Wellness</h1>
              <h2>Dr. James H</h2>
              <p>12/30/2023 08:00AM</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPatient;