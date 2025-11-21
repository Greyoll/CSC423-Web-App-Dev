import { Link } from 'react-router-dom';
import { useHandleLogout } from '../hooks/useLogin';

function Sidebar({ role }) {
  const handleLogout = useHandleLogout();

  return (
    <aside className="sidebar">
      
      {/* Logo */}
      <div className="logo">
        <img src="/Images/valdez_logo-white.png" alt="Valdez MD Logo White" />
      </div>

      {/* Role-specific navigation */}
      <nav className="nav-menu">
        {role === "patient" && (
          <>
            <Link className="nav-item" to="/patient/dashboard"><img src="/Images/house-heart.png"/> Dashboard</Link>
            <Link className="nav-item" to="/patient/appointments"><img src="/Images/clipboard.png"/> Appointments</Link>
            <Link className="nav-item" to="/settings"><img src="/Images/settings.png"/> Settings</Link>

        <a
          className="nav-item"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <img src="/Images/log-out.png"/> Logout
        </a>
          </>
        )}

        {role === "doctor" && (
          <>
            <Link className="nav-item" to="/doctor/dashboard"><img src="/Images/house-heart.png"/> Dashboard</Link>
            <Link className="nav-item" to="/doctor/appointments"><img src="/Images/clipboard.png"/> Appointments</Link>
            <Link className="nav-item" to="/settings"><img src="/Images/settings.png"/> Settings</Link>

        <a
          className="nav-item"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <img src="/Images/log-out.png"/> Logout
        </a>
          </>
        )}

        {role === "admin" && (
          <>
            <Link className="nav-item" to="/admin/dashboard"><img src="/Images/house-heart.png"/> Dashboard</Link>
            <Link className="nav-item" to="/admin/appointments"><img src="/Images/clipboard.png"/> Appointments</Link>
            <Link className="nav-item" to="/admin/users"><img src="/Images/user-pen.png"/> User Management</Link>
            <Link className="nav-item" to="/settings"><img src="/Images/settings.png"/> Settings</Link>

        <a
          className="nav-item"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <img src="/Images/log-out.png"/> Logout
        </a>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
