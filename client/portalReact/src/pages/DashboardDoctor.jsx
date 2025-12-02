import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';
import Sidebar from '../components/Sidebar.jsx';

function DashboardDoctor() {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleLogout = useHandleLogout();

  // Helper function to convert 24hr to 12hr format
  const formatTime = (time24) => {
    if (!time24) return '—';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check if appointment is today
  const isTodayAndNotEnded = (dateStr, endTime) => {
    const [year, month, day] = dateStr.split("T")[0].split("-"); 
    const aptDate = new Date(year, month - 1, day); // local timezone

    const today = new Date();
    const isToday = (
      aptDate.getFullYear() === today.getFullYear() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getDate() === today.getDate()
    );

    // If not today, return false
    if (!isToday) return false;

    // Check if appointment end time has passed
    if (!endTime) return true; // If no end time, show it

    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const appointmentEnd = new Date(today);
    appointmentEnd.setHours(endHours, endMinutes, 0, 0);

    // Return true only if current time is before appointment end time
    return today < appointmentEnd;
  };

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

        // Set full name from JWT
        const firstName = payload.firstName || "";
        const lastName = payload.lastName || "";
        setUserName(`${firstName} ${lastName}`.trim() || "User");

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

  const uniquePatientCount = new Set(appointments.map(a => a.patientId)).size;
  const todayAppointments = appointments.filter(apt => isTodayAndNotEnded(apt.date, apt.endTime));

  return (
    <div className="dashboard-container">
      <Sidebar role="doctor" />

      <main className="main-content">
        <header className="main-header">
          <div>
            <h1>Welcome back, Dr. {userName}!</h1>
            <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>Here's your schedule for today</p>
          </div>
        </header>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/calendar-days.png"/></div>
            <div className="stat-content">
              <h3>{todayAppointments.length}</h3>
              <p>Today's Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/users.png"/></div>
            <div className="stat-content">
              <h3>{uniquePatientCount}</h3>
              <p>Total Patients</p>
            </div>
          </div>
        </div>

        <section className="appointments-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Today's Appointments</h2>
            <Link to="/doctor/appointments" style={{ 
              color: '#3498db', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              View All →
            </Link>
          </div>
          <div className="appointment-cards">
            {loading ? (
              <p>Loading appointments...</p>
            ) : todayAppointments.length === 0 ? (
              <div className="card">
                <div className="empty-state-icon"><img src="/Images/clipboard-list.png"/></div>
                <h3>No Appointments Today</h3>
                <p>You don't have any appointments scheduled for today.</p>
              </div>
            ) : (
              todayAppointments.map((apt) => (
                <div className="card" key={apt.id || apt._id}>
                  <h1><img src="/Images/user.png"/> {apt.patientName || 'Unknown Patient'}</h1>
                  <h2><img src="/Images/clipboard-list.png"/> {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }) : '—'}</h2>
                  <p className="time-badge"><img src="/Images/clock.png"/> {formatTime(apt.startTime)} - {formatTime(apt.endTime)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardDoctor;