import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';

function UserManagementViewAdmin(){
    const [userName, setUserName] = useState("");
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        role: "patient",
        password: "",
    });
    const handleLogout = useHandleLogout();

    useEffect(() => {
        fetchUsers();
    }, []);

    // Use effect to get users name for display
    useEffect(() => {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
        if (payload) {
            const firstName = payload.firstName || "";
            const lastName = payload.lastName || "";
            setUserName(`${firstName} ${lastName}`.trim() || "User");
        };
    }, []);

    const fetchUsers = async () => {
        try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
        } catch (err) {
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
            "Authorization": "Bearer " + localStorage.getItem("token")
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
        alert("Error saving user. Check console for details.");
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
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo">
                    <img src="/Images/Logo_White.png" alt="Valdez MD Logo White" />
                    <h1 className="nav-item">Admin Page</h1>
                </div>
                <nav className="nav-menu">
                    <Link className="nav-item" to="/admin/dashboard">Dashboard</Link>
                    <a className="nav-item" href="#">Patient Records</a>
                    <Link className="nav-item" to="/admin/appointments">Appointments</Link>
                    <a className="nav-item" href="#">Prescriptions</a>
                    <a className="nav-item" href="#">Messages</a>
                </nav>
                <div className="settings">
                    <Link className="nav-item active" to="/admin/users">User Management</Link>
                    <a href="#">System Settings</a>
                    <Link className="nav-item active" to="/settings">Settings</Link>
                    <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
                </div>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <h1>Admin Dashboard</h1>
                    <div className="user-info">
                        <span>{userName}</span>
                    </div>
                </header>
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
                                <button onClick={() => {
                                    setEditingUser(u);
                                    setFormData({
                                    firstName: u.firstName,
                                    lastName: u.lastName,
                                    username: u.username,
                                    role: u.role,
                                    password: "",
                                    });
                                }}>Edit</button>
                                <button onClick={() => handleDelete(u._id)}>Delete</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default UserManagementViewAdmin;