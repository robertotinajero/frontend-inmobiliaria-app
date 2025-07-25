// src/components/Layout/layout.jsx
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <main className="pl-64 pt-16 p-4 bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
}
