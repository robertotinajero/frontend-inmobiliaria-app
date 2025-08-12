// src/components/contracts/ContractModal.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    Modal,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    TablePagination,
    Snackbar,
    Alert
} from "@mui/material";

export default function ContractModal({ title, onClose, onSave, contract }) {
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

  useEffect(() => {
    // Cargar landlords, tenants y properties desde el backend
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
      setFolio(contract.folio);
      setDtStart(contract.dt_start);
      setDtEnd(contract.dt_end || "");
      setMonthlyRent(contract.monthly_rent);
      setSecurityDeposit(contract.security_deposit);
      setPaymentDay(contract.payment_day);
      setPenalty(contract.penalty || "");
      setStatus(contract.status);
      setIdLandlord(contract.id_landlord);
      setIdTenant(contract.id_tenant);
      setIdProperty(contract.id_property);
      setGuarantorName(contract.guarantor_name || "");
      setGuarantorContact(contract.guarantor_contact || "");
      setNotes(contract.notes || "");
    }
  }, [contract]);

  // Guardar
  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
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
    });
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

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-4 text-sm'>
                    <h3 className='text-black'>Nueva Tecnología</h3>
                    <TextField
                        label='Nombre de la Tecnología'
                        variant='outlined'
                        fullWidth
                        value={folio}
                        onChange={(e) => setFolio(e.target.value)}
                    />
                </div>
            {/* Folio */}
            <input
              type="text"
              placeholder="Folio"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />

            {/* Día de pago */}
            <input
              type="number"
              placeholder="Día de pago (1-31)"
              value={paymentDay}
              onChange={(e) => setPaymentDay(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />

            {/* Select Propiedad */}
            <select
              value={idProperty}
              onChange={(e) => setIdProperty(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Selecciona la propiedad</option>
              {properties.map((p) => (
                <option key={p.id_property} value={p.id_property}>
                  {p.nm_property} - {p.address}
                </option>
              ))}
            </select>

            {/* Select Landlord */}
            <select
              value={idLandlord}
              onChange={(e) => setIdLandlord(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Selecciona el arrendador</option>
              {landlords.map((l) => (
                <option key={l.id_landlord} value={l.id_landlord}>
                  {l.firstname} {l.lastname}
                </option>
              ))}
            </select>

            {/* Select Tenant */}
            <select
              value={idTenant}
              onChange={(e) => setIdTenant(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 col-span-2"
              required
            >
              <option value="">Selecciona el arrendatario</option>
              {tenants.map((t) => (
                <option key={t.id_tenant} value={t.id_tenant}>
                  {t.firstname} {t.lastname}
                </option>
              ))}
            </select>

            {/* Fechas */}
            <input
              type="date"
              value={dtStart}
              onChange={(e) => setDtStart(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="date"
              value={dtEnd}
              onChange={(e) => setDtEnd(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            {/* Renta mensual */}
            <input
              type="number"
              placeholder="Renta mensual"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />

            {/* Depósito */}
            <input
              type="number"
              placeholder="Depósito en garantía"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />

            {/* Penalización */}
            <input
              type="number"
              placeholder="Penalización"
              value={penalty}
              onChange={(e) => setPenalty(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            {/* Estado */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="Activo">Activo</option>
              <option value="Vencido">Vencido</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            {/* Aval */}
            <input
              type="text"
              placeholder="Nombre del aval"
              value={guarantorName}
              onChange={(e) => setGuarantorName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Contacto del aval"
              value={guarantorContact}
              onChange={(e) => setGuarantorContact(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            {/* Notas */}
            <textarea
              placeholder="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 col-span-2"
            />

            {/* Botones */}
            <div className="flex justify-end gap-2 col-span-2">
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
