// src/pages/property/Properties.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";
import PropertyModal from "./PropertyModal";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    const data = await apiFetch("/api/properties/");
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Propiedades</h1>
        <button
          onClick={() => {
            setEditingProperty(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nueva
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Cuartos</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Estado</th>
              <th className="p-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Cargando...
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr key={p.id_property} className="border-b">
                  <td className="p-2">{p.nm_property}</td>
                  <td className="p-2">
                    {p.type} ({p.size} m²)
                  </td>
                  <td className="p-2">{p.rooms}</td>
                  <td className="p-2">
                    {`${p.street}, ${p.colony}, C.P. ${p.postal_code}, ${p.municipality}, ${p.state}`}
                  </td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => {
                        setEditingProperty(p);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 mr-2"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <PropertyModal
          property={editingProperty}
          onClose={() => setModalOpen(false)}
          onSaved={fetchProperties}
        />
      )}
    </div>
  );
}
