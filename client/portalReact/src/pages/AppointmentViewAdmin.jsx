import { useState, useEffect } from 'react';
import { parseJwt } from '../hooks/useLogin';
import Sidebar from '../components/Sidebar.jsx';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

function AppointmentViewAdmin() {
  const { addNotification } = useNotification(); 
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
  const { darkMode } = useTheme();

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

  const handleDeleteAppointment = async (appointmentId) => {
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
        addNotification("Failed to delete appointment: " + errText, 'error');
        return;
      }

      addNotification("Appointment deleted successfully!", 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      addNotification("Error deleting appointment: " + err.message, 'error');
    }
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
              <h2>Edit Appointment with {editingAppointment.patientName}</h2>

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
            <div className="appointment-cards">
              {appointments.map((apt) => (
                <div className="card" key={apt._id || apt.id}>
                  <h1>Appointment with {apt.patientName}</h1>
                  <h2>Dr. {apt.doctorName}</h2>
                  <h2>Date: {apt.date ? new Date(apt.date).toLocaleDateString() : '—'}</h2>
                  <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
                  <p><strong>Last Updated:</strong> {apt.lastUpdated ? new Date(apt.lastUpdated).toLocaleString() : '—'}</p>

                  <div style={{ marginTop: 10 }}>
                    <button onClick={() => openEdit(apt)}
                      style={{ backgroundColor: '#aac0b9ff', color: 'white', padding: '5px 10px', cursor: 'pointer', marginRight: '10px' }}
                    >
                      Edit</button>
                    <button 
                      onClick={() => handleDeleteAppointment(apt.id || apt._id)}
                      style={{ backgroundColor: '#d32f2f', color: 'white', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Delete
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

export default AppointmentViewAdmin;