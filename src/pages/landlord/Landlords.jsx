// src/pages/Landlords.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";
import LandlordModal from "./LandlordModal";

export default function Landlords() {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState(null);

  const fetchLandlords = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/landlords`);
      setLandlords(
        data.filter((l) =>
          `${l.firstname} ${l.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error cargando arrendadores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, [search]);

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este arrendador?")) {
      try {
        await apiFetch(`/landlords/${id}`, { method: "DELETE" });
        fetchLandlords();
      } catch (error) {
        console.error("Error eliminando arrendador:", error);
      }
    }
  };

  const handleSave = async (landlordData) => {
    try {
      if (selectedLandlord) {
        // Actualizar
        await apiFetch(`/landlords/${selectedLandlord.id_landlord}`, {
          method: "PUT",
          body: JSON.stringify(landlordData),
        });
      } else {
        // Crear
        await apiFetch(`/landlords`, {
          method: "POST",
          body: JSON.stringify(landlordData),
        });
      }
      setIsModalOpen(false);
      fetchLandlords();
    } catch (error) {
      console.error("Error guardando arrendador:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Arrendadores</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setSelectedLandlord(null);
            setIsModalOpen(true);
          }}
        >
          + Nuevo arrendador
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">RFC</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Cargando arrendadores...
                </td>
              </tr>
            ) : landlords.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No se encontraron arrendadores
                </td>
              </tr>
            ) : (
              landlords.map((l) => (
                <tr key={l.id_landlord} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {l.firstname} {l.lastname}
                  </td>
                  <td className="px-4 py-3">{l.rfc || "-"}</td>
                  <td className="px-4 py-3">{l.phone || "-"}</td>
                  <td className="px-4 py-3">{l.email || "-"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => {
                        setSelectedLandlord(l);
                        setIsModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleDelete(l.id_landlord)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <LandlordModal
          landlord={selectedLandlord}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
