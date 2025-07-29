// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function Navbar({ onToggleSidebar, onLogout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    "Nuevo contrato firmado",
    "Propiedad ocupada",
    "Usuario registrado",
  ];

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-green shadow-sm fixed w-full top-0 z-[1000] pl-64 pr-6 flex items-center justify-between">
      {/* Botón toggle + título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-gray-800 lg:hidden"
        >
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
      </div>

      {/* Notificaciones + usuario */}
      <div className="flex items-center gap-6">
        {/* Notificaciones */}
        <div className="relative dropdown">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setMenuOpen(false);
            }}
            className="relative text-gray-600 hover:text-gray-800"
          >
            <FaBell size={22} />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-lg z-[9999]">
              <div className="p-3 border-b text-gray-700 font-semibold">
                Notificaciones
              </div>
              <ul>
                {notifications.map((n, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Usuario */}
        <div className="relative dropdown">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 text-gray-700"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUserCircle size={28} />
            )}
            <span className="hidden md:block font-medium">
              {user?.name || "Usuario"}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-[9999]">
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Ver perfil
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Configuración
              </button>
              <hr className="my-1" />
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
