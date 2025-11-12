import { handleLogout } from '../hooks/useLogin';

function AppointmentViewDoctor({ onBack }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
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

export default AppointmentViewDoctor;