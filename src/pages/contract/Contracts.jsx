// src/pages/Contracts.jsx
import { useEffect, useState } from "react";
import ContractModal from "./modal/ContractModal";
import apiFetch from "../../utils/apiFetch";
import { fmtDate } from "../../utils/dates";
import { fmtNumber, fmtMoney } from "../../utils/format";
import { FaFilePdf, FaPen, FaTrash } from "react-icons/fa";

import { buildContractPdf } from "../../utils/contractPdf";
import { buildContractPdfReact } from "./buildContractPdfReact";
import { buildMonthlyPayments } from "../../utils/payments";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadingId, setDownloadingId] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const [balances, setBalances] = useState({});          // { [id_contract]: number }
  const [loadingBalances, setLoadingBalances] = useState(false);

  /**
   * Cargar contratos desde el backend
   */

  const fetchBalances = async (list) => {
    try {
      setLoadingBalances(true);
      const entries = await Promise.all(
        list.map(async (c) => {
          try {
            const res = await apiFetch(`/api/payments/contract/${c.id_contract}`);
            const arr = Array.isArray(res) ? res : (res.items || []);
            const outstanding = computeOutstanding(arr);
            return [c.id_contract, outstanding];
          } catch {
            return [c.id_contract, 0];
          }
        })
      );
      setBalances(Object.fromEntries(entries));
    } finally {
      setLoadingBalances(false);
    }
  };


  const fetchContracts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) {
        params.set("search", search); // o 'q' según tu API
      }
      params.set("page", String(page));
      // GET con búsqueda y paginación (backend ya lo soporta)
      //const data = await apiFetch('/api/contracts/');
      const data = await apiFetch(`/api/contracts?${params.toString()}`);
      const list = data.items ? data.items : data;
      // Si el backend devuelve paginación
      if (list) {
        setContracts(list);
        setTotalPages(data.totalPages);
        if (Array.isArray(list) && list.length) {
          fetchBalances(list);
        } else {
          setBalances({});
        }
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
      const url = isEdit ? `/api/contracts/${selectedContract.id_contract}` : `/api/contracts/`;
      const method = isEdit ? "PUT" : "POST";

      // 1) Guarda contrato (con headers JSON)
      const saved = await apiFetch(url, {
        method,
        body: JSON.stringify(contractPayload),
      });



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

  async function uploadReceipt(id_payment, file) {
    const fd = new FormData();
    fd.append("file", file, file.name);
    await apiFetch(`/api/payments/${id_payment}/receipts`, {
      method: "POST",
      body: fd,
    });
  }

  /**
   * Descargar contrato
   */

  const handleContractPdf = async (row) => {
    try {
      setDownloadingId(row.id_contract);

      // Asegura que tienes los IDs necesarios; si la fila no los trae, pide el detalle.
      const base = row.id_landlord ? row : await apiFetch(`/api/contracts/${row.id_contract}`);

      const [landlord, tenant, property] = await Promise.all([
        apiFetch(`/api/landlords/${base.id_landlord}`),
        apiFetch(`/api/tenants/${base.id_tenant}`),
        apiFetch(`/api/properties/${base.id_property}`),
      ]);

      const pdfBlob = await buildContractPdfReact({
        contract: {
          folio: base.folio,
          dt_start: base.dt_start,
          dt_end: base.dt_end,
          monthly_rent: base.monthly_rent,
          security_deposit: base.security_deposit,
          payment_day: base.payment_day,
          penalty: base.penalty,
          status: base.status,
          id_landlord: base.id_landlord,
          id_tenant: base.id_tenant,
          id_property: base.id_property,
          notes: base.notes,
        },
        landlord, tenant, property,
      });

      //const filename = `Contrato_${base.folio || base.id_contract}.pdf`;
      const filename = `Contrato de arrendamiento ${base.folio}.pdf`;
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("No se pudo generar el PDF del contrato", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const computeOutstanding = (paymentsArr) =>
    paymentsArr.reduce((sum, p) => {
      const due = Number(p.amount_due ?? 0);
      const paid = Number(p.amount_paid ?? 0);
      return sum + Math.max(due - paid, 0);
    }, 0);

  const handlePaymentSaved = async (id_contract) => {
  try {
    const res = await apiFetch(`/api/payments/contract/${id_contract}`);
    const arr = Array.isArray(res) ? res : (res.items || []);
    const outstanding = computeOutstanding(arr);
    setBalances((prev) => ({ ...prev, [id_contract]: outstanding }));
  } catch (e) {
    console.error("Error refrescando saldo:", e);
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
              <th className="px-4 py-3">Saldo</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  Cargando contratos...
                </td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
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
                  <td className="px-4 py-3">{fmtDate(contract.dt_start)}</td>
                  <td className="px-4 py-3">{fmtDate(contract.dt_end)}</td>
                  <td className="px-4 py-3">{contract.status}</td>
                  <td className="px-4 py-3">
                    {loadingBalances ? "…" : fmtMoney(balances[contract.id_contract] ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {/* Contrato (PDF) */}
                    <button
                      onClick={() => handleContractPdf(contract)}
                      className="inline-flex items-center text-gray-600 hover:text-gray-900"
                      title="Descargar contrato (PDF)"
                      aria-label="Descargar contrato (PDF)"
                      disabled={downloadingId === contract.id_contract}
                    >
                      <FaFilePdf className={downloadingId === contract.id_contract ? "animate-pulse" : ""} size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(contract)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 ml-2"
                      title="Editar"
                      aria-label="Editar"
                    >
                      <FaPen size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(contract.id_contract)}
                      className="inline-flex items-center text-red-600 hover:text-red-800 ml-2"
                      title="Eliminar"
                      aria-label="Eliminar"
                    >
                      <FaTrash size={16} />
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
          title={selectedContract ? "Editar contrato" : "Nuevo contrato"}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onPaymentSaved={handlePaymentSaved}
          contract={selectedContract}
          show={open}
        />
      )}
    </div>
  );
}
