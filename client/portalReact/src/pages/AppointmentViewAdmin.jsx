import { useState, useEffect } from 'react';
import { parseJwt } from '../hooks/useLogin';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from '../components/ConfirmationModal'; 
import Sidebar from '../components/Sidebar.jsx';
import { useTheme } from '../context/ThemeContext';

function AppointmentViewAdmin() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    patientId: "",
    doctorId: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    patientId: "",
    doctorId: ""
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); 
  const { darkMode } = useTheme();
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
    fetchUsers();
    fetchAppointments();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    if (payload) {
      const firstName = payload.firstName || "";
      const lastName = payload.lastName || "";
      setUserName(`${firstName} ${lastName}`.trim() || "User");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
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

  const getDoctorName = (id) => {
    const doctor = users.find(u => u.id === id && u.role === "doctor");
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown";
  };

  const getPatientName = (id) => {
    const patient = users.find(u => u.id === id && u.role === "patient");
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  const handleAddAppointment = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.patientId || !formData.doctorId) {
      addNotification("Please fill in all fields", 'warning');
      return;
    }

    // Basic validation: end time should be after start time
    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      setIsCreating(true);
      const token = localStorage.getItem("token");

      const payload = {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        patientId: Number(formData.patientId),
        doctorId: Number(formData.doctorId),
      };

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        addNotification("Failed to create appointment: " + (errData.error || "Unknown error"), 'error');
        return;
      }

      addNotification("Appointment created successfully!", 'success');
      
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        patientId: "",
        doctorId: "",
      });
      setShowAddForm(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      addNotification("Error creating appointment: " + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteConfirmation(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentToDelete.id || appointmentToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        addNotification("Failed to delete appointment: " + errText, 'error');
        return;
      }

      addNotification("Appointment deleted successfully!", 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      addNotification("Error deleting appointment: " + err.message, 'error');
    }

    setShowDeleteConfirmation(false);
    setAppointmentToDelete(null);
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setAppointmentToDelete(null);
  };

  const openEdit = (apt) => {
    setEditingAppointment(apt);
    setEditFormData({
      date: apt.date ? new Date(apt.date).toISOString().slice(0, 10) : "",
      startTime: apt.startTime || "",
      endTime: apt.endTime || "",
      patientId: apt.patientId != null ? String(apt.patientId) : "",
      doctorId: apt.doctorId != null ? String(apt.doctorId) : "",
    });
  };

  const closeEdit = () => {
    setEditingAppointment(null);
    setEditFormData({
      date: "",
      startTime: "",
      endTime: "",
      patientId: "",
      doctorId: "",
    });
  };

  const saveEdit = async () => {
    if (!editingAppointment) return;

    if (!editFormData.date || !editFormData.startTime || !editFormData.endTime || !editFormData.patientId || !editFormData.doctorId) {
      addNotification("Please fill in all fields", 'warning');
      return;
    }

    // Basic validation: end time should be after start time
    if (editFormData.startTime >= editFormData.endTime) {
      addNotification("End time must be after start time", 'warning');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const appointmentIdParam = editingAppointment.id || editingAppointment._id;

      const payload = {
        date: editFormData.date,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
        patientId: Number(editFormData.patientId),
        doctorId: Number(editFormData.doctorId),
      };

      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentIdParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        addNotification("Failed to update appointment: " + (errData.error || "Unknown error"), 'error');
        return;
      }

      await fetchAppointments();
      closeEdit();
      addNotification("Appointment updated successfully!", 'success');
    } catch (err) {
      console.error(err);
      addNotification("Error updating appointment: " + err.message, 'error');
    }
  };

  const doctors = users.filter(u => u.role === "doctor");
  const patients = users.filter(u => u.role === "patient");

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Appointment?"
        message={`Are you sure you want to delete the appointment between ${appointmentToDelete?.patientName} and Dr. ${appointmentToDelete?.doctorName} on ${appointmentToDelete?.date ? new Date(appointmentToDelete.date).toLocaleDateString() : ''}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete Appointment"
        cancelText="Cancel"
        isDangerous={true}
      />

      <main className="main-content">
        <header className="main-header">
          <h1>Admin Appointments</h1>
          <div className="user-info">
            <span>{userName}</span>
          </div>
        </header>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            marginBottom: '20px', padding: '10px 20px', cursor: 'pointer',
            backgroundColor: darkMode ? '#fff' : '#f9f9f9',
            color: '#000',
           }}
        >
          {showAddForm ? "Cancel" : "Add New Appointment"}
        </button>

        {showAddForm && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-btn" onClick={() => setShowAddForm(false)}>X</button>
              <h2>Create New Appointment</h2>

              <div className="form-section">
                <label>Date:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />

                <label>Start Time:</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />

                <label>End Time:</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />

                <label>Select Patient:</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                >
                  <option value="">-- Choose a Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (ID: {p.id})
                    </option>
                  ))}
                </select>

                <label>Select Doctor:</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName} (ID: {d.id})
                    </option>
                  ))}
                </select>

                <button onClick={handleAddAppointment} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editingAppointment && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-btn" onClick={closeEdit}>X</button>
              <h2>Edit Appointment</h2>

              <div className="form-section">
                <label>Date:</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                />

                <label>Start Time:</label>
                <input
                  type="time"
                  value={editFormData.startTime}
                  onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                />

                <label>End Time:</label>
                <input
                  type="time"
                  value={editFormData.endTime}
                  onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                />

                <label>Select Patient:</label>
                <select
                  value={editFormData.patientId}
                  onChange={(e) => setEditFormData({ ...editFormData, patientId: e.target.value })}
                >
                  <option value="">-- Choose a Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (ID: {p.id})
                    </option>
                  ))}
                </select>

                <label>Select Doctor:</label>
                <select
                  value={editFormData.doctorId}
                  onChange={(e) => setEditFormData({ ...editFormData, doctorId: e.target.value })}
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName} (ID: {d.id})
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: 12 }}>
                  <button onClick={saveEdit} style={{ marginRight: 8 }}>Save</button>
                  <button onClick={closeEdit}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && <p style={{ padding: '20px' }}>Loading appointments...</p>}

        {error && <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <p style={{ padding: '20px' }}>No appointments found.</p>
        )}

        {!loading && !error && appointments.length > 0 && (
          <section className="appointments-section">
            <h2>All Appointments</h2>
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
                        <span>Dr. {apt.doctorName || 'Unknown'} with {apt.patientName}</span>
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
                        <p style={{ margin: '0.5rem 0' }}>
                          <strong><img src="/Images/user.png"/> Patient:</strong> {apt.patientName || 'Unknown'}
                        </p>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <strong>Last Updated:</strong> {apt.lastUpdated ? new Date(apt.lastUpdated).toLocaleString('en-US', { timeZone: 'UTC' }) : '—'}
                        </p>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <strong>Appointment ID:</strong> {apt.id || apt._id}
                        </p>
                      </div>
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => openEdit(apt)}
                          style={{ 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            padding: '0.3rem 0.8rem', 
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                        >
                          Edit Appointment
                        </button>
                        <button 
                          onClick={() => openDeleteConfirmation(apt)}
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
                          Delete Appointment
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

export default AppointmentViewAdmin;