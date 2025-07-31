// src/components/property/PropertyModal.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";

export default function PropertyModal({ property, onClose, onSaved }) {
  const [form, setForm] = useState({
    nm_property: "",
    type: "",
    street: "",
    colony: "",
    postal_code: "",
    municipality: "",
    state: "",
    depto: "",
    description: "",
    size: "",
    rooms: "",
    status: "Disponible",
  });

  useEffect(() => {
    if (property) setForm(property);
  }, [property]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (property) {
      await apiFetch(`/api/properties/${property.id_property}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await apiFetch("/api/properties/", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          {property ? "Editar Propiedad" : "Nueva Propiedad"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="nm_property"
            value={form.nm_property}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 rounded"
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Tipo</option>
            <option value="Departamento">Departamento</option>
            <option value="Bodega">Bodega</option>
            <option value="Casa">Casa</option>
          </select>

          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="Calle"
            className="border p-2 rounded"
            required
          />
          <input
            name="colony"
            value={form.colony}
            onChange={handleChange}
            placeholder="Colonia"
            className="border p-2 rounded"
            required
          />
          <input
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            placeholder="Código postal"
            className="border p-2 rounded"
            required
          />
          <input
            name="municipality"
            value={form.municipality}
            onChange={handleChange}
            placeholder="Municipio"
            className="border p-2 rounded"
            required
          />
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Estado"
            className="border p-2 rounded"
            required
          />
          <input
            name="depto"
            value={form.depto}
            onChange={handleChange}
            placeholder="Departamento"
            className="border p-2 rounded"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="border p-2 rounded col-span-2"
          />
          <input
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Tamaño (m2)"
            type="number"
            className="border p-2 rounded"
          />
          <input
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            placeholder="Cuartos"
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-2">
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
