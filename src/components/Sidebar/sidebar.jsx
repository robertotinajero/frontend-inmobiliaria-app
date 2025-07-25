// src/components/Sidebar/sidebar.jsx
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 font-bold text-lg border-b border-gray-700">Inmobiliaria</div>
      <nav className="mt-4 flex flex-col gap-2 p-2">
        <Link to="/home" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
          <FaHome /> Inicio
        </Link>
        <Link to="/usuarios" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
          <FaUser /> Usuarios
        </Link>
        {/* Agrega más enlaces según los roles */}
        <button className="mt-auto hover:bg-red-600 p-2 rounded flex items-center gap-2">
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </nav>
    </div>
  );
}
