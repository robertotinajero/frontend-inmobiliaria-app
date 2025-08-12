// src/components/Layout/layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Navbar/navbar';

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <div className="pl-64">
        <Navbar />
        <main className="pt-16 p-4 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
