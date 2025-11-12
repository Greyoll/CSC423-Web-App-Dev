import { useState, useEffect } from 'react';
import AppointmentViewAdmin from './AppointmentViewAdmin';
import { parseJwt, handleLogout } from '../hooks/useLogin';

function DashboardAdmin() {
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "patient",
    password: "",
  });
  const [currentPage, setCurrentPage] = useState("dashboard");

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

  useEffect(() => {
    if (showPopup) { fetchUsers(); }
  }, [showPopup]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert("Couldn't fetch users");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `http://localhost:3000/api/users/${editingUser._id}`
        : "http://localhost:3000/api/users";

      const payload = { ...formData };
      if (editingUser && !formData.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("Error saving user: " + errText);
        return;
      }

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        role: "patient",
        password: "",
      });
      setEditingUser(null);
      fetchUsers();
      alert(editingUser ? "User updated successfully!" : "User added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving user. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  if (currentPage === "appointments") {
    return <AppointmentViewAdmin onBack={() => setCurrentPage("dashboard")} />;
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
          <h1 className="nav-item">Admin Page</h1>
        </div>
        <nav className="nav-menu">
          <a className="nav-item active" href="#">Dashboard</a>
          <a className="nav-item" href="#">Patient Records</a>
          <a className="nav-item" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("appointments"); }}>Appointments</a>
          <a className="nav-item" href="#">Prescriptions</a>
          <a className="nav-item" href="#">Messages</a>
        </nav>
        <div className="settings">
          <button className="nav-item" onClick={() => setShowPopup(true)}>
            User Management
          </button>
          <a href="#">System Settings</a>
          <a href="#">Settings</a>
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
              <h2>User Management</h2>

              <div className="form-section">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="password"
                  placeholder={editingUser ? "Leave blank to keep password" : "Password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button onClick={handleSave}>
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </div>
              <div className="table-section">
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.firstName}</td>
                        <td>{u.lastName}</td>
                        <td>{u.username}</td>
                        <td>{u.role}</td>
                        <td>{new Date(u.lastLogin).toLocaleString()}</td>
                        <td>
                          <button onClick={() => {
                            setEditingUser(u);
                            setFormData({
                              firstName: u.firstName,
                              lastName: u.lastName,
                              username: u.username,
                              role: u.role,
                              password: "",
                            });
                          }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(u._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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