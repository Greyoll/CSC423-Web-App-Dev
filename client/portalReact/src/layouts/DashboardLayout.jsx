import Sidebar from "../components/Sidebar";
import { parseJwt } from "../hooks/useLogin";

function DashboardLayout({ children }) {
  const token = localStorage.getItem("token");
  const payload = token ? parseJwt(token) : null;
  const role = payload?.role || "patient"; // default fallback

  return (
    <div className="dashboard-container">
      <Sidebar role={role} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
