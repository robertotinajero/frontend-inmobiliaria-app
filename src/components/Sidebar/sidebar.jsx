// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaBell,
  FaFileContract,
  FaBuilding,
  FaUsers,
  FaFileInvoiceDollar,
  FaCog,
} from "react-icons/fa";
import "../../assets/css/Sidebar.css";

export default function Sidebar({ collapsed }) {
  return (
    <>
      {/* Sidebar contenedor */}

      <div className={`h-screen fixed top-0 left-0 transition-all duration-300
          ${collapsed ? "w-20" : "w-64"} bg-green-800 dark:bg-gray-800 text-white dark:text-gray-100 border-r border-gray-200 dark:border-gray-700`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          <img
            src="/img/logo/logo1.png"
            alt="Grupo Peña"
            className={`object-contain transition-all ${collapsed ? "h-10" : "h-14"
              }`}
          />
        </div>

        {/* Menú */}
        <nav className="mt-4 flex flex-col gap-2 p-2">
          {/* <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaHome size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink> */}

          <NavLink
            to="/quotes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaFileInvoiceDollar size={18} />
            {!collapsed && <span>Cotizaciones</span>}
          </NavLink>

          <NavLink
            to="/contracts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaFileContract size={18} />
            {!collapsed && <span>Contratos</span>}
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaBuilding size={18} />
            {!collapsed && <span>Propiedades</span>}
          </NavLink>

          <NavLink
            to="/units"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaBuilding size={18} />
            {!collapsed && <span>Unidades</span>}
          </NavLink>


          <NavLink
            to="/tenants"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaUsers size={18} />
            {!collapsed && <span>Inquilinos</span>}
          </NavLink>

          <NavLink
            to="/landlords"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaUsers size={18} />
            {!collapsed && <span>Arrendadores</span>}
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
              ${isActive
                ? "bg-green-700 dark:bg-gray-200 text-gray-200 font-semibold dark:text-gray-800"
                : "hover:bg-green-700 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 text-gray-200 dark:text-gray-300"
              }
              }`
            }
          >
            <FaUsers size={18} />
            {!collapsed && <span>Users</span>}
          </NavLink>
        </nav>
      </div>


    </>
  );
}
