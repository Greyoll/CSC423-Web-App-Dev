import { useState, useEffect } from 'react';
import { parseJwt } from '../hooks/useLogin';
import Sidebar from '../components/Sidebar.jsx';

function AppointmentViewDoctor() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    if (payload) {
        const firstName = payload.firstName || "";
        const lastName = payload.lastName || "";
        setUserName(`${firstName} ${lastName}`.trim() || "User");
    };
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

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
        console.log("Fetched appointments:", data);
        setAppointments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching appointments: " + err.message);
      } finally {
        setLoading(false);
      }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("Failed to delete appointment: " + errText);
        return;
      }

      alert("Appointment deleted successfully!");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Error deleting appointment: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="doctor" />

      <main className="main-content">
        <header className="main-header">
          <h1>Doctor Appointments</h1>
          <div className="user-info">
            <span>Dr. {userName}</span>
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
                  <h1>Appointment with {apt.patientName}</h1>
                  <h2>Date: {new Date(apt.date).toLocaleDateString()}</h2>
                  <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
                  <p><strong>Last Updated:</strong> {new Date(apt.lastUpdated).toLocaleString()}</p>
                  <div style={{ marginTop: 10 }}>
                    <button 
                      onClick={() => handleCancelAppointment(apt.id || apt._id)}
                      style={{ backgroundColor: '#d32f2f', color: 'white', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AppointmentViewDoctor;