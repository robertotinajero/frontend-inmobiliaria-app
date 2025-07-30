// src/components/Layout/layout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../Sidebar/sidebar';
import Navbar from "../Navbar/navbar";
import { jwtDecode } from "jwt-decode";

export default function Layout() {
  // Estado del Sidebar
  const [showSideBar, setShowSideBar] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded)
        
        // Ejemplo: si el token tiene { name: "Roberto", email: "..."}
        setUser(decoded.fullname);
      } catch (error) {
        console.error("Token inválido", error);
      }
    }
  }, []);

  return (
    <div>
      <Sidebar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      {/* Contenido principal */}
      <div className={showSideBar ? "pl-64" : "pl-0"}>
        <Navbar 
          onToggleSidebar={() => setShowSideBar((prev) => !prev)} 
          user={user}
          onLogout={() => console.log("Cerrar sesión")}
        />
        <main className="pt-16 p-4 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
