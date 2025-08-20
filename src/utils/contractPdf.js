// src/utils/contractPdf.js
import jsPDF from "jspdf";

/**
 * Genera el PDF de contrato.
 * @param {Object} payload - Datos del contrato y relaciones
 * @param {Object} payload.contract   - { folio, dt_start, dt_end, monthly_rent, security_deposit, payment_day, penalty, status, notes }
 * @param {Object} payload.landlord   - { firstname, lastname, rfc?, address? }
 * @param {Object} payload.tenant     - { firstname, lastname, rfc?, address? }
 * @param {Object} payload.property   - { nm_property, address, city?, state?, zip? }
 * @param {Object} [options]
 * @param {string} [options.logoDataUrl] - (opcional) dataURL de imagen PNG/JPEG para encabezado
 * @returns {Blob} - Blob del PDF
 */
export function buildContractPdf({ contract, landlord, tenant, property }, options = {}) {
  const doc = new jsPDF({ unit: "pt", format: "letter" }); // 612 x 792 pt
  const margin = 48;
  let y = margin;

// Reemplaza tu addLine por esta versión:
function addLine(text = "", opts = {}) {
  const {
    fontSize = 11,
    bold = false,
    gap = 14,
    align = "left",
  } = opts;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxWidth = pageW - margin * 2;

  // Si es un array, puede ser: [ "línea1", "línea2", ... ]
  // o una línea con segmentos: [ {text, bold}, {text, bold}, ... ]
  if (Array.isArray(text)) {
    for (const item of text) {
      if (Array.isArray(item)) {
        // Línea con segmentos estilados
        drawStyledSegments(item, { fontSize, gap });
      } else {
        // Línea normal (string)
        addLine(String(item), { fontSize, bold: false, gap, align });
      }
    }
    return;
  }

  // Texto normal (string): ajuste de ancho automático
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(fontSize);

  const lines = doc.splitTextToSize(String(text), maxWidth);

  for (const ln of lines) {
    // salto de página si es necesario
    if (y > pageH - margin - 20) {
      doc.addPage();
      y = margin;
    }
    doc.text(ln, margin, y, { align });
    y += gap;
  }
}

// Dibuja una sola línea compuesta por segmentos con estilos (bold/normal)
// No hace wrapping entre palabras; si te pasas del ancho, salta a la siguiente línea.
function drawStyledSegments(segments, { fontSize = 10, gap = 14 } = {}) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxX = pageW - margin;

  let x = margin;

  doc.setFontSize(fontSize);

  const ensureLineSpace = () => {
    if (y > pageH - margin - 20) {
      doc.addPage();
      y = margin;
    }
  };

  ensureLineSpace();

  for (const seg of segments) {
    const content = String(seg?.text ?? "");
    const isBold = !!seg?.bold;

    doc.setFont("helvetica", isBold ? "bold" : "normal");

    // medimos el ancho del segmento
    const w = doc.getTextWidth(content);

    // si no cabe en la línea, bajamos otra
    if (x + w > maxX) {
      y += gap;
      ensureLineSpace();
      x = margin;
    }

    doc.text(content, x, y);
    x += w; // avanzamos el cursor horizontal
  }

  // al terminar la línea, bajamos
  y += gap;
}


  // Encabezado con logo y folio
  if (options.logoDataUrl) {
    try {
      doc.addImage(options.logoDataUrl, "PNG", margin, y - 10, 120, 40);
    } catch { /* ignore logo errors */ }
  }
  // --- Aquí agregas tu texto legal ---
    // helpers (arriba del bloque)
const UC = (s) => (s || "").toLocaleUpperCase("es-MX");
const tenantName = UC(fullName(tenant));                 // MARÍA DEL CARMEN AGUILLÓN CABELLO
const streetNum   = UC(property?.street && property?.ext_number
  ? `${property.street} ${property.ext_number}`
  : (property?.address || ""));                          // PUNTA DEL ESTE 203
const city        = UC(property?.city || "Corregidora");
const stateAbbr   = UC(property?.state_abbr || "Qro.");  // QRO.

