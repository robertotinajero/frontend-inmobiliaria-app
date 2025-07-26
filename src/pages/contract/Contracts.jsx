import { useEffect, useState } from "react";
import ContractModal from "./ContractModal";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Simulación de datos
    setTimeout(() => {
      const dummyContracts = [
        { id: 1, number: "C-001", client: "Juan Pérez", property: "Casa Centro", startDate: "2025-07-01", status: "Activo" },
        { id: 2, number: "C-002", client: "María López", property: "Depto Norte", startDate: "2025-06-20", status: "Vencido" },
        { id: 3, number: "C-003", client: "Carlos Ruiz", property: "Local Sur", startDate: "2025-05-15", status: "Activo" },
      ];
      setContracts(dummyContracts);
      setTotalPages(3);
      setLoading(false);
    }, 500);
  }, [page, search]);

  const handleCreate = () => {
    setSelectedContract(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("¿Seguro que quieres eliminar este contrato?")) {
      setContracts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSave = (newContract) => {
    if (selectedContract) {
      // Editar
      setContracts((prev) =>
        prev.map((c) => (c.id === selectedContract.id ? { ...c, ...newContract } : c))
      );
    } else {
      // Crear
      setContracts((prev) => [
        ...prev,
        { id: prev.length + 1, ...newContract },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Contratos</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Nuevo contrato
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o número..."
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
              <th className="px-4 py-3">N° Contrato</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Propiedad</th>
              <th className="px-4 py-3">Fecha Inicio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Cargando contratos...
                </td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No se encontraron contratos
                </td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr key={contract.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{contract.number}</td>
                  <td className="px-4 py-3">{contract.client}</td>
                  <td className="px-4 py-3">{contract.property}</td>
                  <td className="px-4 py-3">{contract.startDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        contract.status === "Activo"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(contract)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(contract.id)}
                      className="text-red-600 hover:underline text-sm"
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

      {/* Paginación */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-2 py-1">
          {page} de {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ContractModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          contract={selectedContract}
        />
      )}
    </div>
  );
}
