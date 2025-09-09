// src/components/contracts/tabs/ContractDataTab.jsx
import { TextField, MenuItem } from "@mui/material";

export default function InfoTab(props) {
  const {
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
    landlords = [], tenants = [], properties = []
  } = props;

  return (
    <div className="grid grid-cols-2 gap-4 mt-1">
      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Folio" variant="outlined" value={folio} onChange={(e)=>setFolio(e.target.value)} required fullWidth/>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Día de pago (1-31)" variant="outlined" type="number" value={paymentDay} onChange={(e)=>setPaymentDay(e.target.value)} required fullWidth/>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField select label="Propiedad" variant="outlined" value={properties.length ? idProperty : ""} onChange={(e)=>setIdProperty(e.target.value)} required fullWidth>
          <MenuItem value="">Selecciona la propiedad</MenuItem>
          {properties.map((p)=>(
            <MenuItem key={p.id_property} value={String(p.id_property)}>{p.nm_property} - {p.address}</MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField select label="Arrendador" variant="outlined" value={landlords.length ? idLandlord : ""} onChange={(e)=>setIdLandlord(e.target.value)} required fullWidth>
          <MenuItem value="">Selecciona el arrendador</MenuItem>
          {landlords.map((l)=>(
            <MenuItem key={l.id_landlord} value={String(l.id_landlord)}>{l.firstname} {l.lastname}</MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-2">
        <TextField select label="Arrendatario" variant="outlined" value={tenants.length ? idTenant : ""} onChange={(e)=>setIdTenant(e.target.value)} required fullWidth>
          <MenuItem value="">Selecciona el arrendatario</MenuItem>
          {tenants.map((t)=>(
            <MenuItem key={t.id_tenant} value={String(t.id_tenant)}>{t.firstname} {t.lastname}</MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Fecha inicio" type="date" value={dtStart} onChange={(e)=>setDtStart(e.target.value)} required fullWidth InputLabelProps={{shrink:true}}/>
      </div>
      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Fecha fin" type="date" value={dtEnd} onChange={(e)=>setDtEnd(e.target.value)} fullWidth InputLabelProps={{shrink:true}}/>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Renta mensual" type="number" value={monthlyRent} onChange={(e)=>setMonthlyRent(e.target.value)} required fullWidth/>
      </div>
      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Depósito en garantía" type="number" value={securityDeposit} onChange={(e)=>setSecurityDeposit(e.target.value)} required fullWidth/>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Penalización" type="number" value={penalty} onChange={(e)=>setPenalty(e.target.value)} fullWidth/>
      </div>
      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField select label="Estado" value={status} onChange={(e)=>setStatus(e.target.value)} fullWidth>
          <MenuItem value="Activo">Activo</MenuItem>
          <MenuItem value="Vencido">Vencido</MenuItem>
          <MenuItem value="Finalizado">Finalizado</MenuItem>
          <MenuItem value="Cancelado">Cancelado</MenuItem>
        </TextField>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Nombre del aval" value={guarantorName} onChange={(e)=>setGuarantorName(e.target.value)} fullWidth/>
      </div>
      <div className="flex flex-col gap-4 text-sm col-span-1">
        <TextField label="Contacto del aval" value={guarantorContact} onChange={(e)=>setGuarantorContact(e.target.value)} fullWidth/>
      </div>

      <div className="flex flex-col gap-4 text-sm col-span-2">
        <TextField label="Notas" placeholder="Notas" multiline rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} fullWidth/>
      </div>
    </div>
  );
}
