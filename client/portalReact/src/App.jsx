import { useState } from 'react';
import './App.css'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please enter both a username and a password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errtext = await response.text();
        alert("Failed to login: " + errtext);
        return;
      }

      const data = await response.json();
    
      // Saves JWT
      localStorage.setItem("token", data.token);

      // redirect based on role
      setRole(data.role);
      setLoggedIn(true);

    } catch (err) {
      console.error(err);
      alert("Check console, an error has occurred.");
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
              <select id="role" name="role">
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="staff">Staff</option>
              </select>

              <form id="loginForm" onSubmit={handleSubmit}>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" name="username" placeholder="Stanley" required value={username} onChange={(e) => setUsername(e.target.value)} />

                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" name="password" placeholder="GMoney527" required value={password} onChange={(e) => setPassword(e.target.value)}/>

                  <button type="submit">Log In</button>
              </form>
          </div>

          <div className="image-section">
              <img src="/Images/Stan-login.jpg" alt="Valdez Family Medicine"/>
          </div>
      </main>
    </>
  )
}

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
          <a href="#">User Management</a>
          <a href="#">System Settings</a>
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

function DashboardPatient () {
  return (
    <>
      <div className="dashboard-container">
    
      <aside className="sidebar">
        <div className="logo">
          <img src="./Images/Logo_White.png" alt="Valdez MD Logo White" />
        </div>
        <nav className="nav-menu">
          <a className="nav-item active" href="#">Dashboard</a>
          <a className="nav-item" href="#">Schedule an appointment</a>
          <a className="nav-item" href="#">Contact a doctor</a>
          <a className="nav-item" href="#">Refill prescription</a>
        </nav>
        <div className="settings">
          <a href="#">Settings</a>
          <a href="#">Logout</a>
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
    </>
  )
}

function App() {
  return <Login />;
}

export default App
