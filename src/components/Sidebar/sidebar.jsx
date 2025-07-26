// src/components/Sidebar/index.jsx
import { NavLink } from 'react-router-dom';
import { menuItems } from '../../config/menuConfig';
import { jwtDecode } from 'jwt-decode';

export default function Sidebar() {
  // Obtenemos el token
  const token = localStorage.getItem('token');

  // Si no hay token, mostramos nada (o podrías redirigir)
  if (!token) return null;
  // Decodificamos el token para obtener el rol
  const user = jwtDecode(token);

  const userRoles = user?.roles || 'viewer'; // default viewer

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 font-bold text-lg border-b border-gray-700">Inmobiliaria</div>
      <nav className="mt-4 flex flex-col gap-2 p-2">
        {menuItems
          .filter((item) =>
            item.roles.some((role) => userRoles.includes(role))
          )
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `p-2 rounded flex items-center gap-2 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`
                }
                end={item.path === '/home'}
              >
                <Icon /> {item.label}
              </NavLink>
            );
          })}
      </nav>
    </div>
  );
}
