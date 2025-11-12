import { useState } from "react";
import "./App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // ---------- LOGIN ----------
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || !role) {
      alert("Please enter username, password, and select a role");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errtext = await response.text();
        alert("Failed to login: " + errtext);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setRole(data.role);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  // ---------- CHANGE PASSWORD ----------
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!username) {
      setMessage("Enter your username to change password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/users/change-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, newPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(false);
      } else {
        setMessage(data.message || "Error updating password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  // ---------- REDIRECT TO DASHBOARD ----------
  if (role === "doctor" && loggedIn) return <DashboardDoctor />;
  if (role === "admin" && loggedIn) return <DashboardAdmin />;
  if (role === "patient" && loggedIn) return <DashboardPatient />;

  // ---------- LOGIN + CHANGE PASSWORD UI ----------
  return (
    <>
      <header>
        <div className="logo">Valdez <span>MD</span></div>
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
          <p>Please sign in to see more:</p>

          <label htmlFor="role">I am a:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          <form id="loginForm" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Log In</button>
          </form>

          <button
            onClick={() => setShowChangePassword(true)}
            className="forgot-password-btn"
          >
            Forgot/Change Password?
          </button>
        </div>

        {/* ---------- CHANGE PASSWORD POPUP ---------- */}
        {showChangePassword && (
          <div className="popup-overlay">
            <div className="popup-form">
              <button
                className="close-btn"
                onClick={() => setShowChangePassword(false)}
              >
                &times;
              </button>
              <h2>Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit">Update Password</button>
                {message && <p className="status-message">{message}</p>}
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
/* ------------------- DASHBOARDS ------------------- */

function DashboardDoctor() {
  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="nav-menu">
            <a className="nav-item active" href="#">Dashboard</a>
            <a className="nav-item" href="#">Patient Records</a>
            <a className="nav-item" href="#">Appointments</a>
            <a className="nav-item" href="#">Prescriptions</a>
            <a className="nav-item" href="#">Messages</a>
          </nav>
          <div className="settings">
            <a href="#">Settings</a>
            <a href="#">Logout</a>
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
              <div className="card">
                <h1>Patient: John Doe</h1>
                <h2>Reason: Annual Check-Up</h2>
                <p>8:30 AM - Exam Room 1</p>
              </div>
              <div className="card">
                <h1>Patient: Sarah Connor</h1>
                <h2>Reason: Follow-Up Consultation</h2>
                <p>10:00 AM - Exam Room 2</p>
              </div>
              <div className="card">
                <h1>Patient: Michael Smith</h1>
                <h2>Reason: Lab Review</h2>
                <p>1:30 PM - Virtual</p>
              </div>
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
        </main>
      </div>
    </>
  );
}

function DashboardAdmin() {
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "patient",
    password: "",
  });

  useEffect(() => {
    if (showPopup) fetchUsers();
  }, [showPopup]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch {
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
          "Authorization": "Bearer " + token,
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
      alert("Error saving user");
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
            <a className="nav-item" href="#">Appointments</a>
            <a className="nav-item" href="#">Prescriptions</a>
            <a className="nav-item" href="#">Messages</a>
          </nav>
          <div className="settings">
            <button className="nav-item" onClick={() => setShowPopup(true)}>
              User Management
            </button>
            <a href="#">Settings</a>
            <a href="#">Logout</a>
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
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setFormData({
                                  firstName: u.firstName,
                                  lastName: u.lastName,
                                  username: u.username,
                                  role: u.role,
                                  password: "",
                                });
                              }}
                            >
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
        </main>
      </div>
    </>
  );
}

function DashboardPatient() {
  const [activePage, setActivePage] = useState("dashboard");
  const [userName] = useState("Paige");
  const [upcoming, setUpcoming] = useState([
    { id: 1, title: "Check Up", doctor: "Dr. Stanley Valdez", date: "04/20/2026 6:09AM" },
    { id: 2, title: "Retinal Exam", doctor: "Dr. Ryan F", date: "02/02/2027 5:00PM" },
    { id: 3, title: "GI Appointment", doctor: "Dr. Collin F", date: "08/30/2027 8:00AM" },
  ]);
  const history = [
    { title: "Blood Test", doctor: "Dr. Stanley Valdez", date: "04/20/2022 6:09AM" },
    { title: "Physical", doctor: "Dr. Jenny E", date: "07/07/2023 7:50AM" },
    { title: "General Wellness", doctor: "Dr. James H", date: "12/30/2023 8:00AM" },
  ];

  function handleCancel(id) {
    setUpcoming(prev => prev.filter(a => a.id !== id));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  function NavItem({ page, label }) {
    return (
      <button
        onClick={() => setActivePage(page)}
        className={`nav-item ${activePage === page ? "active" : ""}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
        </div>
        <nav className="nav-menu">
          <NavItem page="dashboard" label="Dashboard" />
          <NavItem page="schedule" label="Schedule Appointment" />
          <NavItem page="contact" label="Contact Doctor" />
          <NavItem page="refill" label="Refill Prescription" />
        </nav>
        <div className="settings">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>
            {activePage === "dashboard" && "Dashboard"}
            {activePage === "schedule" && "Schedule Appointment"}
            {activePage === "contact" && "Contact Doctor"}
            {activePage === "refill" && "Refill Prescription"}
          </h1>
          <div className="user-info">
            <span>Welcome, {userName}</span>
          </div>
        </header>

        {activePage === "dashboard" && (
          <>
            <section className="appointments-section">
              <h2>Upcoming Appointments</h2>
              <div className="appointment-cards">
                {upcoming.length > 0 ? (
                  upcoming.map(a => (
                    <div className="card" key={a.id}>
                      <h1>{a.title}</h1>
                      <h2>{a.doctor}</h2>
                      <p>{a.date}</p>
                      <button className="cancel-btn" onClick={() => handleCancel(a.id)}>
                        Cancel Appointment
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No upcoming appointments.</p>
                )}
              </div>
            </section>

            <section className="appointments-section">
              <h2>Appointment History</h2>
              <div className="appointment-cards">
                {history.map((a, i) => (
                  <div className="card" key={i}>
                    <h1>{a.title}</h1>
                    <h2>{a.doctor}</h2>
                    <p>{a.date}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

/* ------------------- APP ENTRY ------------------- */
function App() {
  return <Login />;
}

export default App;
