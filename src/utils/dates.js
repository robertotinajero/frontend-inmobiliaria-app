const MESES_MX = [
  "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
  "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
];

/**
 * Devuelve "DD DE MES DEL YYYY" en mayúsculas, ej: "31 DE JUNIO DEL 2025"
 * @param {string|Date|number} input - ISO, Date o timestamp
 * @param {string} tz - zona horaria
 */

export function fmtDate(iso, tz = "America/Mexico_City") {
  if (!iso) return "—";
  // si ya viene como 'YYYY-MM-DD' (solo fecha), evita shift por zona
  if (typeof iso === "string" && iso.length === 10 && iso.includes("-")) {
    const [y, m, d] = iso.split("-");
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("es-MX", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function fmtDateTime(iso, tz = "America/Mexico_City") {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  const f = d.toLocaleDateString("es-MX", {
    timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric",
  });
  const t = d.toLocaleTimeString("es-MX", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
  });
  return `${f} ${t}`;
}

export function DateLong(input = new Date(), tz = "America/Mexico_City") {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d)) return "";
  const day = new Intl.DateTimeFormat("es-MX", { day: "2-digit", timeZone: tz }).format(d);
  const monthIndex = Number(new Intl.DateTimeFormat("es-MX", { month: "numeric", timeZone: tz }).format(d)) - 1;
  const year = new Intl.DateTimeFormat("es-MX", { year: "numeric", timeZone: tz }).format(d);
  return `${day} DE ${MESES_MX[monthIndex]} DEL ${year}`;
}


