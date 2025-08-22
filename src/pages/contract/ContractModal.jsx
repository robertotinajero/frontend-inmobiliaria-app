// src/components/contracts/ContractModal.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import apiFetch from "../../utils/apiFetch";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, Tab, TextField, MenuItem } from "@mui/material";
import { buildContractPdf } from "../../utils/contractPdf";

export default function ContractModal({ title, onClose, onSave, contract }) {
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

  useEffect(() => {
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
    fetchData();
  }, []);

  // Si estamos editando un contrato, cargar sus datos
  useEffect(() => {
    if (contract) {
      setFolio(contract.folio || "");
      setDtStart(contract.dt_start || "");
      setDtEnd(contract.dt_end || "");
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
    }
  }, [contract]);

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
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative"
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
          <div className="mb-3">
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              aria-label="tabs contract"
              variant="fullWidth"
            >
              <Tab label="Datos" />
              <Tab label="Archivos" />
            </Tabs>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Panel DATOS */}
            {tab === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {/* Folio */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Folio"
                    variant="outlined"
                    placeholder="Folio"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    required
                    fullWidth
                  />
                </div>

                {/* Día de pago */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Día de pago (1-31)"
                    variant="outlined"
                    type="number"
                    placeholder="Día de pago (1-31)"
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                    required
                    fullWidth
                  />
                </div>

                {/* Propiedad */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    select
                    label="Propiedad"
                    variant="outlined"
                    value={idProperty}
                    onChange={(e) => setIdProperty(e.target.value)}
                    required
                    fullWidth
                  >
                    {properties.map((p) => (
                      <MenuItem key={p.id_property} value={p.id_property}>
                        {p.nm_property} - {p.address}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                {/* Landlord */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    select
                    label="Arrendador"
                    variant="outlined"
                    value={idLandlord}
                    onChange={(e) => setIdLandlord(e.target.value)}
                    required
                    fullWidth
                  >
                    {landlords.map((l) => (
                      <MenuItem key={l.id_landlord} value={l.id_landlord}>
                        {l.firstname} {l.lastname}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                {/* Tenant */}
                <div className="flex flex-col gap-4 text-sm col-span-2">
                  <TextField
                    select
                    label="Arrendatario"
                    variant="outlined"
                    value={idTenant}
                    onChange={(e) => setIdTenant(e.target.value)}
                    required
                    fullWidth
                  >
                    {tenants.map((t) => (
                      <MenuItem key={t.id_tenant} value={t.id_tenant}>
                        {t.firstname} {t.lastname}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                {/* Fechas */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Fecha inicio"
                    variant="outlined"
                    type="date"
                    value={dtStart}
                    onChange={(e) => setDtStart(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Fecha fin"
                    variant="outlined"
                    type="date"
                    value={dtEnd}
                    onChange={(e) => setDtEnd(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Renta mensual */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Renta mensual"
                    variant="outlined"
                    type="number"
                    placeholder="Renta mensual"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    required
                    fullWidth
                  />
                </div>

                {/* Depósito */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Depósito en garantía"
                    variant="outlined"
                    type="number"
                    placeholder="Depósito en garantía"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    required
                    fullWidth
                  />
                </div>

                {/* Penalización */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Penalización"
                    variant="outlined"
                    type="number"
                    placeholder="Penalización"
                    value={penalty}
                    onChange={(e) => setPenalty(e.target.value)}
                    fullWidth
                  />
                </div>

                {/* Estado */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    select
                    label="Estado"
                    variant="outlined"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Vencido">Vencido</MenuItem>
                    <MenuItem value="Finalizado">Finalizado</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                  </TextField>
                </div>

                {/* Aval */}
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Nombre del aval"
                    variant="outlined"
                    placeholder="Nombre del aval"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="flex flex-col gap-4 text-sm col-span-1">
                  <TextField
                    label="Contacto del aval"
                    variant="outlined"
                    placeholder="Contacto del aval"
                    value={guarantorContact}
                    onChange={(e) => setGuarantorContact(e.target.value)}
                    fullWidth
                  />
                </div>

                {/* Notas */}
                <div className="flex flex-col gap-4 text-sm col-span-2">
                  <TextField
                    label="Notas"
                    variant="outlined"
                    placeholder="Notas"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            )}

            {/* Panel ARCHIVOS */}
            {tab === 1 && (
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
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
