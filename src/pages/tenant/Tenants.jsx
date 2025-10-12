// src/pages/Tenants.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";
import TenantModal from "./TenantModal";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/tenants/`);
      setTenants(
        data.filter((t) =>
          `${t.firstname} ${t.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error cargando inquilinos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [search]);

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este inquilino?")) {
      try {
        await apiFetch(`/api/tenants/${id}`, { method: "DELETE" });
        fetchTenants();
      } catch (error) {
        console.error("Error eliminando inquilino:", error);
      }
    }
  };

  const handleSave = async (tenantData) => {
    try {
      if (selectedTenant) {
        // Actualizar
        await apiFetch(`/api/tenants/${selectedTenant.id_tenant}`, {
          method: "PUT",
          body: tenantData, // <-- FormData directo
          headers: {}, // No poner Content-Type, lo maneja fetch automáticamente
        });
      } else {
        // Crear
        await apiFetch(`/api/tenants`, {
          method: "POST",
          body: tenantData, // <-- FormData directo
          headers: {}, // No poner Content-Type
        });
      }
      setIsModalOpen(false);
      fetchTenants();
    } catch (error) {
      console.error("Error guardando inquilino:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Inquilinos</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setSelectedTenant(null);
            setIsModalOpen(true);
          }}
        >
          + Nuevo inquilino
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          id="search-tenants"
          name="search-tenants"
          type="text"
          placeholder="Buscar por nombre o email..."
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
              <th className="px-4 py-3">CURP</th>
              <th className="px-4 py-3">RFC</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  Cargando inquilinos...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No se encontraron inquilinos
                </td>
              </tr>
            ) : (
              tenants.map((t) => (
                <tr key={t.id_tenant} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {t.firstname} {t.lastname}
                  </td>
                  <td className="px-4 py-3">{t.curp || "-"}</td>
                  <td className="px-4 py-3">{t.rfc || "-"}</td>
                  <td className="px-4 py-3">{t.phone || "-"}</td>
                  <td className="px-4 py-3">{t.email || "-"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => {
                        setSelectedTenant(t);
                        setIsModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleDelete(t.id_tenant)}
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
        <TenantModal
          tenant={selectedTenant}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
