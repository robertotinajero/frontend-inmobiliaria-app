// src/config/menuConfig.js
import { FaHome, FaUser, FaFileContract } from 'react-icons/fa';

export const menuItems = [
  {
    label: 'Home',
    path: '/home',
    icon: FaHome,
    roles: ['Admin', 'editor', 'viewer'], // todos lo pueden ver
  },
  {
    label: 'Contratos',
    path: '/home/contratos',
    icon: FaFileContract,    // Icono de contratos
    roles: ['Admin', 'editor'], // Solo admin y editor pueden verlo
  },
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: FaUser,
    roles: ['Admin', 'editor'], // solo admin y editor
  },
  // Puedes agregar más opciones
];
