// src/pages/UserManagementViewAdmin.jsx (UPDATED)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseJwt, useHandleLogout } from '../hooks/useLogin';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from '../components/ConfirmationModal'; 
import Sidebar from '../components/Sidebar.jsx';

function UserManagementViewAdmin() {
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
    const [showConfirmation, setShowConfirmation] = useState(false); 
    const [userToDelete, setUserToDelete] = useState(null); 
    const { addNotification } = useNotification();
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
            addNotification("Couldn't fetch users", 'error');
        }
    };

    const handleSave = async () => {
        // Validate required fields
        if (!editingUser && (!formData.firstName || !formData.lastName || !formData.password || !formData.username || !formData.role)) {
            addNotification("Please fill all fields", 'warning');
            return;
        }
        if (editingUser && (!formData.firstName || !formData.lastName || !formData.username || !formData.role)) {
            addNotification("Please fill all required fields (password not required for existing users)", 'warning');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const method = editingUser ? "PUT" : "POST";
            const url = editingUser
                ? `http://localhost:3000/api/users/${editingUser.id}`
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
                let errorMessage = "Error saving user";
                try {
                    const errData = await res.json();
                    errorMessage = errData.error || errData.message || errorMessage;
                } catch {
                    const errText = await res.text();
                    errorMessage = errText || errorMessage;
                }
                addNotification(errorMessage, 'error');
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
            addNotification(editingUser ? "User updated successfully!" : "User added successfully!", 'success');
        } catch (err) {
            console.error(err);
            addNotification("Error saving user. Check console for details.", 'error');
        }
    };

    // Open confirmation modal to ensure user wants to delete user
    const openDeleteConfirmation = (userId, userName) => {
        setUserToDelete({ id: userId, name: userName });
        setShowConfirmation(true);
    };

    // User wants to delete user
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/users/${userToDelete.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                addNotification("User deleted successfully!", 'success');
            } else {
                addNotification("Failed to delete user", 'error');
            }
        } catch (err) {
            addNotification("Error deleting user: " + err.message, 'error');
        }
        
        setShowConfirmation(false);
        setUserToDelete(null);
        fetchUsers();
    };

    // User doesnt want to delete user
    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setUserToDelete(null);
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="admin" />

            {/* CONFIRMATION MODAL */}
            <ConfirmationModal
                isOpen={showConfirmation}
                title="Delete User?"
                message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete User"
                cancelText="Cancel"
                isDangerous={true}
            />

            <main className="main-content">
                <header className="main-header">
                    <h1>Admin Dashboard</h1>
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
                                <th>ID</th>
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
                                <tr key={u.id}>
                                    <td>{u.id}</td>
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
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}>Edit</button>
                                        <button 
                                            onClick={() => openDeleteConfirmation(u.id, `${u.firstName} ${u.lastName}`)}
                                            style={{ backgroundColor: '#d32f2f', color: 'white' }}
                                        >
                                            Delete
                                        </button>
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