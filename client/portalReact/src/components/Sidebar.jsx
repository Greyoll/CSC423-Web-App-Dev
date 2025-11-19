import { Link } from 'react-router-dom';
import { useHandleLogout } from '../hooks/useLogin';

function Sidebar({ role }) {
  const handleLogout = useHandleLogout();

  return (
    <aside className="sidebar">
      
      {/* Logo */}
      <div className="logo">
        <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
      </div>

      {/* Role-specific navigation */}
      <nav className="nav-menu">
        {role === "patient" && (
          <>
            <Link className="nav-item" to="/patient/dashboard">Dashboard</Link>
            <Link className="nav-item" to="/patient/appointments">Appointments</Link>
            <Link className="nav-item" to="/settings">Settings</Link>

        <a
          className="nav-item"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </a>
          </>
        )}

        {role === "doctor" && (
          <>
            <Link className="nav-item" to="/doctor/dashboard">Dashboard</Link>
            <Link className="nav-item" to="/doctor/appointments">Appointments</Link>
            <Link className="nav-item" to="/settings">Settings</Link>

        <a
          className="nav-item"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </a>
          </>
        )}

        {role === "admin" && (
          <>
            <Link className="nav-item" to="/admin/dashboard">Dashboard</Link>
            <Link className="nav-item" to="/admin/appointments">Appointments</Link>
            <Link className="nav-item" to="/admin/users">User Management</Link>
            <Link className="nav-item" to="/settings">Settings</Link>

        <a
          className="nav-item"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </a>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
