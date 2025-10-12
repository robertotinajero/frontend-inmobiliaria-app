// src/pages/units/Units.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import apiFetch from "../../utils/apiFetch";
import UnitModal from "./UnitModal";

export default function Units() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const navigate = useNavigate();

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const data = await apiFetch("/api/units/");
            const roots = data.filter((u) => !u.parent_id); // solo unidades raíz
            setUnits(roots);
        } catch (error) {
            console.error("Error al cargar las unidades:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("¿Seguro que quieres eliminar esta unidad?")) {
            try {
                await apiFetch(`/api/units/${id}`, { method: "DELETE" });
                fetchUnits();
            } catch (error) {
                console.error("Error eliminando unidad:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Propiedades</h1>
                <button
                    onClick={() => {
                        setSelectedUnit(null);
                        setModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Nueva propiedad
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Departamentos</th>
                            <th className="p-2">Dirección</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    Cargando propiedades...
                                </td>
                            </tr>
                        ) : units.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No se encontraron propiedades
                                </td>
                            </tr>
                        ) : (
                            units.map((u) => (
                                <tr key={u.id_unit} className="border-b">
                                    <td className="p-2">
                                        {u.type}
                                    </td>
                                    <td className="p-2">{u.nm_unit}</td>
                                    <td className="p-2">{u.rooms}</td>
                                    <td className="p-2">
                                        {`${u.street}, ${u.colony}, C.P. ${u.postal_code}, ${u.municipality}, ${u.state}`}
                                    </td>
                                    <td className="p-2">{u.status}</td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={() => navigate(`/units/${u.id_unit}`)}
                                            className="text-green-600 mr-2"
                                        >
                                            Ver subunidades
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedUnit(u);
                                                setModalOpen(true);
                                            }}
                                            className="text-blue-600 mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline text-sm"
                                            onClick={() => handleDelete(u.id_unit)}
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

            {modalOpen && (
                <UnitModal
                    unit={selectedUnit}
                    onClose={() => setModalOpen(false)}
                    onSaved={fetchUnits}
                />
            )}
        </div>
    );
}
