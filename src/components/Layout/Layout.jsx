// src/components/Layout/layout.jsx
import Sidebar from './Sidebar';
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <div className="pl-64">
        <Navbar user={{ name: "Roberto Tinajero" }} onLogout={() => console.log("logout")} />
        <main className="pt-16 p-4 bg-gray-100 min-h-screen relative">{children}</main>
      </div>
    </div>
  );
}
