// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import "../../assets/css/Sidebar.css"; // si tienes estilos extras

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed top-0 left-0 flex flex-col">
      {/* Logo */}
      <div className="p-1 flex items-center justify-center border-b">
        <img
                    src="/src/assets/img/logo/logo_2.png"
                    alt="Grupo Peña"
                    className="h-16 object-contain"
                     width="90"
          height="45"
                />
       
      </div>

      {/* Menu principal */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <p className="text-xs font-bold tracking-wide text-gray-600 px-4 mt-4 mb-2">
          Menú
        </p>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-semibold rounded-md 
            ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/contracts"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-semibold rounded-md 
            ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          Contratos
        </NavLink>
        <NavLink
          to="/properties"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-semibold rounded-md 
            ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          Propiedades
        </NavLink>
        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-semibold rounded-md 
            ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          Inquilinos
        </NavLink>
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-sm font-semibold rounded-md 
            ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          Configuración
        </NavLink>
      </div>

      {/* Logout */}
      <div className="px-4 py-3 border-t">
        <button className="flex items-center text-red-500 hover:text-red-700 text-sm font-semibold">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
