import { createContext, useContext, useState, useEffect, useRef,useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = jwtDecode(token);
    if (!payload || !payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const logoutTimeoutRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
  };

  const logout = useCallback(() => {
    clearLogoutTimer();
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const scheduleLogout = (token) => {
    clearLogoutTimer();
    try {
      const payload = jwtDecode(token);
      if (!payload || !payload.exp) return;
      const nowMs = Date.now();
      const expMs = payload.exp * 1000;
      const delay = expMs - nowMs;
      if (delay <= 0) {
        logout();
        return;
      }
      logoutTimeoutRef.current = setTimeout(() => {
        logout();
      }, delay);
    } catch {
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      setUser(null);
    }
    scheduleLogout(token);
    navigate("/dashboard", { replace: true });
  };

  

  // Cargar usuario desde token (si existe)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      setUser(null);
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      setUser(null);
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
      return;
    }

    scheduleLogout(token);

    return () => clearLogoutTimer();
  }, [navigate]);

  

  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;