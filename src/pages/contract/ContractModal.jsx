// src/components/contracts/ContractModal.jsx
import { useState, useEffect } from "react";

export default function ContractModal({ onClose, onSave, contract }) {
  const [number, setNumber] = useState("");
  const [client, setClient] = useState("");
  const [property, setProperty] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Activo");

  useEffect(() => {
    if (contract) {
      setNumber(contract.number);
      setClient(contract.client);
      setProperty(contract.property);
      setStartDate(contract.startDate);
      setStatus(contract.status);
    }
  }, [contract]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ number, client, property, startDate, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {contract ? "Editar contrato" : "Nuevo contrato"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="N° Contrato"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Cliente"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Propiedad"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Activo">Activo</option>
            <option value="Vencido">Vencido</option>
          </select>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