// ---- Texto exactamente como en tu ejemplo ----
addLine([
  // Línea 1 (texto largo)
  'CONTRATO DE ARRENDAMIENTO QUE CELEBRAN POR UNA PARTE INMOBILIARIA Y ',
  'CONSTRUCTORA LA PEÑA SA DE CV REPRESENTADA LEGALMENTE POR LA C. GABRIELA ',
  'CARRILLO HERNANDEZ A QUIEN EN LO SUCESIVO SE LE DENOMINARA "EL ',
  'ARRENDADOR", Y POR LA OTRA PARTE LA C. '

  // Línea 2 (todo seguido, sin salto después del nombre)
  [
    { text: " Y POR LA OTRA PARTE LA C. " },
    { text: tenantName, bold: true },
    { text: ' A QUIEN SE LE DENOMINARÁ EN LO SUCESIVO "EL ARRENDATARIO", CON RELACIÓN AL INMUEBLE UBICADO EN ' },
    { text: streetNum, bold: true },
    { text: `, ${city}, ${stateAbbr},` },
  ],

  // Línea 3 (si quieres continuar en la siguiente línea)
  ' EN LO SUCESIVO "EL INMUEBLE", AL TENOR DE LAS SIGUIENTES:'
]);


  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CONTRATO DE ARRENDAMIENTO", margin, y);
  y += 22;

  addLine(`Folio: ${contract.folio || "N/A"}`, { fontSize: 11 });
  addLine(`Fecha de elaboración: ${formatDate(new Date())}`, { fontSize: 11 });
  y += 6;
  drawDivider(doc, margin, y); y += 16;

  // Partes
  addLine("I. PARTES CONTRATANTES", { bold: true, fontSize: 13, gap: 18 });
  addLine(`ARRENDADOR: ${fullName(landlord)} ${landlord?.rfc ? `(RFC: ${landlord.rfc})` : ""}`);
  addLine(`${landlord?.address ? `Domicilio: ${landlord.address}` : ""}`);
  addLine(`ARRENDATARIO: ${fullName(tenant)} ${tenant?.rfc ? `(RFC: ${tenant.rfc})` : ""}`);
  addLine(`${tenant?.address ? `Domicilio: ${tenant.address}` : ""}`);
  y += 6;
  drawDivider(doc, margin, y); y += 16;

  // Inmueble
  addLine("II. INMUEBLE ARRENDADO", { bold: true, fontSize: 13, gap: 18 });
  addLine(`Propiedad: ${property?.nm_property || ""}`);
  addLine(`Ubicación: ${property?.address || ""}${joinComma(property?.city)}${joinComma(property?.state)}${property?.zip ? `, C.P. ${property.zip}` : ""}`);
  y += 6;
  drawDivider(doc, margin, y); y += 16;

  // Vigencia y Pago
  const start = contract.dt_start ? parseISO(contract.dt_start) : null;
  const end   = contract.dt_end ? parseISO(contract.dt_end) : null;

  addLine("III. VIGENCIA Y PAGOS", { bold: true, fontSize: 13, gap: 18 });
  addLine(`Inicio: ${formatDate(start)}${end ? `   •   Fin: ${formatDate(end)}` : ""}`);
  addLine(`Renta mensual: ${formatMoney(contract.monthly_rent)} MXN`);
  addLine(`Depósito en garantía: ${formatMoney(contract.security_deposit)} MXN`);
  addLine(`Día de pago: ${contract.payment_day}`);
  if (contract.penalty) addLine(`Penalización por mora: ${formatMoney(contract.penalty)} MXN`);
  y += 6;
  drawDivider(doc, margin, y); y += 16;

  // Cláusulas (texto base editable)
  addLine("IV. CLÁUSULAS", { bold: true, fontSize: 13, gap: 18 });
  addLine("1. El ARRENDATARIO se obliga a pagar puntualmente la renta en la fecha indicada, por el monto señalado.");
  addLine("2. El depósito en garantía será devuelto al término del contrato, sujeto a verificación de daños y adeudos.");
  addLine("3. El inmueble se destinará exclusivamente a los fines lícitos acordados entre las partes.");
  addLine("4. El incumplimiento en el pago generará la penalización/mora correspondiente, más gastos de cobranza en su caso.");
  addLine("5. Las partes se someten a las leyes y tribunales competentes de la jurisdicción del inmueble.");
  if (contract.notes) {
    addLine("");
    addLine("Observaciones:", { bold: true });
    addLine(contract.notes);
  }

  y += 12;
  drawDivider(doc, margin, y); y += 24;

  // Firmas
  addLine("V. FIRMAS", { bold: true, fontSize: 13, gap: 18 });
  const pageW = doc.internal.pageSize.getWidth();
  const colW = (pageW - margin * 2) / 2;

  const sigY = y + 70;
  // líneas
  doc.setLineWidth(0.5);
  doc.line(margin + 16, sigY, margin + colW - 16, sigY);
  doc.line(margin + colW + 16, sigY, margin + colW * 2 - 16, sigY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(fullName(landlord), margin + 16, sigY + 16, { align: "left" });
  doc.text("ARRENDADOR", margin + 16, sigY + 32, { align: "left" });

  doc.text(fullName(tenant), margin + colW + 16, sigY + 16, { align: "left" });
  doc.text("ARRENDATARIO", margin + colW + 16, sigY + 32, { align: "left" });

  // Pie
  doc.setFontSize(9);
  doc.setTextColor(120);
  const footer = `Folio ${contract.folio || "N/A"} • Generado el ${formatDate(new Date())}`;
  doc.text(footer, pageW - margin, doc.internal.pageSize.getHeight() - 24, { align: "right" });

  // Devuelve Blob (para subir) y que también puedas descargar
  const blob = doc.output("blob");
  return blob;
}

// ------- helpers -------
const joinComma = (v) => (v ? `, ${v}` : "");
const fullName = (p) => [p?.firstname, p?.lastname].filter(Boolean).join(" ");

function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function pad2(n) { return n < 10 ? `0${n}` : `${n}`; }
function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return "N/A";
  // DD/MM/YYYY
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function formatMoney(n) {
  const num = Number(n || 0);
  return num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function drawDivider(doc, x, y) {
  doc.setDrawColor(180);
  doc.setLineWidth(0.7);
  doc.line(x, y, doc.internal.pageSize.getWidth() - x, y);
}
