// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="space-y-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800">Bienvenido al Dashboard</h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Usuarios */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-sm">Usuarios</span>
          <span className="text-2xl font-bold text-gray-800 mt-2">1,234</span>
          <span className="text-green-500 text-xs mt-1">+5% este mes</span>
        </div>

        {/* Propiedades */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-sm">Propiedades</span>
          <span className="text-2xl font-bold text-gray-800 mt-2">256</span>
          <span className="text-green-500 text-xs mt-1">+2% este mes</span>
        </div>

        {/* Ingresos */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-sm">Ingresos</span>
          <span className="text-2xl font-bold text-gray-800 mt-2">$98,765</span>
          <span className="text-red-500 text-xs mt-1">-1% este mes</span>
        </div>

        {/* Tickets */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-start">
          <span className="text-gray-500 text-sm">Tickets activos</span>
          <span className="text-2xl font-bold text-gray-800 mt-2">18</span>
          <span className="text-green-500 text-xs mt-1">+3 abiertos</span>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad reciente</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="border-b pb-2">
            <span className="font-semibold">Juan Pérez</span> agregó una propiedad en Querétaro
            <span className="text-gray-400 text-xs ml-2">hace 2h</span>
          </li>
          <li className="border-b pb-2">
            <span className="font-semibold">María López</span> cerró un ticket de soporte
            <span className="text-gray-400 text-xs ml-2">hace 5h</span>
          </li>
          <li>
            <span className="font-semibold">Pedro Gómez</span> registró un nuevo usuario
            <span className="text-gray-400 text-xs ml-2">hace 1d</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
