// src/pages/Properties.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";
import PropertyModal from "./PropertyModal";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/properties`);
      setProperties(
        data.filter((p) =>
          p.nm_property.toLowerCase().includes(search.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search]);

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar esta propiedad?")) {
      try {
        await apiFetch(`/properties/${id}`, { method: "DELETE" });
        fetchProperties();
      } catch (error) {
        console.error("Error eliminando propiedad:", error);
      }
    }
  };

  const handleSave = async (propertyData) => {
    try {
      if (selectedProperty) {
        // Actualizar
        await apiFetch(`/properties/${selectedProperty.id_property}`, {
          method: "PUT",
          body: JSON.stringify(propertyData),
        });
      } else {
        // Crear
        await apiFetch(`/properties`, {
          method: "POST",
          body: JSON.stringify(propertyData),
        });
      }
      setIsModalOpen(false);
      fetchProperties();
    } catch (error) {
      console.error("Error guardando propiedad:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Propiedades</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setSelectedProperty(null);
            setIsModalOpen(true);
          }}
        >
          + Nueva propiedad
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
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Cargando propiedades...
                </td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No se encontraron propiedades
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr key={p.id_property} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{p.nm_property}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">{p.address}</td>
                  <td className="px-4 py-3">{p.phone || "-"}</td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => {
                        setSelectedProperty(p);
                        setIsModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleDelete(p.id_property)}
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
        <PropertyModal
          property={selectedProperty}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
