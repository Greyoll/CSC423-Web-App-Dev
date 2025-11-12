import { useState, useEffect } from 'react';
import './App.css'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");
  if (!username || !password) {
    setError("Please enter both a username and a password");
    return;
  }

  setIsLoading(true);

  try {
    console.log("Attempting login with:", { username, password });

    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("Response status:", response.status);

    let data;
    try {
      data = await response.json(); // safer JSON parsing
      console.log("Parsed JSON:", data);
    } catch (jsonErr) {
      const text = await response.text();
      console.log("Response text (not JSON):", text);
      throw new Error("Invalid server response, expected JSON");
    }

    if (!response.ok) {
      setError(data.error || data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setRole(data.role);
    setLoggedIn(true);
  } catch (err) {
    console.error("Login fetch error:", err);
    setError(err.message || "Network error occurred");
  } finally {
    setIsLoading(false);
  }
};

  if (role === "doctor" && loggedIn) {
    return <DashboardDoctor />;
  }
  else if (role === "admin" && loggedIn) {
    return <DashboardAdmin />;
  }
  else if (role === "patient" && loggedIn) {
    return <DashboardPatient />;
  }

  return (
    <>
      <header>
        <div className="logo">
            <img src="./Images/valdez_logo-black.jpg" alt="Valdez MD Logo Black" />
          </div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#" className="login-btn">Log In</a></li>
          </ul>
        </nav>
      </header>
      <main className="main-container">
        <div className="login-section">
          <h1>Valdez M.D Family Medicine</h1>
          <p>Login:</p>
          <form id="loginForm" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Stanley" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="GMoney527" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
        <div className="image-section">
          <img src="/Images/Stan-login.jpg" alt="Valdez Family Medicine" />
        </div>
      </main>
    </>
  )
}

function DashboardDoctor() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
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
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">
            <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
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
    </>
  )
}

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

  useEffect(() => {
    // Fetch appointments on mount
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
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

  const [currentPage, setCurrentPage] = useState("dashboard");

  if (currentPage === "appointments") {
    return <AppointmentViewAdmin onBack={() => setCurrentPage("dashboard")} />;
  }

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">
            <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
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
    </>
  )
}

function DashboardPatient() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
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
    return <AppointmentView onBack={() => setCurrentPage("dashboard")} />;
  }

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">
            <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
          </div>
          <nav className="nav-menu">
            <a className="nav-item active" href="#">Dashboard</a>
            <a className="nav-item" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("appointments"); }}>Appointments</a>
            <a className="nav-item" href="#">Schedule an appointment</a>
            <a className="nav-item" href="#">Contact a doctor</a>
            <a className="nav-item" href="#">Refill prescription</a>
          </nav>
          <div className="settings">
            <a href="#">Settings</a>
            <a href="#" onClick={handleLogout}>Logout</a>
          </div>
        </aside>
        <main className="main-content">
          <header className="main-header">
            <h1>Dashboard</h1>
            <div className="user-info">
              <span>Patient Name</span>
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
    </>
  )
}

function AppointmentViewDoctor({ onBack }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
          <div className="logo">
              <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
          </div>
          <nav className="nav-menu">
              <a className="nav-item" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Dashboard</a>
              <a className="nav-item active" href="#">Appointments</a>
              <a className="nav-item" href="#">Schedule an appointment</a>
              <a className="nav-item" href="#">Contact a doctor</a>
              <a className="nav-item" href="#">Refill prescription</a>
          </nav>
          <div className="settings">
              <a href="#">Settings</a>
              <a href="#" onClick={handleLogout}>Logout</a>
          </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Doctor Appointments</h1>
          <div className="user-info">
            <span>Dr Stanley Valdez</span>
          </div>
        </header>

        <section className="appointments-section">
          <h2>Upcoming Appointments</h2>
          <div className="appointment-cards">
            <div className="card">
              <h1>Check Up</h1>
              <h2>Dr. Stanley Valdez</h2>
              <p>04/20/2026 6:09AM</p>
            </div>
            <div className="card">
              <h1>Retinal Exam</h1>
              <h2>Dr. Ryan F</h2>
              <p>02/02/2027 5:00PM</p>
            </div>
            <div className="card">
              <h1>GI Appointment</h1>
              <h2>Dr. Collin F</h2>
              <p>08/30/2127 8:00AM</p>
            </div>
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

// Replace the AppointmentViewAdmin function with this:
function AppointmentViewAdmin({ onBack }) {
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = parseJwt(token);
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

  const handleAddAppointment = async () => {
    // Validate form
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

      const data = await res.json();
      alert("Appointment created successfully!");
      
      // Reset form and refresh list
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
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">
            <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
            <h1 className="nav-item">Admin Page</h1>
          </div>
          <nav className="nav-menu">
            <a className="nav-item" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Dashboard</a>
            <a className="nav-item" href="#">Patient Records</a>
            <a className="nav-item active" href="#">Appointments</a>
            <a className="nav-item" href="#">Prescriptions</a>
            <a className="nav-item" href="#">Messages</a>
          </nav>
          <div className="settings">
            <a href="#">System Settings</a>
            <a href="#">Settings</a>
            <a href="#" onClick={handleLogout}>Logout</a>
          </div>
        </aside>

        <main className="main-content">
          <header className="main-header">
            <h1>Admin Appointments</h1>
            <div className="user-info">
              <span>Admin</span>
            </div>
          </header>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}
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
    </>
  );
}

function AppointmentView({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
        const userId = payload.id;
        // Fetch appointments for this user
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
              <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
          </div>
          <nav className="nav-menu">
              <a className="nav-item" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Dashboard</a>
              <a className="nav-item active" href="#">Appointments</a>
              <a className="nav-item" href="#">Schedule an appointment</a>
              <a className="nav-item" href="#">Contact a doctor</a>
              <a className="nav-item" href="#">Refill prescription</a>
          </nav>
          <div className="settings">
              <a href="#">Settings</a>
              <a href="#" onClick={handleLogout}>Logout</a>
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
  )
}

function parseJwt(token) {
  try {
    const b64 = token.split('.')[1];
    const base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

function App() {
  return <Login />;
}

export default App