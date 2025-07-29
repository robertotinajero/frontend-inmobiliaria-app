// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaHome, FaFileContract, FaBuilding, FaUsers } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 font-bold text-lg border-b border-gray-700">
        Inmobiliaria
      </div>
      <nav className="mt-4 flex flex-col gap-2 p-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `p-2 rounded flex items-center gap-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaHome /> Inicio
        </NavLink>

        <NavLink
          to="/contracts"
          className={({ isActive }) =>
            `p-2 rounded flex items-center gap-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaFileContract /> Contratos
        </NavLink>

        <NavLink
          to="/properties"
          className={({ isActive }) =>
            `p-2 rounded flex items-center gap-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaBuilding /> Propiedades
        </NavLink>

        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            `p-2 rounded flex items-center gap-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaUsers /> Inquilinos
        </NavLink>
        <NavLink
          to="/landlords"
          className={({ isActive }) =>
            `p-2 rounded flex items-center gap-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FaUsers /> Arrendadores
        </NavLink>
      </nav>
    </div>
  );
}
