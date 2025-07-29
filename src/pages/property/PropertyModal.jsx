// src/components/properties/PropertyModal.jsx
import { useState, useEffect } from "react";

export default function PropertyModal({ onClose, onSave, property }) {
  const [nmProperty, setNmProperty] = useState("");
  const [type, setType] = useState("Casa");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Disponible");

  useEffect(() => {
    if (property) {
      setNmProperty(property.nm_property);
      setType(property.type);
      setAddress(property.address);
      setDescription(property.description || "");
      setSize(property.size || "");
      setPhone(property.phone || "");
      setStatus(property.status);
    }
  }, [property]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      nm_property: nmProperty,
      type,
      address,
      description,
      size,
      phone,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {property ? "Editar propiedad" : "Nueva propiedad"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nmProperty}
            onChange={(e) => setNmProperty(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Bodega">Bodega</option>
          </select>
          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Tamaño (m²)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
