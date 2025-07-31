// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFileContract, FaBuilding, FaUsers } from "react-icons/fa";
import "../../assets/css/Sidebar.css";

export default function Sidebar({ showSideBar, setShowSideBar }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      {/* Sidebar contenedor */}
      <div
        className={`h-screen bg-[#0B1D51] text-white fixed top-0 left-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4">
          <img
            src="/src/assets/img/logo/logo2.png"
            alt="Grupo Peña"
            className="h-16 object-contain"
          />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-gray-300"
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Menú */}
        <nav className="mt-4 flex flex-col gap-2 p-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive ? "bg-[#1D2D69]" : "hover:bg-[#1D2D69]"
              }`
            }
          >
            <FaHome size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/contracts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive ? "bg-[#1D2D69]" : "hover:bg-[#1D2D69]"
              }`
            }
          >
            <FaFileContract /> Contratos
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive ? "bg-[#1D2D69]" : "hover:bg-[#1D2D69]"
              }`
            }
          >
            <FaBuilding size={18} />
            {!collapsed && <span>Propiedades</span>}
          </NavLink>

          <NavLink
            to="/tenants"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive ? "bg-[#1D2D69]" : "hover:bg-[#1D2D69]"
              }`
            }
          >
            <FaUsers size={18} />
            {!collapsed && <span>Inquilinos</span>}
          </NavLink>

          <NavLink
            to="/landlords"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive ? "bg-[#1D2D69]" : "hover:bg-[#1D2D69]"
              }`
            }
          >
            <FaUsers size={18} />
            {!collapsed && <span>Arrendadores</span>}
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive ? "bg-[#1D2D69]" : "hover:bg-[#1D2D69]"
              }`
            }
          >
            <FaUsers size={18} />
            {!collapsed && <span>Users</span>}
          </NavLink>
        </nav>
      </div>

      {/* Overlay (para cerrar el sidebar en móvil) */}
      {showSideBar && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => setShowSideBar(false)}
        ></div>
      )}
    </>
  );
}
