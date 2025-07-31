import { useState } from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import "./navbar.css";

export default function Navbar({ user, onToggleSidebar, onLogout }) {
  return (
    <div className="h-16 bg-white shadow-md fixed w-full top-0 z-40 flex items-center justify-between px-4">
      <button
        onClick={onToggleSidebar}
        className="text-gray-600 hover:text-gray-800"
      >
        ☰
      </button>

      <div className="flex items-center gap-2">
        <FaUserCircle size={28} className="text-gray-600" />
        <span className="text-gray-700 font-semibold">
          {user?.name || "Usuario"}
        </span>
        <button
          onClick={onLogout}
          className="ml-2 text-red-600 hover:text-red-800 text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
