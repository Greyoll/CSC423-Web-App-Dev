import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="dashboard-container">

    <aside class="sidebar">
      <nav class="nav-menu">
        <a class="nav-item active" href="#">Dashboard</a>
        <a class="nav-item" href="#">Patient Records</a>
        <a class="nav-item" href="#">Appointments</a>
        <a class="nav-item" href="#">Prescriptions</a>
        <a class="nav-item" href="#">Messages</a>
      </nav>
      <div class="settings">
        <a href="#">Settings</a>
        <a href="#">Logout</a>
      </div>
    </aside>

    <main class="main-content">
      <header class="main-header">
        <h1>Doctor Dashboard</h1>
        <div class="user-info">
          <span>Dr. Stanley Valdez</span>
        </div>
      </header>

      <section class="appointments-section">
        <h2>Today's Appointments</h2>
        <div class="appointment-cards">
          <div class="card">
            <h1>Patient: John Doe</h1>
            <h2>Reason: Annual Check-Up</h2>
            <p>8:30 AM - Exam Room 1</p>
          </div>
          <div class="card">
            <h1>Patient: Sarah Connor</h1>
            <h2>Reason: Follow-Up Consultation</h2>
            <p>10:00 AM - Exam Room 2</p>
          </div>
          <div class="card">
            <h1>Patient: Michael Smith</h1>
            <h2>Reason: Lab Review</h2>
            <p>1:30 PM - Virtual</p>
          </div>
        </div>
      </section>

      <section class="appointments-section">
        <h2>Recent Patient Updates</h2>
        <div class="appointment-cards">
          <div class="card">
            <h1>Jane Foster</h1>
            <h2>New Lab Results Available</h2>
            <p>Uploaded: 10/12/2025</p>
          </div>
          <div class="card">
            <h1>Peter Parker</h1>
            <h2>Medication Adjustment Submitted</h2>
            <p>Submitted: 10/13/2025</p>
          </div>
          <div class="card">
            <h1>Tony Stark</h1>
            <h2>Cardiology Referral Sent</h2>
            <p>Updated: 10/10/2025</p>
          </div>
        </div>
      </section>

      <section class="appointments-section">
        <h2>New Messages</h2>
        <div class="appointment-cards">
          <div class="card">
            <h1>From: John Doe</h1>
            <h2>Subject: Question about medication</h2>
            <p>Received: 10/14/2025</p>
          </div>
          <div class="card">
            <h1>From: Sarah Connor</h1>
            <h2>Subject: Appointment follow-up</h2>
            <p>Received: 10/13/2025</p>
          </div>
          <div class="card">
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

export default App
