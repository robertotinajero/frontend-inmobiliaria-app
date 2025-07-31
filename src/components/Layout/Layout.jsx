// src/components/Layout/layout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from '../Sidebar/sidebar';
import Navbar from "../Navbar/navbar";
import { jwtDecode } from "jwt-decode";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Leer el token y decodificar usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        handleLogout();
      }
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
        <Navbar
          user={user}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onLogout={handleLogout}
        />
        <main className="pt-16 p-4 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}