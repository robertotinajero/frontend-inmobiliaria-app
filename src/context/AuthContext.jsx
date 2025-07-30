import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Importación correcta

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [logoutCallback, setLogoutCallback] = useState(null);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    if (logoutCallback) logoutCallback();
    else window.location.href = '/login';
  };

  const setLogoutHandler = (cb) => {
    setLogoutCallback(() => cb);
  };

  const getDecodedToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        console.warn('Token expirado');
        logout();
        return null;
      }
      return decoded;
    } catch (err) {
      console.error('Token inválido:', err.message);
      logout();
      return null;
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, setLogoutHandler, getDecodedToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
