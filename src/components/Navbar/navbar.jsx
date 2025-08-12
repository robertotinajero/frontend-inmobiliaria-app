// src/components/Navbar/Navbar.jsx
import { useState } from "react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar({ onToggleSidebar, onLogout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    "Nuevo contrato firmado",
    "Propiedad ocupada",
    "Usuario registrado",
  ];

  return (
    <div className="sticky top-0 z-40 h-16 bg-white shadow flex items-center justify-between px-4">
      {/* Sidebar toggle + Logo + Título */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaBars size={22} />
        </button>
      </div>

      {/* Notificaciones + Usuario */}
      <div className="flex items-center gap-6 relative">
        {/* Notificaciones */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-gray-600 hover:text-gray-800 relative"
          >
            <FaBell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
              <h3 className="text-sm font-bold mb-2">Notificaciones</h3>
              <ul>
                {notifications.map((n, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 border-b py-1 last:border-none"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Menú Usuario */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUserCircle size={26} />
            )}
            <span className="hidden md:block font-medium">
              {user?.name || "Usuario"}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
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
