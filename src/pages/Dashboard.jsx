// src/pages/Dashboard.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/sidebar';
import Navbar from '../components/Navbar/navbar';

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <div className="pl-64">
        <Navbar />
        <main className="pt-16 p-4 bg-gray-100 min-h-screen">
          <Outlet /> {/* Aquí se renderizan las subrutas */}
        </main>
      </div>
    </div>
  );
}