// src/components/contracts/ContractModal.jsx
import { useState, useEffect, useMemo, useRef, lazy, Suspense, useCallback } from "react";
import apiFetch from "../../../utils/apiFetch";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, Tab, TextField, MenuItem } from "@mui/material";
import { buildContractPdf } from "../../../utils/contractPdf";
import { toDateInput } from "../../../utils/dates";
import { fmtDate } from "../../../utils/dates";
import { fmtNumber, fmtMoney } from "../../../utils/format";

const InfoTab = lazy(() => import("./infoTab"));
const PaymentsTab = lazy(() => import("./paymentsTab"));
const FilesTab = lazy(() => import("./filesTabs"));

export default function ContractModal({ title, onClose, onSave, onPaymentSaved, contract }) {
  // Tabs
  const [tab, setTab] = useState(0);

  // Campos de contrato
  const [folio, setFolio] = useState("");
  const [dtStart, setDtStart] = useState("");
  const [dtEnd, setDtEnd] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [paymentDay, setPaymentDay] = useState("");
  const [penalty, setPenalty] = useState("");
  const [status, setStatus] = useState("Activo");

  // Relaciones (FK)
  const [idLandlord, setIdLandlord] = useState("");
  const [idTenant, setIdTenant] = useState("");
  const [idProperty, setIdProperty] = useState("");

  // Extras
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorContact, setGuarantorContact] = useState("");
  const [notes, setNotes] = useState("");

  // Datos para los selects dinámicos
  const [landlords, setLandlords] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);

  // Archivos
  const [files, setFiles] = useState([]); // File[]
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const accept = "image/*,application/pdf"; // ajusta si quieres
  const maxSizeMB = 25;

  const receiptAccept = "image/*,application/pdf";
  const maxReceiptMB = 10; // MB

  // Archivos
  const [payments, setPayments] = useState([]);

  // estados para pagos
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [savingPaymentId, setSavingPaymentId] = useState(null);
  const [uploadingReceiptId, setUploadingReceiptId] = useState(null);

  // Helpers
  const isPreviewable = (file) =>
    file.type.startsWith("image/") || file.type === "application/pdf";

  const previews = useMemo(
    () => files.map((f) => (isPreviewable(f) ? URL.createObjectURL(f) : null)),
    [files]
  );

  const handleAddFiles = (fileList) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    const arr = Array.from(fileList);
    const valid = [];
    const rejected = [];

    // Validación sencilla por tamaño y tipo
    arr.forEach((f) => {
      const okSize = f.size <= maxBytes;
      const okType =
        accept === "*"
          ? true
          : accept.split(",").some((t) => {
            const tt = t.trim();
            if (tt.endsWith("/*"))
              return f.type.startsWith(tt.replace("/*", "/"));
            return f.type === tt;
          });
      (okSize && okType ? valid : rejected).push(f);
    });

    if (rejected.length) {
      const names = rejected.map((f) => f.name).join(", ");
      alert(`Se omitieron archivos por tipo/tamaño: ${names}`);
    }

    // Evitar duplicados por nombre+tamaño
    const key = (f) => `${f.name}_${f.size}`;
    const current = new Map(files.map((f) => [key(f), true]));
    const deduped = valid.filter((f) => !current.has(key(f)));

    setFiles((prev) => [...prev, ...deduped]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const fetchData = async () => {
    try {
      const [landlordsData, tenantsData, propertiesData] = await Promise.all([
        apiFetch("/api/landlords/"),
        apiFetch("/api/tenants/"),
        apiFetch("/api/properties/"),
      ]);
      setLandlords(landlordsData);
      setTenants(tenantsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error cargando datos para selects:", error);
    }
  };

  const fetchPayments = async (idContract) => {
    try {
      console.log("Fetching payments for contract ID:", idContract);
      const paymentsData = await apiFetch(`/api/payments/contract/${idContract}`);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error cargando pagos:", error);
    }
  };


  useEffect(() => {

    fetchData();
  }, []);

  // Si estamos editando un contrato, cargar sus datos
  useEffect(() => {
    if (contract) {
      setFolio(contract.folio || "");
      setDtStart(toDateInput(contract.dt_start) || "");
      setDtEnd(toDateInput(contract.dt_end) || "");
      setMonthlyRent(contract.monthly_rent || "");
      setSecurityDeposit(contract.security_deposit || "");
      setPaymentDay(contract.payment_day || "");
      setPenalty(contract.penalty || "");
      setStatus(contract.status || "Activo");
      setIdLandlord(contract.id_landlord || "");
      setIdTenant(contract.id_tenant || "");
      setIdProperty(contract.id_property || "");
      setGuarantorName(contract.guarantor_name || "");
      setGuarantorContact(contract.guarantor_contact || "");
      setNotes(contract.notes || "");
      fetchPayments(contract.id_contract);
    }
  }, [contract]);

  useEffect(() => {
    console.log('payments state updated:', payments);
  }, [payments]);

  // Guardar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Entrego todo al caller. Ahí decides si posteas JSON, luego subes files con FormData, etc.
      onSave?.({
        folio,
        dt_start: dtStart,
        dt_end: dtEnd,
        monthly_rent: monthlyRent,
        security_deposit: securityDeposit,
        payment_day: paymentDay,
        penalty,
        status,
        id_landlord: idLandlord,
        id_tenant: idTenant,
        id_property: idProperty,
        guarantor_name: guarantorName,
        guarantor_contact: guarantorContact,
        notes,
        files, // <-- aquí van los File objects
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setUploading(false);
    }
  };

  const savePayment = useCallback(async (row) => {
    try {
      setSavingPaymentId(row.id_payment);
      const payload = {
        amount_paid: row.amount_paid === "" || row.amount_paid === null ? 0 : Number(row.amount_paid),
        status: row.status
      };
      await apiFetch(`/api/payments/${row.id_payment}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // refresca lista
      if (contract?.id_contract) {
        const refreshed = await apiFetch(`/api/payments/contract/${contract.id_contract}`);
        setPayments(Array.isArray(refreshed) ? refreshed : (refreshed.items || []));
        // 🔔 Notifica al padre para recalcular el saldo en la tabla
        onPaymentSaved?.(contract.id_contract);
      }
    } catch (e) {
      console.error("Error guardando pago:", e);
      alert("No se pudo guardar el pago");
    } finally {
      setSavingPaymentId(null);
    }
  }, [contract?.id_contract, onPaymentSaved]);

  // subir comprobante (guarda archivo en el servidor)
  const handleUploadReceipt = useCallback(async (id_payment, file) => {
    try {
      if (!id_payment || !file) return;

      setUploadingReceiptId(id_payment);

      // ✅ Optimista: pinta el nombre en la tabla aunque todavía no haya URL
      setPayments(prev =>
        prev.map(p =>
          p.id_payment === id_payment
            ? { ...p, receipt_name: file.name, __uploadingReceipt: true }
            : p
        )
      );

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        alert(`El archivo supera el máximo de ${maxSizeMB} MB`);
        return;
      }

      const fd = new FormData();
      fd.append("file", file, file.name);

      // POST: espera que tu API regrese { url, filename } (ajusta si es distinto)
      // const res = await apiFetch(`/api/payments/${id_payment}/receipts`, {
      //   method: "POST",
      //   body: fd,
      // });

      // Trata de obtener la URL/filename devuelta por el backend
      const url =
        res?.url || res?.file_url || res?.path || res?.receipt_url || null;
      const filename =
        res?.filename || res?.originalname || res?.name || file.name;

      // ✅ Actualiza fila con meta real
      setPayments(prev =>
        prev.map(p =>
          p.id_payment === id_payment
            ? {
              ...p,
              receipt_url: url ?? p.receipt_url ?? null,
              receipt_name: filename,
              __uploadingReceipt: false,
            }
            : p
        )
      );

      // (Opcional) refetch para asegurar consistencia
      if (contract?.id_contract) {
        const refreshed = await apiFetch(`/api/payments/contract/${contract.id_contract}`);
        const list = Array.isArray(refreshed) ? refreshed : (refreshed.items || []);
        // Conserva el filename si el backend aún no lo expone
        setPayments(prevLocal =>
          list.map(it => {
            const local = prevLocal.find(x => x.id_payment === it.id_payment);
            return local?.receipt_name && !it.receipt_name
              ? { ...it, receipt_name: local.receipt_name }
              : it;
          })
        );
      }
    } catch (e) {
      console.error("Error subiendo comprobante:", e);
      alert("No se pudo subir el comprobante");
    } finally {
      setUploadingReceiptId(null);
    }
  }, [contract?.id_contract, maxSizeMB]);


  const handlePaymentField = (idPayment, field, value) => {
    setPayments((prev) =>
      prev.map((p) => (p.id_payment === idPayment ? { ...p, [field]: value } : p))
    );
  };

  // Props para <PaymentsTab />
  const paymentsTabProps = useMemo(() => ({
    contract,
    payments,
    loadingPayments,
    savingPaymentId,
    onChangeField: handlePaymentField,
    onSaveRow: savePayment,
    onUploadReceipt: handleUploadReceipt,
  }), [
    contract?.id_contract,
    payments,
    loadingPayments,
    savingPaymentId,
    handlePaymentField,
    savePayment,
    handleUploadReceipt,
  ]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Card del modal */}
        <motion.div
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] p-6 relative flex flex-col"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>

          {/* Título */}
          {title && (
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {title}
            </h2>
          )}

          {/* Tabs */}
          <div className="mb-3 shrink-0">
            <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="tabs contract" variant="fullWidth">
              <Tab label="Datos" />
              <Tab label="Pagos" />
              <Tab label="Archivos" />
            </Tabs>
          </div>
          <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(90vh - 120px)" }}>
            <form onSubmit={handleSubmit}>
              {/* Panel DATOS */}

              <Suspense fallback={<div className="text-gray-500">Cargando…</div>}>
                {tab === 0 && (
                  <InfoTab
                    {...{
                      folio, setFolio,
                      dtStart, setDtStart,
                      dtEnd, setDtEnd,
                      monthlyRent, setMonthlyRent,
                      securityDeposit, setSecurityDeposit,
                      paymentDay, setPaymentDay,
                      penalty, setPenalty,
                      status, setStatus,
                      idLandlord, setIdLandlord,
                      idTenant, setIdTenant,
                      idProperty, setIdProperty,
                      guarantorName, setGuarantorName,
                      guarantorContact, setGuarantorContact,
                      notes, setNotes,
                      landlords, tenants, properties
                    }}
                  />
                )}
                {/* Panel de Pagos */}
                {tab === 1 && (
                  <PaymentsTab {...paymentsTabProps} />

                )}

                {/* Panel ARCHIVOS */}
                {tab === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                        <input
                          ref={inputRef}
                          type="file"
                          multiple
                          accept={accept}
                          onChange={(e) => handleAddFiles(e.target.files)}
                          hidden
                          disabled={uploading}
                        />
                        Seleccionar archivos
                      </label>
                      <span className="text-sm text-gray-600">Tipos: {accept}</span>
                      <span className="text-sm text-gray-600">
                        Máx: {maxSizeMB} MB
                      </span>
                    </div>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-gray-300 rounded p-6 text-center text-gray-600"
                    >
                      Arrastra y suelta aquí, o usa “Seleccionar archivos”
                    </div>

                    {/* Lista */}
                    <div className="max-h-64 overflow-auto divide-y border rounded">
                      {files.length === 0 && (
                        <div className="p-3 text-sm text-gray-500">
                          No hay archivos añadidos.
                        </div>
                      )}
                      {files.map((f, i) => (
                        <div
                          key={`${f.name}_${f.size}_${i}`}
                          className="p-3 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {f.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(f.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                              {f.type || "sin tipo"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isPreviewable(f) && previews[i] && (
                              <a
                                href={previews[i]}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                              >
                                Vista previa
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemove(i)}
                              className="px-2 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {uploading && (
                      <div className="text-sm text-gray-600">Subiendo…</div>
                    )}
                  </div>
                )}
              </Suspense>
              <div className="flex justify-end gap-2 mt-6 pb-2">
                {/* Botones */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={uploading}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
