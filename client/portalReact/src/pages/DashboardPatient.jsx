import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';
import Sidebar from '../components/Sidebar';

function DashboardPatient() {
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

  // Check if appointment is upcoming
  const isUpcoming = (dateStr) => {
    const aptDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return aptDate >= today;
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

  const upcomingAppointments = appointments.filter(apt => isUpcoming(apt.date));

  return (
    <div className="dashboard-container">
      <Sidebar role="patient" />

      <main className="main-content">
        <header className="main-header">
          <div>
            <h1>Welcome back, {userName}!</h1>
            <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>Here's your health overview</p>
          </div>
          <div className="user-info">
            <span>{userName}</span>
          </div>
        </header>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/calendar-days.png"/></div>
            <div className="stat-content">
              <h3>{upcomingAppointments.length}</h3>
              <p>Upcoming Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><img src="/Images/clipboard-list.png"/></div>
            <div className="stat-content">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
        </div>

        <section className="appointments-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Upcoming Appointments</h2>
            <Link to="/patient/appointments" style={{ 
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
            ) : upcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"></div>
                <h3>No Upcoming Appointments</h3>
                <p>You don't have any appointments scheduled.</p>
              </div>
            ) : (
              upcomingAppointments.slice(0, 3).map((apt) => (
                <div className="card" key={apt.id || apt._id}>
                  <h1>Dr. {apt.doctorName || 'Unknown'}</h1>
                  <h2><img src="/Images/calendar-days.png"/> {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }) : '—'}</h2>
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

export default DashboardPatient;