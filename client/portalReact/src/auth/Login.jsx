import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both a username and a password");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", { username, password });

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Parsed JSON:", data);
      } catch (jsonErr) {
        const text = await response.text();
        console.log("Response text (not JSON):", text);
        throw new Error("Invalid server response, expected JSON");
      }

      if (!response.ok) {
        setError(data.error || data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      onLoginSuccess(data.role);
    } catch (err) {
      console.error("Login fetch error:", err);
      setError(err.message || "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header>
        <div className="logo">
          <img src="/Images/valdez_logo-black.jpg" alt="Valdez MD Logo Black" />
        </div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#" className="login-btn">Log In</a></li>
          </ul>
        </nav>
      </header>
      <main className="main-container">
        <div className="login-section">
          <h1>Valdez M.D Family Medicine</h1>
          <p>Login:</p>
          <form id="loginForm" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Stanley" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="GMoney527" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
        <div className="image-section">
          <img src="/Images/Stan-login.jpg" alt="Valdez Family Medicine" />
        </div>
      </main>
    </>
  );
}

export default Login;