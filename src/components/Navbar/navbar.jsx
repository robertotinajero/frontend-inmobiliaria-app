import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaEnvelope,
  FaCog,
  FaMoon,
  FaUser,
  FaSignOutAlt,
  FaLock,
  FaLifeRing,
  FaUserCircle,
} from "react-icons/fa";
import "./navbar.css";

export default function Navbar({ user, onToggleSidebar, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-navbar-black text-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Izquierda: Menú y título */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:text-white-800"
        >
          ☰
        </button>
      </div>

      {/* Derecha: Iconos y usuario */}
      <div className="flex items-center gap-6 relative">
        {/* Notificaciones */}
        <div className="relative">
          <FaEnvelope className="text-gray-600 w-5 h-5 hover:text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full px-1">4</span>
        </div>
        <div className="relative">
          <FaBell className="text-gray-600 w-5 h-5 hover:text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </div>

        {/* Configuración y modo oscuro */}
        <FaCog className="text-gray-600 w-5 h-5 hover:text-blue-600 cursor-pointer" />
        <FaMoon className="text-gray-600 w-5 h-5 hover:text-blue-600 cursor-pointer" />

        {/* Usuario */}
        <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setUserMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 hover:text-white-800"
        >
          <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" // Coloca aquí tu ruta de imagen de perfil
              alt="user"
              className="w-8 h-8 rounded-full object-cover border"
          />
          <span className="text-sm font-medium">{user?.fullname || "Adams"}</span>
          
          <svg className={`w-4 h-4 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor"
                 strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
        </button>

        {/* Submenú */}
        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow z-50 py-2 text-sm">
            <p className="px-4 py-2 text-gray-500">Welcome!</p>
            <Link to="/account" className="px-4 py-2 text-gray-500 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => userMenuOpen(false)}>
              <FaUser />Account
            </Link>
            <Link to="/settings" className="px-4 py-2 text-gray-500 hover:bg-gray-100 flex items-center gap-2">
                <FaCog /> Settings
              </Link>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
            >
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
      </div>

      
    </nav>
  );
}
