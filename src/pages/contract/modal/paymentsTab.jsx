import { useState } from "react";
import { FaPaperclip, FaCloudUploadAlt, FaSave, FaTimes, FaSpinner, FaCheck, FaEye, FaEdit } from "react-icons/fa";
import { fmtDate, fmtMoney } from "../../../utils/format";
import PaymentReceiptUpload from "./PaymentReceiptUpload";

export default function PaymentsTab({
    contract,
    payments = [],
    loadingPayments,
    savingPaymentId,
    uploadingReceiptId,
    onChangeField,     // (id_payment, field, value)
    onSaveRow,         // (row)
    onUploadReceipt,   // (id_payment, file)
}) {
    const statusOptions = ["Pendiente", "Parcial", "Pagado", "Vencido"];
    const [editingId, setEditingId] = useState(null);
    const [editSnapshot, setEditSnapshot] = useState(null);

    const startEdit = (row) => {
        setEditingId(row.id_payment);
        setEditSnapshot({
            id_payment: row.id_payment,
            amount_paid: row.amount_paid ?? "",
            status: row.status,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditSnapshot(null);
    };

    const saveEdit = async (row) => {
        await onSaveRow(row);
        setEditingId(null);
        setEditSnapshot(null);
    };

    if (!contract?.id_contract) {
        return <div className="text-sm text-gray-600">Guarda el contrato para generar pagos.</div>;
    }

    if (loadingPayments) return <div className="text-gray-500">Cargando pagos…</div>;

    if (!payments.length) return <div className="text-sm text-gray-600">No hay pagos registrados.</div>;

    return (
        <div className="rounded-xl border overflow-hidden">
            <div className="max-h-[60vh] overflow-auto">
                <table className="w-full min-w-[900px] text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-800 text-sm uppercase sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 w-10">#</th>
                            <th className="px-4 py-3 w-28">Vence</th>
                            <th className="px-4 py-3 w-25">Monto</th>
                            <th className="px-4 py-3 w-25">Pagado</th>
                            <th className="px-4 py-3 w-25">Estatus</th>
                            <th className="px-4 py-3 w-30">Comprobante</th>
                            <th className="px-4 py-3 w-10 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => {
                            const isEditing = editingId === p.id_payment;
                            const isSaving = savingPaymentId === p.id_payment;
                            const isUploading = uploadingReceiptId === p.id_payment || p.__uploadingReceipt;

                            return (
                                <tr key={p.id_payment ?? p.no_payment} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{p.no_payment}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{fmtDate(p.due_date)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{fmtMoney(p.amount_due)}</td>

                                    {/* Pagado (editable solo en modo edición) */}
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="border rounded px-2 py-1 w-28 disabled:bg-gray-100"
                                            value={p.amount_paid ?? ""}
                                            onChange={(e) => onChangeField(p.id_payment, "amount_paid", e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </td>

                                    {/* Estatus (editable solo en modo edición) */}
                                    <td className="px-4 py-3">
                                        <select
                                            className="border rounded px-2 py-1 w-36 disabled:bg-gray-100"
                                            value={p.status}
                                            onChange={(e) => onChangeField(p.id_payment, "status", e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Comprobante */}
                                    <td className="px-4 py-3">
                                        <PaymentReceiptUpload
                                            idPayment={p.id_payment}
                                            onUpload={onUploadReceipt}
                                            accept="image/*,application/pdf"
                                            maxSizeKB={10 * 1024} // 10 MB
                                            existingUrl={p.receipt_url}
                                            existingName={p.receipt_name}
                                            uploading={uploadingReceiptId === p.id_payment || p.__uploadingReceipt}
                                            disabled={savingPaymentId === p.id_payment}
                                        />
                                    </td>


                                    {/* Acciones */}
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => startEdit(p)}
                                                className="p-2 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                                                title="Editar"
                                            >
                                                <FaEdit className="text-gray-700" />
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="p-2 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                                                    title="Cancelar"
                                                    disabled={isSaving}
                                                >
                                                    <FaTimes className="text-gray-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => saveEdit(p)}
                                                    className="p-2 rounded hover:bg-gray-100 inline-flex items-center justify-center disabled:opacity-50"
                                                    title="Guardar"
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <FaSpinner className="animate-spin text-gray-500" />
                                                    ) : (
                                                        <FaSave className="text-gray-700" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
