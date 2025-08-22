// ContractDocument.jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, lineHeight: 1.35, fontFamily: "Helvetica" },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end", marginBottom: 6 },
  bold: { fontWeight: "bold" },
  hlText: { backgroundColor: "#fff59d" },  // amarillo suave
  blank: { borderBottomWidth: 1, borderBottomColor: "#000", height: 12, minWidth: 80, marginHorizontal: 2 },
});

const UC = (s) => (s || "").toLocaleUpperCase("es-MX");

const SegOrBlank = ({ text, width = 140, bold, highlight }) => {
  if (text && String(text).trim()) {
    return (
      <Text style={[bold && styles.bold, highlight && styles.hlText]}>
        {UC(String(text))}
      </Text>
    );
  }
  return (
    <View style={[styles.blank, { width }, highlight && { backgroundColor: "#fff59d" }]} />
  );
};

export default function ContractDocument({ contract, landlord, tenant, property }) {
  const tenantName = UC([tenant?.firstname, tenant?.lastname].filter(Boolean).join(" "));
  const streetNum =
    property?.street || property?.ext_number
      ? UC(`${property?.street || ""} ${property?.ext_number || ""}`.trim())
      : UC(property?.address || "");
  const city = UC(property?.city || "Corregidora");
  const stateAbbr = UC(property?.state_abbr || "Qro.");

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Título */}
        <View style={styles.row}>
          <Text style={styles.bold}>CONTRATO DE ARRENDAMIENTO</Text>
        </View>

        {/* Párrafo como en tu imagen — todo en fila, sin salto tras el nombre */}
        <View style={styles.row}>
          <Text>
            CONTRATO DE ARRENDAMIENTO QUE CELEBRAN POR UNA PARTE INMOBILIARIA Y CONSTRUCTORA LA PEÑA SA DE CV REPRESENTADA LEGALMENTE POR LA C. GABRIELA CARRILLO HERNANDEZ A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL ARRENDADOR", Y POR LA OTRA PARTE LA C.{" "}
          </Text>
          <Text style={styles.bold}>{tenantName}</Text>
          <Text>
            {" "}A QUIEN SE LE DENOMINARÁ EN LO SUCESIVO "EL ARRENDATARIO", CON RELACIÓN AL INMUEBLE UBICADO EN{" "}
          </Text>
          {/* Calle y número en bold + resaltado */}
          <Text style={[styles.bold, styles.hlText]}>{streetNum}</Text>
          <Text>, {city}, {stateAbbr}, EN LO SUCESIVO "EL INMUEBLE", AL TENOR DE LAS SIGUIENTES:</Text>
        </View>

        {/* Ejemplo de campo en blanco subrayado y opcionalmente resaltado */}
        <View style={styles.row}>
          <Text>EL ARRENDATARIO: </Text>
          <SegOrBlank text={tenantName} width={220} bold />
        </View>
        <View style={styles.row}>
          <Text>Domicilio del inmueble: </Text>
          <SegOrBlank text={streetNum} width={260} bold highlight />
          <Text>, {city}, {stateAbbr}</Text>
        </View>

        {/* …continúa con el resto del contrato */}
      </Page>
    </Document>
  );
}
