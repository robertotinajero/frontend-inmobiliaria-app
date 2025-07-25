// src/components/Navbar/navbar.jsx
export default function Navbar() {
  return (
    <div className="h-16 bg-white shadow-md pl-64 pr-4 flex items-center justify-between fixed w-full top-0 z-10">
      <div className="font-semibold text-xl">Dashboard</div>
      <div className="text-sm text-gray-600">Bienvenido, Usuario</div>
    </div>
  );
}
