// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFileContract,
  FaBuilding,
  FaUsers,
} from "react-icons/fa";
import "../../assets/css/Sidebar.css";

export default function Sidebar({ showSideBar, setShowSideBar }) {
  return (
    <>
      {/* Sidebar contenedor */}
      <div
        className={`w-64 h-screen bg-gray-800 text-white fixed top-0 left-0 z-50 transform transition-transform duration-300 
        ${showSideBar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex justify-center items-center p-2 border-b border-gray-700">
          <img
            src="/src/assets/img/logo/logo2.png"
            alt="Grupo Peña"
            className="h-16 object-contain"
          />
        </div>

        {/* Menú */}
        <nav className="mt-4 flex flex-col gap-2 p-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setShowSideBar(false)}
          >
            <FaHome /> Inicio
          </NavLink>

          <NavLink
            to="/contracts"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setShowSideBar(false)}
          >
            <FaFileContract /> Contratos
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setShowSideBar(false)}
          >
            <FaBuilding /> Propiedades
          </NavLink>

          <NavLink
            to="/tenants"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setShowSideBar(false)}
          >
            <FaUsers /> Inquilinos
          </NavLink>

          <NavLink
            to="/landlords"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setShowSideBar(false)}
          >
            <FaUsers /> Arrendadores
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setShowSideBar(false)}
          >
            <FaUsers /> Users
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
