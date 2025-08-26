// src/pages/Contracts.jsx
import { useEffect, useState } from "react";
import ContractModal from "./ContractModal";
import apiFetch from "../../utils/apiFetch";
import { buildContractPdf } from "../../utils/contractPdf";
import { buildContractPdfReact } from "./buildContractPdfReact";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  /**
   * Cargar contratos desde el backend
   */
  const fetchContracts = async () => {
    try {
      setLoading(true);
      // GET con búsqueda y paginación (backend ya lo soporta)
      const data = await apiFetch('/api/contracts/');

      // Si el backend devuelve paginación
      if (data.items) {
        setContracts(data.items);
        setTotalPages(data.totalPages);
      } else {
        // Si devuelve un array sin paginación
        setContracts(data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error cargando contratos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [page, search]);

  /**
   * Nuevo contrato
   */
  const handleCreate = () => {
    setSelectedContract(null);
    setIsModalOpen(true);
  };

  /**
   * Editar contrato
   */
  const handleEdit = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  /**
   * Guardar contrato (crear o editar)
   */
const handleSave = async (payloadFromModal) => {
  try {
    // Normaliza tipos
    const contractPayload = {
      folio: payloadFromModal.folio,
      dt_start: payloadFromModal.dt_start,
      dt_end: payloadFromModal.dt_end || null,
      monthly_rent: Number(payloadFromModal.monthly_rent),
      security_deposit: Number(payloadFromModal.security_deposit),
      payment_day: Number(payloadFromModal.payment_day),
      penalty: payloadFromModal.penalty ? Number(payloadFromModal.penalty) : null,
      status: payloadFromModal.status,
      id_landlord: Number(payloadFromModal.id_landlord),
      id_tenant: Number(payloadFromModal.id_tenant),
      id_property: Number(payloadFromModal.id_property),
      guarantor_name: payloadFromModal.guarantor_name || null,
      guarantor_contact: payloadFromModal.guarantor_contact || null,
      notes: payloadFromModal.notes || null,
    };

    const isEdit = Boolean(selectedContract?.id_contract);
    const url = isEdit
      ? `/api/contracts/${selectedContract.id_contract}`
      : `/api/contracts/`;
    const method = isEdit ? "PUT" : "POST";

    // 1) Guardar contrato
    const saved = await apiFetch(url, {
      method,
      body: JSON.stringify(contractPayload),
    });

    const id_contract = saved?.id_contract ?? selectedContract?.id_contract;
    if (!id_contract) throw new Error("No se obtuvo id_contract del backend.");

    // 2) Cargar entidades para el PDF
    //    (Ajusta endpoints si tu API es distinta)
    const [landlord, tenant, property] = await Promise.all([
      apiFetch(`/api/landlords/${contractPayload.id_landlord}`),
      apiFetch(`/api/tenants/${contractPayload.id_tenant}`),
      apiFetch(`/api/properties/${contractPayload.id_property}`),
    ]);

    // 3) Generar PDF
    const pdfBlob = await buildContractPdfReact({ contract: contractPayload, landlord, tenant, property });


    // 4) Descargar localmente
    const filename = `Contrato_${saved?.folio || contractPayload.folio || id_contract}.pdf`;
    const blobUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);

    // 5) (Opcional) Subir el PDF al backend como archivo del contrato
    // const fdPdf = new FormData();
    // fdPdf.append("file", pdfBlob, filename);
    // await apiFetch(`/api/contracts/${id_contract}/upload`, { method: "POST", body: fdPdf });

    // 6) (Opcional) Subir archivos adicionales que vinieron del modal
    // if (payloadFromModal.files?.length) {
    //   const fdFiles = new FormData();
    //   payloadFromModal.files.forEach((f) => fdFiles.append("files", f));
    //   await apiFetch(`/api/contracts/${id_contract}/files`, { method: "POST", body: fdFiles });
    // }

    // 7) (Opcional) Generar pagarés aquí después de guardar (si quieres)
    // const notes = generatePromissoryNotes(
    //   contractPayload.dt_start,
    //   contractPayload.dt_end,
    //   contractPayload.payment_day,
    //   contractPayload.monthly_rent
    // ).map(n => ({ ...n, id_contract, currency: "MXN", status: "Pendiente" }));
    // if (notes.length) {
    //   await apiFetch(`/api/promissory-notes/bulk`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ id_contract, notes }),
    //   });
    // }

    setIsModalOpen(false);
    fetchContracts();
  } catch (error) {
    console.error("Error guardando contrato:", error);
    alert("Error al guardar contrato / generar PDF");
  }
};

  /**
   * Eliminar contrato (borrado lógico)
   */
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este contrato?")) {
      try {
        await apiFetch(`/api/contracts/${id}`, { method: "DELETE" });
        fetchContracts();
      } catch (error) {
        console.error("Error eliminando contrato:", error);
      }
    }
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
          placeholder="Buscar contrato, arrendador o arrendatario..."
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
              <th className="px-4 py-3">Folio</th>
              <th className="px-4 py-3">Propiedad</th>
              <th className="px-4 py-3">Arrendador</th>
              <th className="px-4 py-3">Arrendatario</th>
              <th className="px-4 py-3">Fecha inicio</th>
              <th className="px-4 py-3">Fecha de termino</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Cargando contratos...
                </td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No se encontraron contratos
                </td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr key={contract.id_contract} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{contract.folio}</td>
                  <td className="px-4 py-3">{contract.property_name}</td>
                  <td className="px-4 py-3">{contract.landlord_name}</td>
                  <td className="px-4 py-3">{contract.tenant_name}</td>
                  <td className="px-4 py-3">{contract.dt_start}</td>
                  <td className="px-4 py-3">{contract.dt_end}</td>
                  <td className="px-4 py-3">{contract.status}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(contract)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(contract.id_contract)}
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
          title="Nuevo contrato"
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          contract={selectedContract}
          show={open}
        />
      )}
    </div>
  );
}
