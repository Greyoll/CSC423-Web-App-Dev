import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';
import Sidebar from '../components/Sidebar.jsx';
import { useTheme } from '../context/ThemeContext';

function AppointmentViewAdmin() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    patientId: "",
    doctorId: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const handleLogout = useHandleLogout();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Use effect to get users name for display
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    if (payload) {
        const firstName = payload.firstName || "";
        const lastName = payload.lastName || "";
        setUserName(`${firstName} ${lastName}`.trim() || "User");
    };
  }, []);

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

  const handleAddAppointment = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.patientId || !formData.doctorId) {
      alert("Please fill in all fields");
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
        const errText = await res.text();
        alert("Failed to create appointment: " + errText);
        return;
      }

      alert("Appointment created successfully!");
      
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
      alert("Error creating appointment: " + err.message);
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

                <label>Patient ID:</label>
                <input
                  type="number"
                  placeholder="Enter patient ID"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                />

                <label>Doctor ID:</label>
                <input
                  type="number"
                  placeholder="Enter doctor ID"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                />

                <button onClick={handleAddAppointment} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Appointment"}
                </button>
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
                  <h1>Appointment #{apt.id}</h1>
                  <h2>Date: {new Date(apt.date).toLocaleDateString()}</h2>
                  <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
                  <p><strong>Patient ID:</strong> {apt.patientId}</p>
                  <p><strong>Doctor ID:</strong> {apt.doctorId}</p>
                  <p><strong>Last Updated:</strong> {new Date(apt.lastUpdated).toLocaleString()}</p>
                  <button 
                    onClick={() => handleDeleteAppointment(apt.id)}
                    style={{ marginTop: '10px', backgroundColor: '#d32f2f', color: 'white', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
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