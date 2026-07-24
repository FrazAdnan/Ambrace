import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await fetch(`${SERVER_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error. Is the server running?' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Network error. Is the server running?' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
