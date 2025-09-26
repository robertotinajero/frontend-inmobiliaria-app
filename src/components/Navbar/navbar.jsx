import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaEnvelope,
  FaCog,
  FaMoon,
  FaSun,
  FaUser,
  FaSignOutAlt,
  FaLock,
  FaLifeRing,
  FaUserCircle,
} from "react-icons/fa";
import "./navbar.css";

export default function Navbar({ user, onToggleSidebar, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
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

  // Activa/desactiva clase dark
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-b px-6 py-3 flex justify-between items-center shadow-sm transition-all duration-300">
      {/* Izquierda: botón sidebar */}
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
        {/* <div className="relative">
          <FaEnvelope className="text-gray-600 w-5 h-5 hover:text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full px-1">4</span>
        </div>
        <div className="relative">
          <FaBell className="text-gray-600 w-5 h-5 hover:text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </div> */}

        {/* Botón Dark/Light mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400 w-5 h-5" />
          ) : (
            <FaMoon className="text-gray-600 dark:text-gray-300 w-5 h-5" />
          )}
        </button>

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
              <p className="px-4 py-2 text-gray-500">Bienvenido</p>
              <Link
                to="/account"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaUser /> Mi cuenta
              </Link>
              <Link
                to="/settings"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaCog /> Configuración
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

// src/components/Navbar/Navbar.jsx
// import { useState } from "react";
// import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

// export default function Navbar({ onToggleSidebar, onLogout, user }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);

//   const notifications = [
//     "Nuevo contrato firmado",
//     "Propiedad ocupada",
//     "Usuario registrado",
//   ];

//   return (
//     <div className="sticky top-0 z-40 h-16 bg-white shadow flex items-center justify-between px-4">
//       {/* Sidebar toggle + Logo + Título */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onToggleSidebar}
//           className="text-gray-600 hover:text-gray-800"
//         >
//           <FaBars size={22} />
//         </button>
//       </div>

//       {/* Notificaciones + Usuario */}
//       <div className="flex items-center gap-6 relative">
//         {/* Notificaciones */}
//         <div className="relative">
//           <button
//             onClick={() => setNotifOpen(!notifOpen)}
//             className="text-gray-600 hover:text-gray-800 relative"
//           >
//             <FaBell size={18} />
//             {notifications.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
//                 {notifications.length}
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
//               <h3 className="text-sm font-bold mb-2">Notificaciones</h3>
//               <ul>
//                 {notifications.map((n, idx) => (
//                   <li
//                     key={idx}
//                     className="text-sm text-gray-700 border-b py-1 last:border-none"
//                   >
//                     {n}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Menú Usuario */}
//         <div className="relative">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
//           >
//             {user?.avatar ? (
//               <img
//                 src={user.avatar}
//                 alt="avatar"
//                 className="w-8 h-8 rounded-full"
//               />
//             ) : (
//               <FaUserCircle size={26} />
//             )}
//             <span className="hidden md:block font-medium">
//               {user?.name || "Usuario"}
//             </span>
//           </button>

//           {menuOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
//               <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
//                 Ver perfil
//               </button>
//               <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
//                 Configuración
//               </button>
//               <hr className="my-1" />
//               <button
//                 onClick={onLogout}
//                 className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
//               >
//                 Cerrar sesión
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
  );
}
