import React, { useState } from "react";

export default function DashboardPatient() {
  const [activePage, setActivePage] = useState("dashboard");
  const [userName] = useState("Paige");

  // Upcoming appointments (state so we can remove items)
  const [upcoming, setUpcoming] = useState([
    { id: 1, title: "Check Up", doctor: "Dr. Stanley Valdez", date: "04/20/2026 6:09AM" },
    { id: 2, title: "Retinal Exam", doctor: "Dr. Ryan F", date: "02/02/2027 5:00PM" },
    { id: 3, title: "GI Appointment", doctor: "Dr. Collin F", date: "08/30/2027 8:00AM" },
  ]);

  // Appointment history (static for now)
  const history = [
    { title: "Blood Test", doctor: "Dr. Stanley Valdez", date: "04/20/2022 6:09AM" },
    { title: "Physical", doctor: "Dr. Jenny E", date: "07/07/2023 7:50AM" },
    { title: "General Wellness", doctor: "Dr. James H", date: "12/30/2023 8:00AM" },
  ];

  // Cancel upcoming appointment
  function handleCancel(id) {
    setUpcoming(prev => prev.filter(appointment => appointment.id !== id));
  }

  function NavItem({ page, label }) {
    return (
      <a
        href="#"
        onClick={() => setActivePage(page)}
        className={`nav-item ${activePage === page ? "active" : ""}`}
      >
        {label}
      </a>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
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
          <a href="#">Settings</a>
          <a href="#">Logout</a>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {userName}</span>
          </div>
        </header>

        {/* DASHBOARD HOME */}
        {activePage === "dashboard" && (
          <>
            {/* Upcoming Appointments */}
            <section className="appointments-section">
              <h2>Upcoming Appointments</h2>
              <div className="appointment-cards">
                {upcoming.length > 0 ? (
                  upcoming.map(a => (
                    <div className="card" key={a.id}>
                      <h1>{a.title}</h1>
                      <h2>{a.doctor}</h2>
                      <p>{a.date}</p>

                      <button 
                        className="cancel-btn" 
                        onClick={() => handleCancel(a.id)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No upcoming appointments.</p>
                )}
              </div>
            </section>

            {/* Appointment History */}
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

        {activePage === "schedule" && <h2>Schedule form goes here...</h2>}
        {activePage === "contact" && <h2>Message doctor form...</h2>}
        {activePage === "refill" && <h2>Refill request form...</h2>}
      </main>
    </div>
  );
}
