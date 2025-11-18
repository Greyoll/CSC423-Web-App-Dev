import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role, token) => {
    localStorage.setItem("token", token);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    userRole,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}