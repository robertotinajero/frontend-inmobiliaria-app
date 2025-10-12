// src/pages/units/SubUnits.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";
import UnitModal from "./UnitModal";

export default function SubUnits() {
    const { id } = useParams(); // id de la unidad padre
    const [parent, setParent] = useState(null);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const navigate = useNavigate();

    const fetchSubUnits = async () => {
        try {
            setLoading(true);
            const parentData = await apiFetch(`/api/units/${id}`);
            const children = await apiFetch(`/api/units/parent/${id}`);
            setParent(parentData || null);
            setUnits(children || []);
        } catch (error) {
            console.error("Error al cargar subunidades:", error);
            setParent(null);
            setUnits([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubUnits();
        console.log(parent)
    }, [id]);

    const handleDelete = async (idUnit) => {
        if (confirm("¿Seguro que deseas eliminar esta subunidad?")) {
            try {
                await apiFetch(`/api/units/${idUnit}`, { method: "DELETE" });
                fetchSubUnits();
            } catch (error) {
                console.error("Error al eliminar subunidad:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{parent?.nm_unit}</h1>
                    <p className="text-gray-500 text-sm">
                        {parent?.type} –  {`${parent?.street}, ${parent?.colony}, C.P. ${parent?.postal_code}, ${parent?.municipality}, ${parent?.state}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/units")}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        ← Volver
                    </button>
                    <button
                        onClick={() => {
                            setSelectedUnit(null);
                            setModalOpen(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        + Nueva subunidad
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Tamaño</th>
                            <th className="p-2">Estatus</th>
                            <th className="p-2 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    Cargando subunidades...
                                </td>
                            </tr>
                        ) : units.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No se encontraron subunidades
                                </td>
                            </tr>
                        ) : (
                            units.map((u) => (
                                <tr key={u.id_unit} className="border-b">
                                    <td className="p-2 font-medium">{u.nm_unit}</td>
                                    <td className="p-2">{u.type}</td>
                                    <td className="p-2">{u.size} m²</td>
                                    <td className="p-2">{u.status}</td>
                                    <td className="p-2 text-right">
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
                    parentId={id}
                    onClose={() => setModalOpen(false)}
                    onSaved={fetchSubUnits}
                />
            )}
        </div>
    );
}
