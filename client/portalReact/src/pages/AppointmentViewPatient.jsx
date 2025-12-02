import { useState, useEffect } from 'react';
import { parseJwt } from '../hooks/useLogin';
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
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    if (payload) {
      const firstName = payload.firstName || "";
      const lastName = payload.lastName || "";
      setUserName(`${firstName} ${lastName}`.trim() || "User");
    }
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
      setAppointments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching appointments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCancelConfirmation = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowConfirmation(true);
  };

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

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="patient" />

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
            
            <div className="accordion" id="appointmentsAccordion" style={{ marginTop: '1.5rem' }}>
              {appointments.map((apt, index) => (
                <div className="accordion-item" key={apt.id || apt._id} style={{ marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                      style={{
                        backgroundColor: '#f8f9fa',
                        color: '#000',
                        padding: '1rem 1.25rem',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingRight: '1rem' }}>
                        <span>Dr. {apt.doctorName || 'Unknown'}</span>
                        <span style={{ fontWeight: 'normal', color: '#666' }}>
                          {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—'}
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div 
                    id={`collapse${index}`} 
                    className="accordion-collapse collapse" 
                    data-bs-parent="#appointmentsAccordion"
                  >
                    <div className="accordion-body" style={{ padding: '1.25rem', backgroundColor: '#fff' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: '0.5rem 0' }}>
                          <strong><img src="/Images/calendar-days.png"/> Date:</strong> {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—'}
                        </p>
                        <p style={{ margin: '0.5rem 0' }}>
                          <strong><img src="/Images/clock.png"/> Time:</strong> {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                        </p>
                        <p style={{ margin: '0.5rem 0' }}>
                          <strong><img src="/Images/stethoscope.png"/> Doctor:</strong> Dr. {apt.doctorName || 'Unknown'}
                        </p>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <strong>Last Updated:</strong> {apt.lastUpdated ? new Date(apt.lastUpdated).toLocaleString('en-US', { timeZone: 'UTC' }) : '—'}
                        </p>
                      </div>
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <button 
                          onClick={() => openCancelConfirmation(apt)}
                          style={{ 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            padding: '0.5rem 1.5rem', 
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
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