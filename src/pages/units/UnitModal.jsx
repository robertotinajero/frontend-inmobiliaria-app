// src/components/unit/unitModal.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";

export default function UnitModal({ unit, parentId, onClose, onSaved }) {
    const [form, setForm] = useState({
        nm_unit: "",
        type: "",
        street: "",
        colony: "",
        postal_code: "",
        municipality: "",
        state: "",
        description: "",
        size: "",
        rooms: "",
        status: "Disponible",
    });

    useEffect(() => {
        if (unit) setForm(unit);
    }, [unit]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = unit ? "PATCH" : "POST";
            const url = unit ? `/api/units/${unit.id_unit}` : "/api/units";
            const payload = parentId ? { ...form, parent_id: parentId } : form;

            const cleaned = Object.fromEntries(
                Object.entries(payload).map(([k, v]) => [k, v === "" ? null : v])
            );

            await apiFetch(url, {
                method,
                body: JSON.stringify(cleaned),
            });

            onSaved();
            onClose();
        } catch (error) {
            console.error("Error guardando unidad:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                    {unit ? "Editar Propiedad" : "Nueva Propiedad"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" autoComplete="on">
                    <input
                        name="nm_unit"
                        value={form.nm_unit}
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
                        <option value="Departamento">Edificio</option>
                        <option value="Casa">Casa</option>
                        <option value="Departamento">Departamento</option>
                    </select>

                    <input
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="Calle"
                        className="border p-2 rounded"
                        autoComplete="address-line1"
                        required
                    />
                    <input
                        name="colony"
                        value={form.colony}
                        onChange={handleChange}
                        placeholder="Colonia"
                        className="border p-2 rounded"
                        autoComplete="address-line2"
                        required
                    />
                    <input
                        name="postal_code"
                        value={form.postal_code}
                        onChange={handleChange}
                        placeholder="Código postal"
                        className="border p-2 rounded"
                        autoComplete="postal-code"
                        required
                    />
                    <input
                        name="municipality"
                        value={form.municipality}
                        onChange={handleChange}
                        placeholder="Municipio"
                        className="border p-2 rounded"
                        autoComplete="address-level2"
                        required
                    />
                    <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Estado"
                        className="border p-2 rounded"
                        autoComplete="address-level1"
                        required
                    />
                    <label className="text-sm text-gray-700">
                        {parentId ? "Cuartos" : "Departamentos"}
                    </label>
                    <input
                        name="rooms"
                        value={form.rooms}
                        onChange={handleChange}
                        placeholder={parentId ? "Cuartos" : "Departamentos"}
                        className="border p-2 rounded"
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
