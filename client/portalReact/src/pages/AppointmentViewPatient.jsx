import { useState, useEffect } from 'react';
import { parseJwt} from '../hooks/useLogin';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from '../components/ConfirmationModal'; 
import Sidebar from '../components/Sidebar.jsx';

function AppointmentViewPatient() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); 
  const { addNotification } = useNotification();

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

  // Open confirmation modal
  const openCancelConfirmation = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowConfirmation(true);
  };

  // Handle confirmed cancellation
  const handleConfirmCancel = async () => {
    if (!appointmentToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentToDelete.id || appointmentToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        addNotification("Failed to cancel appointment: " + errText, 'error');
        return;
      }

      addNotification("Appointment cancelled successfully!", 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      addNotification("Error cancelling appointment: " + err.message, 'error');
    }

    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="patient" />

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title="Cancel Appointment?"
        message={`Are you sure you want to cancel your appointment with Dr. ${appointmentToDelete?.doctorName} on ${appointmentToDelete?.date ? new Date(appointmentToDelete.date).toLocaleDateString() : ''}?`}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelConfirmation}
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
        isDangerous={true}
      />

      <main className="main-content">
        <header className="main-header">
          <h1>All Appointments</h1>
          <div className="user-info">
            <span>{userName}</span>
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
                  <h2>Date: {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { timeZone: 'UTC' }) : '—'}</h2>
                  <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
                  <p><strong>Patient ID:</strong> {apt.patientId}</p>
                  <p><strong>Doctor ID:</strong> {apt.doctorId}</p>
                  <p><strong>Last Updated:</strong> {apt.lastUpdated ? new Date(apt.lastUpdated).toLocaleString('en-US', { timeZone: 'UTC' }) : '—'}</p>
                  <div style={{ marginTop: 10 }}>
                    <button 
                      onClick={() => openCancelConfirmation(apt)}
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

export default AppointmentViewPatient;