import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { numeroAMXN } from "../../utils/numALetras";
import { fmtNumber, fmtMoney } from "../../utils/format";
import { DateLong } from "../../utils/dates";


const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 12, lineHeight: 1.35, fontFamily: "Helvetica" },
  h1: { fontSize: 14, textAlign: "center", fontWeight: "bold", marginBottom: 12 },
  p: { marginBottom: 8, textAlign: "justify" },
  list: { paddingLeft: 10 },
  listend: { paddingLeft: 10, marginBottom: 8 },
  paragraph: { fontSize: 12, textAlign: "justify", marginBottom: 8 },
  bold: { fontWeight: "bold" },
  h1bold: { textDecoration: 'underline', fontWeight: 'bold' },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginTop: 10, marginBottom: 6, textTransform: "uppercase", textAlign: "center" },
  clauseTitle: { fontWeight: "bold" },
  blank: { borderBottomWidth: 1, borderBottomColor: "#000", height: 12, minWidth: 110, marginHorizontal: 2 },
  listRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  listLabel: { width: 18, textAlign: "right", fontWeight: "bold", marginRight: 6 },
  listContent: { flex: 1, textAlign: "justify" },
  // ===== Tabla bancaria =====
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 2,
    marginBottom: 8
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  lastCell: { borderRightWidth: 0 },
  // líneas horizontales internas
  rowDivider: { borderTopWidth: 1, borderColor: "#000" },

  headerCell: { backgroundColor: "#c9c9c9", fontWeight: "bold", textTransform: "uppercase", },
  labelCell: { fontWeight: "bold", textTransform: "uppercase" },
  // Firma
  cellCenter: { alignItems: "center", justifyContent: "center" },
  headerText: { fontWeight: "bold", textAlign: "center" },
  signArea: {
    minHeight: 170,            // altura del “espacio en blanco” (ajusta)
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 16,
  },
  signLine: {
    width: "80%",
    borderBottomWidth: 1.2,
    borderColor: "#000",
    marginBottom: 6,
  },
  signTenant: { textAlign: "center", fontSize: 11, fontWeight: "bold", marginBottom: 30, },
  signName: { textAlign: "center", fontSize: 11, fontWeight: "bold" },
  signSub: { textAlign: "center", fontSize: 10, fontWeight: "bold" },
});

// minúsculas con reglas locales
const DC = (s) => String(s ?? "").toLocaleLowerCase("es-MX");
// (por si quieres mayúsculas)
const UC = (s) => String(s ?? "").toLocaleUpperCase("es-MX");
const group4 = (s) => String(s ?? "").replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();


const fmt = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d)) return String(iso);
  return d.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" });
};

const SegOrBlank = ({ text, width = 140, bold }) =>
  text && String(text).trim()
    ? <Text style={[bold && styles.bold]}>{String(text)}</Text>
    : <View style={[styles.blank, { width }]} />;

function BankTable({ bankName, beneficiary, account, clabe }) {
  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.row}>
        <View style={[styles.cell, styles.headerCell]}>
          <Text>Institución financiera</Text>
        </View>
        <View style={[styles.cell, styles.headerCell, styles.lastCell]}>
          <Text>{UC(bankName)}</Text>
        </View>
      </View>

      {/* Beneficiario */}
      <View style={[styles.row, styles.rowDivider]}>
        <View style={[styles.cell, styles.labelCell]}>
          <Text>Beneficiario:</Text>
        </View>
        <View style={[styles.cell, styles.lastCell]}>
          <Text>{UC(beneficiary)}</Text>
        </View>
      </View>

      {/* Cuenta */}
      <View style={[styles.row, styles.rowDivider]}>
        <View style={[styles.cell, styles.labelCell]}>
          <Text>Cuenta:</Text>
        </View>
        <View style={[styles.cell, styles.lastCell]}>
          <Text>{group4(account)}</Text>
        </View>
      </View>

      {/* CLABE */}
      <View style={[styles.row, styles.rowDivider]}>
        <View style={[styles.cell, styles.labelCell]}>
          <Text>Clabe:</Text>
        </View>
        <View style={[styles.cell, styles.lastCell]}>
          <Text>{group4(clabe)}</Text>
        </View>
      </View>
    </View>
  );
}

const AlphaList = ({ items, start = "A", suffix = ")", gap = 6 }) => {
  const base = (typeof start === "string" ? start.charCodeAt(0) : 65) - 65; // 65 = 'A'
  return (
    <View>
      {items.map((item, i) => {
        const label = String.fromCharCode(65 + base + i) + suffix;
        return (
          <View key={i} style={[styles.listRow, { marginBottom: gap }]}>
            <Text style={styles.listLabel}>{label}</Text>
            {/* item puede ser string o <Text>…</Text> con negritas, etc. */}
            {typeof item === "string" ? (
              <Text style={styles.listContent}>{item}</Text>
            ) : (
              <Text style={styles.listContent}>{item}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default function ContractDocument({ contract, landlord, tenant, property }) {
  const tenantName = UC([tenant?.firstname, tenant?.lastname].filter(Boolean).join(" "));
  const curp = UC(tenant?.curp || "");
  const rfc = UC(tenant?.rfc || "");
  const email = DC(tenant?.email || "");
  const address = UC(
    [property?.street || null, property?.colony || null, property?.postal_code || null, property?.municipality || null, property?.state || null].filter(Boolean).join(" ") ||
    property?.address || ""
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>CONTRATO DE ARRENDAMIENTO</Text>

        {/* Párrafo inicial exactamente como en tu documento, con campos dinámicos */}
        <View style={styles.row}>
          <Text style={styles.paragraph}>
            CONTRATO DE ARRENDAMIENTO QUE CELEBRAN POR UNA PARTE INMOBILIARIA Y CONSTRUCTORA LA PEÑA SA DE CV
            REPRESENTADA LEGALMENTE POR LA C. GABRIELA CARRILLO HERNANDEZ A QUIEN EN LO SUCESIVO SE LE DENOMINARA "EL ARRENDADOR",
            Y POR LA OTRA PARTE LA C. <Text style={styles.h1bold}><SegOrBlank text={tenantName} width={220} /></Text> A QUIEN SE LE
            DENOMINARA EN LO SUCESIVO "EL ARRENDATARIO", CON RELACION AL INMUEBLE UBICADO EN{" "} <SegOrBlank text={address} width={260} bold />
            , EN LO SUCESIVO "EL INMUEBLE", AL TENOR DE LA SIGUIENTES:
          </Text>
        </View>

        <Text style={styles.sectionTitle}>DECLARACIONES</Text>

        <Text style={styles.p}>
          <Text style={styles.h1bold}>
            DECLARA "EL ARRENDADOR"
          </Text>, por conducto de su representante que:
        </Text>
        <Text style={styles.p}>
          <Text style={styles.bold}>PRIMERA. </Text>- Que la personalidad de su representante se encuentra debidamente acreditada mediante la <Text style={styles.bold}>Escritura Pública 9,435</Text>,
          de fecha 28 de febrero de 2014, pasada ante la fe del señor Licenciado Leopoldo Mondragón González, Notario Titular de la Notaría Pública número 29 de la Demarcación
          Notarial de Querétaro. mediante la cual se acredita que cuenta con facultades suficientes para obligarse en los términos del presente instrumento y que las mismas
          no le han sido revocadas ni limitadas de manera alguna.
        </Text>
        <Text style={styles.p}><Text style={styles.bold}>SEGUNDA. </Text>- Que el nombre de su representante es <Text style={styles.bold}>GABRIELA CARRILLO HERNANDEZ.</Text></Text>
        <Text style={styles.p}><Text style={styles.bold}>TERCERA. </Text>- Que su representante es de nacionalidad mexicana.</Text>
        <Text style={styles.p}><Text style={styles.bold}>CUARTA. </Text>- Que es su voluntad dar en arrendamiento "EL INMUEBLE".</Text>
        <Text style={styles.p}><Text style={styles.bold}>QUINTA. </Text>- Que "EL INMUEBLE" se encuentra libre de gravámenes al momento de la firma del presente contrato.</Text>
        <Text style={styles.p}>PARA TODOS LOS FINES Y EFECTOS LEGALES DEL PRESENTE CONTRATO, SEÑALA COMO DOMICILIO LEGAL EL UBICADO EN</Text>

        <Text style={styles.p}>
          <Text style={styles.h1bold}>
            DECLARA "EL ARRENDATARIO":
          </Text>
        </Text>
        <Text style={styles.p}><Text style={styles.bold}>PRIMERA. </Text>- Que su nombre es <Text style={styles.h1bold}><SegOrBlank text={tenantName} width={220} /></Text></Text>
        <Text style={styles.p}><Text style={styles.bold}>SEGUNDA. </Text>- Que es de nacionalidad mexicana.</Text>
        <Text style={styles.p}><Text style={styles.bold}>TERCERA. </Text>- Que se identifica con los siguientes datos:</Text>
        <Text style={styles.list}><Text> - CURP: </Text><Text><SegOrBlank text={curp} width={220} bold /></Text></Text>
        <Text style={styles.listend}><Text> - RFC: </Text><Text><SegOrBlank text={rfc} width={220} bold /></Text></Text>
        <Text style={styles.p}><Text style={styles.bold}>CUARTA. </Text>- Que es su voluntad arrendar "EL INMUEBLE" objeto del presente instrumento.</Text>
        <Text style={styles.p}><Text style={styles.bold}>QUINTA. </Text>- Manifiesta su total voluntad en recibir "EL INMUEBLE" en las condiciones en las que se encuentra.</Text>
        <Text style={styles.p}><Text style={styles.bold}>SEXTA. </Text>- Conoce las declaraciones vertidas por "EL ARRENDADOR", así como el estado del inmueble, por los que manifiesta su
          conformidad en ellos junto con su actuar de buena fe durante la vigencia del presente arrendamiento.</Text>
        <Text style={styles.p}><Text style={styles.bold}>SEPTIMA. </Text>- Destinará el Inmueble únicamente para actividades apegadas a la Ley. y que, de ninguna manera, esta ni estará en ninguno
          de los supuestos que prevé la Ley Nacional de Extinción de Dominio, así como sus correlativos y aplicables a la Ciudad de Querétaro y demás leyes aplicables.</Text>
        <Text style={styles.p}><Text style={styles.bold}>OCTAVA. </Text>- Para efectos de comunicación entre las partes que suscriben el presente contrato,
          señala da siguiente dirección de correo electrónico: <Text style={styles.h1bold}>{email} </Text></Text>

        <Text style={styles.p}>
          <Text style={styles.h1bold}>
            DECLARAN LAS PARTES:
          </Text>
        </Text>
        <Text style={styles.p}><Text style={styles.bold}>PRIMERA. </Text>- Que objeto del presente contrato es el ubicado en: <Text style={styles.h1bold}><SegOrBlank text={address} width={220} /></Text></Text>
        <Text style={styles.p}><Text style={styles.bold}>SEGUNDA. </Text>- Se reconocen mutuamente la personalidad con la que se ostentan,
          señalando que es su total voluntad celebrar el presente instrumento.</Text>
        <Text style={styles.p}><Text style={styles.bold}>TERCERA. </Text>- Que la información recopilada para la elaboración del presente contrato de arrendamiento fue realizada sin dolo,
          mala fe, engaño o cualquier otro elemento que pudiera perjudicar el presente acto jurídico entre las partes descritas a lo largo del instrumento.</Text>
        <Text style={styles.p}>
          Expuestas las anteriores declaraciones, las partes están de acuerdo en celebrar el presente Contrato, sujetando su realización y cumplimiento a observancia de lo pactado en las siguientes:
        </Text>

        <Text style={styles.sectionTitle}>CLÁUSULAS</Text>
        {/* Clausala 1 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>PRIMERA. </Text>- OBJETO EL ARRENDADOR" da en ARRENDAMIENTO a el ARRENDATARIO y éste recibe de conformidad y
          a su entera satisfacción bajo ese título "EL INMUEBLE” ubicado en <Text style={styles.h1bold}>{address}.</Text> Mismo que se encuentra en óptimas condiciones de uso y
          funcionamiento, siendo todo lo señalado en el presente instrumento de manera enunciativa más no limitativa.
        </Text>
        {/* Clausala 2 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>SEGUNDA. </Text>— DURACION DEL ARRENDAMIENTO. El término de este contrato será de DOCE MESES FORZOSOS para "LAS PARTES",
          con fecha de inicio el día <Text><SegOrBlank text={fmt(contract?.dt_start)} width={110} /></Text> y fecha de vencimiento <Text><SegOrBlank text={fmt(contract?.dt_end)} width={110} /></Text>.
        </Text>

        <Text style={styles.p}>
          Siendo la fecha de inicio el día en que se hará la entrega de "EL INMUEBLE" de conformidad con los términos y condiciones establecidos en el presente contrato mismo
          que "EL ARRENDATARIO" lo aceptará expresamente en las condiciones en las que te encuentra el mismo.
        </Text>
        {/* Clausala 3 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>TERCERA. </Text>- RENTA MENSUAL. El ARRENDATARIO pagará a "EL ARRENDADOR" por concepto de RENTA MENSUAL la cantidad de
          $<Text style={styles.h1bold}><SegOrBlank text={fmtNumber(contract?.monthly_rent)} width={80} /> {"("}{numeroAMXN(contract?.monthly_rent)}{")"}</Text>;
          mensualidad que deberá pagar en su totalidad "EL ARRENDATARIO" el día <Text><SegOrBlank text={contract?.payment_day} width={40} /></Text> de cada mes debiendo cubrir
          dicha obligación de pago sin demora alguna dentro de la fecha pactada( teniendo 5 dias de gracia ), señalando que por cada día de atraso,
          después de los días de gracia, se le aplicará a la cantidad adeudado la PENA CONVENCIONAL estipulada dentro de la cláusula sexta.
        </Text>

        <Text style={styles.p}>
          El pago de la renta previamente señalada se cubrirá por medio de transferencia electrónica con los siguientes datos bancarios:
        </Text>

        <BankTable
          bankName="BANCO DEL BAJÍO"
          beneficiary="INMOBILIARIA CONSTRUCTORA LA PEÑA SA DE CV"
          account="35725420209"
          clabe="030680357254202098"
        />

        <Text style={styles.p}>
          La obligación de pago previamente descrita deberá de ser cubierta en su TOTALIDAD. supuesto en el que no ocurra de esa manera se tomará como no cubierto el
          pago de “EL ARRENDATARIO” celebrado en el presente instrumento, siendo obligación de "EL ARRENDATARIO" cubrir la totalidad de la cantidad
          consistente en $<Text style={styles.h1bold}><SegOrBlank text={fmtNumber(contract?.monthly_rent)} width={80} /> {"("}{numeroAMXN(contract?.monthly_rent)}{")"}</Text> dentro de los
          plazos estipulados por las partes.
        </Text>
        {/* Clausala 4 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>CUARTA. </Text>— INCREMENTO. EL MONTO DE LA RENTA SE INCREMENTARÁ ANUALMENTE CONFORME AL ACUERDO AL QUE LLEGUEN AMBAS PARTES.
        </Text>
        {/* Clausala 5 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>QUINTA. </Text>— Toda mensualidad de renta será pagada íntegramente aun cuando "EL ARRENDATARIO solo ocupe e inmueble parte del mes, siendo
          causa de recisión de contrato el simple retraso de "EL ARRENDATARIO" en el pago de 1 (una).
        </Text>
        {/* Clausala 6 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>SEXTA. </Text>— PENA CONVENCIONAL POR ATRASO EN PAGO DE RENTA SI EL ARRENDATARIO" incumple con sus obligaciones de pago de renta dentro del día
          convenido en la CLAUSULA TERCERA, pagara a "EL ARRENDADOR" el 5% (cinco por ciento) mensual por concepto de INTERESES MORATORIOS, cálculos sobre el importe de la RENTA MENSUAL,
          que señalo la “CLAUSULA TERCERA” de este contrato, mismos intereses que se seguirán acumulando desde la fecha de incumplimiento de pago hasta su liquidación total.
        </Text>
        {/* Clausala 7 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>SEPTIMA. </Text>— Las partes acuerdan que el pago de la renta se realizara en una sola exhibición, en su totalidad y en la fecha establecida, de acuerdo
          a lo previsto en la “CLAUSULA TERCERA” del presente contrato.
        </Text>
        {/* Clausala 8 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>OCTAVA. </Text>— SUBARRIENDO "EL ARRENDATARIO" no podrá subarrendar, traspasar o ceder, toda a parte del inmueble arrendado, de presentarse el caso
          será causa suficiente para rescindir el presente contrato, obligando a "EL ARRENDATARIO" desalojar de manera inmediata y a cubrir la pena convencional señalada en la CLAUSULA
          DECIMA CUARTA del presente contrato, por lo cual las partes convienen que:
        </Text>

        <Text style={styles.p}>
          EN CUANTO AL USO DEL INMUEBLE: “LAS PARTES” CONVIENEN QUE “EL INMUEBLE” SE USARÁ PARA LOS FINES QUE TIENE ENCOMENDADOS “LA ARRENDATARIA” ASÍ COMO DE SUS USUARIOS,
          QUE ES EXCLUSIVAMENTE USO( HABITACIONAL.). ( COMERCIAL)
        </Text>

        <Text style={styles.listend}>
          a)	TRASPASO O SUBARRIENDO:, “LA ARRENDATARIA” NO PODRÁ SUBARRENDAR LA TOTALIDAD O PARTE DE “EL INMUEBLE”, NI TRASPASAR O GRAVAR EN FORMA ALGUNA SUS DERECHOS Y
          OBLIGACIONES DERIVADAS DEL PRESENTE CONTRATO, A MENOS QUE OBTENGA EL CONSENTIMIENTO EXPRESO Y POR ESCRITO DE “EL ARRENDADOR”. “EL ARRENDADOR” EN CUALQUIER
          MOMENTO PODRÁ TRASPASAR, PASAR, CEDER, AFECTAR, APORTAR, TRANSMITIR O DE CUALQUIER FORMA ENAJENAR LOS DERECHOS DERIVADOS DEL PRESENTE CONTRATO Y LOS DERECHOS DE
          COBRO DE LOS MISMOS, INCLUYENDO SUS ACCESORIOS TALES COMO HIPOTECA, FIANZA, PRENDA O CUALQUIER Página 5 de 9 OTRO PRIVILEGIO CON EL QUE, EN SU CASO, SE CUENTE,
          YA SEA DE MANERA PARCIAL O TOTAL, ASÍ COMO ENAJENAR, HIPOTECAR, AFECTAR, APORTAR, TRANSMITIR O GRAVAR DE CUALQUIER FORMA “EL INMUEBLE”. LO ANTERIOR, SIEMPRE Y
          CUANDO NO AFECTE LOS DERECHOS DE “LA ARRENDATARIA” AL AMPARO DEL PRESENTE CONTRATO Y DE CONFORMIDAD CON LA LEGISLACIÓN APLICABLE.

        </Text>
        {/* Clausala 9 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>NOVENA. </Text>— USO DEL INMUEBLE El inmueble arrendado tiene la característica de ("DEPARTAMENTO HABITACIONAL") ( LOCAL COMERCIAL) y
          el mismo se destinará exclusivamente para dicho uso, en caso que "EL ARRENDATARIO" haga uso distinto al estipulada, será causa suficiente para rescindir el contrato
          y "EL ARRENDATARIO estará obligado a desocuparlo aun cuando no haya concluido el plazo fijado en la CLAUSULA SEGUNDA de este contrato. Obligándose "EL ARRENDATARIO a
          cubrir la pena convencional señalada en la CLAUSULA DECIMA CUARTA por el incumplimiento "EL ARRENDADOR nace la entrega de "EL INMUEBLE" a "EL ARRENDATARIO", mismo que
          se encuentra en perfecta condición, estado y totalmente funcional obligándose "EL ARRENDATARIO" a lo señalado en la CLAUSULA DECIMA PRIMERA respecto del cuidado del inmueble.
        </Text>
        <Text style={styles.listend}>
          a)	INSPECCIONES Y VISITAS: “LA ARRENDATARIA”, conviene en permitir que “EL ARRENDADOR” o sus representantes entren a “EL INMUEBLE” si así lo requieren conveniente,
          con fines de inspeccionar las condiciones del mismo o para hacer las adiciones, mejoras, cambios o alteraciones que estimen convenientes en “EL INMUEBLE”. dichos
          representantes deberán estar plenamente identificados por “EL ARRENDADOR”, a través de comunicado enviado a “LA ARRENDATARIA” CON POR LO MENOS 5 DÍAS NATURALES DE ANTICIPACIÓN
          PARA SU CONOCIMIENTO.
        </Text>
        {/* Clausala 10 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA. </Text>— SERVICIOS DEL INMUEBLE "EL ARRENDATARIO recibe el inmueble sin adeuda alguno de servicias de electricidad, agua y demás servicios
          recibiendo por parte de "EL ARRENDADOR los recibos con los que se acredita lo anterior.
        </Text>
        <Text style={styles.p}>
          Por otra parte, "EL ARRENDATARIO" se compromete a pagar oportunamente los consumos de energía eléctrica a la Comisión Federal de electricidad, así como los demás servicios con
          los que cuenta el inmueble, debiendo "EL ARRENDATARIO" entregar a "EL ARRENDADOR" el último recibo de los citados servicios debidamente cubiertos al momento de desocupar y
          entregar el inmueble arrendado.
        </Text>
        <Text style={styles.p}>
          Asimismo, para el caso de que "EL ARRENDATARIO" contratase a nombre propio servicios como teléfono televisión por cable y/o internet, deberán también al momento de desocupar y
          entregar el inmueble arrendado, entregar a EL ARRENDADOR" el documento que acredite la debida liquidación y cancelación de los servicios que por cuenta propia hubiera contratado
          "EL ARRENDATARIO".
        </Text>
        {/* Clausala 11 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA PRIMERA. </Text>— DEL CUIDADO DEL INMUEBLE "EL ARRENDATARIO" se obliga con “EL ARRENDADOR” a no perforar azulejos, pisos, puertas, colocar muebles
          o cualquier tipo de acción que pueda dañar los acabados, mobiliario y la integridad de" EL INMUEBLE sin previa autorización por escrito de "EL ARRENDADOR", de igual forma se
          compromete a darle un mantenimiento adecuado y oportuno a los muebles que forman parte de las instalaciones del inmueble.
        </Text>
        <Text style={styles.p}>
          Así como en caso de rotura de vidrios, daño al mobiliario y a cualquier elemento físico del inmueble será "EL ARRENDATARIO el que deberá subsanar y reparar de inmediato dicha situación,
          removiendo cualquier tipo de responsabilidad de los daños ocasionados por "EL ARRENDATARIO" a "EL ARRENDADOR" por la falta de mantenimiento al bien Inmueble objeto del presente contrato.
        </Text>
        <Text style={styles.p}>
          En caso de cualquier daño deterioro a detrimento al inmueble objeto del presente contrato por uso incorrecto, negligente o inadecuado será obligación de “EL ARRENDATARIO” la reparación
          de dicha situación correlacionada al inmueble, de igual forma se suscribe como concepto de garantía el deposito mencionado en la “CLAUSULA DECIMA SEPTIMA”.
        </Text>
        <Text style={styles.p}>
          La comunicación entre las partes se regirá según lo estipulado en el presente Instrumento, contrayendo la obligación "EL ARRENDATARIO" de dar aviso a "EL ARRENDADOR" de inmediato en el
          mismo día en que sucedió el daño, deterioro o detrimento al inmueble, en caso de ser omiso en el aviso respectiva, será una causal de terminación anticipada del presente contrato de
          arrendamiento, debido acatar los medios de comunicación señalados dentro del presente instrumento, ya que en caso de omitir dicha prerrogativa el aviso no tendrá efecto de notificación alguno.
        </Text>
        {/* Clausala 12 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA SEGUNDA. </Text>— REGLAMENTO INTERNO EL ARRENDATARIO" se compromete a acatar total y cabalmente el REGLAMENTO INTERNO que llegara a tener las instalaciones en
          las que se encuentra "EL INMUEBLE" así como se compromete a acatar y respetar los decibeles de ruido dentro del horario permitido de la zona( residencial ) ( comercial)de conformidad con el
          ACUERDO publicado en el DIARIO OFICIAL DE LA FEDERACION (DOF) en fecha 06 DE NOVIEMBRE DE 2013 con título "ACUERDO POR EL QUE SE MODIFICA EL NUMERAL 5.4 DE LA NORMA OFICIAL MEXICANA
          NOM-081-SEMARNAT-1994, QUE ESTABLECE LOS LIMITES MÁXIMOS PERMISIBLES DE EMISION DE RUIDO DE LAS FUENTES FIJAS Y SU METODO DE MEDICION", siendo el incumplimiento de la presente obligación una
          causal de recisión del presente arrendamiento contrayendo todas las penas enunciadas dentro del suscrito contrato y sin penalización alguna para "EL ARRENDADOR".
        </Text>
        {/* Clausala 13 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA TERCERA. </Text>— "EL ARRENDATARIO" conviene y se obliga expresamente a: LA CONSERVACION DEL INMUEBLE.
        </Text>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>A)</Text>
          <Text style={styles.listContent}>
            Poner en conocimiento de "EL ARRENDADOR", a la brevedad posible y por escrito. “EL ARRENDADOR” sin perjuicio de la obligación que asume “LA ARRENDATARIA” en la cláusula octava del presente
            instrumento, hará a su cargo las reparaciones necesarias para conservar “el inmueble” en estado satisfactorio de servir para el uso estipulado. en caso de reparaciones urgentes e indispensables,
            “EL ARRENDADOR” notificará por escrito a “LA ARRENDATARIA” enlistando las reparaciones, así como identificará al personal que ingresará para tales labores, con una anticipación mínima de 5 (cinco)
            días naturales. la necesidad de reparaciones, bajo la pena de pago de los daños y perjuicios que su comisión cause, de acuerdo al artículo 2300 de Código Civil paro el Estado de Querétaro.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>B)</Text>
          <Text style={styles.listContent}>
            No tener sustancias peligrosas, corrosivas, explosivas, inflamables o ilegales en el inmueble arrendado.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>C)</Text>
          <Text style={styles.listContent}>
            No ejecutar sin el consentimiento de "EL ARRENDADOR", dado previamente por escrito de acuerdo al artículo 2332 del Código Civil del Estado de Querétaro, obra a reforma alguna en el inmueble
            arrendado. En caso le otorgase el consentimiento, las obras o mejoras que lleve a cobo "EL ARRENDATARIO". quedarán siempre a beneficio de "EL ARRENDADOR" en la inteligencia de que estas instalaciones
            sean de tipo permanente.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>D)</Text>
          <Text style={styles.listContent}>
            Para el caso de vicios ocultos que impidan el uso adecuado del inmueble "EL ARRENDATARIO deberá notificar a "EL ARRENDADOR" por escrito, teniendo 30 [treinta) días naturales posteriores a la firma
            del presente contrato para dar aviso de los vicios ocultos a "EL ARRENDADOR"
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>E)</Text>
          <Text style={styles.listContent}>
            "EL ARRENDADOR" se compromete a reparar o autorizar los arreglos una vez notificado, siempre y cuando se trate de vicios ocultos (tuberías rotas, goteras. tinaco o cisternas fracturadas por su antigüedad).
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>F)</Text>
          <Text style={styles.listContent}>
            Devolver el inmueble arrendado en las mismas condiciones en que se recibe (limpio, pintado)
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>G)</Text>
          <Text style={styles.listContent}>
            Manifiesta "EL ARRENDATARIO" haber recibido a entera conformidad y en estado de servir para el uso convenido el inmueble dado en arrendamiento con todos los accesorios e instalaciones completas y en buen estado.
            comprometiéndose a cuidar de las mismas y devolverlos en el mismo estado en que las recibe (limpio y pintado).
            “EL ARRENDADOR” no es responsable de los daños y perjuicios causados a “EL INMUEBLE” que provengan de caso fortuito o fuerza mayor, salvo que estos sucedan por causas imputables a “EL ARRENDADOR”.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>H)</Text>
          <Text style={styles.listContent}>
            "EL ARRENDATARIO" se compromete a permitir a "EL ARRENDADOR realizar una inspección al inmueble en caso de que existan quejas recurrentes por parte de los vecinos sobre el uso inadecuado del inmueble, dicha inspección se
            realizara sin previo aviso.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>I)</Text>
          <Text style={styles.listContent}>
            DAÑOS, PÉRDIDAS, ROBOS Y DEFECTOS: “EL ARRENDADOR” no será responsable de ningún daño a los bienes muebles propiedad de “LA ARRENDATARIA” EN “EL INMUEBLE” o áreas de uso común, ni de las pérdidas por robo o por otras circunstancias.
          </Text>
        </View>
        {/* Clausala 14 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA CUARTA. </Text>— DE LA TERMINACIÓN ANTICIPADA. En el supuesto de que "EL ARRENDATARIO pretenda dar por concluido el arrendamiento antes de su vencimiento por cualquiera que sea la causa, deberá pagar a
          "EL ARRENDADOR" entera e íntegramente como concepto de PENA CONVENCIONAL el imparte equivalente a 2 (dos) meses de renta
        </Text>
        <Text style={styles.p}>
          Si por aluna razón personal o financiera O financiera el arrendatario no puede seguir pagando en su totalidad el importe de la RENTA PACTADA en el presente contrato, será motivo de rescisión del mismo y aplicará la pena convencional descrita en el párrafo anterior.
        </Text>
        <Text style={styles.p}>
          Así como correrá a cargo de “EL ARRENDADOR” los GASTOS Y COSTAS que se generen en materia de cobranza  legal, hasta la liquidación del adeudo que se pudiera generar.
        </Text>

        {/* Clausala 15 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA QUINTA. </Text> PRORROGA-"EL ARRENDATARIO" se obliga a dar aviso por escrito UN MES antes del vencimiento del presente contrato a "EL ARRENDADOR", si es su deseo extender más el
          arrendamiento o no pactando ambas partes que deberá realizarse un nuevo contrato, que ampare las condiciones de la duración del próximo arrendamiento. o en caso contrario. "EL ARRENDATARIO" se obliga a mostrar el
          inferior del inmueble arrendado a las personas que pretendan verla y permitir poner cédula de publicidad en puertas y ventanas, esto visita será previa coordinación anticipada en que suceda dicha visita, el aviso será
          por parte de "EL ARRENDADOR con 24 horas de anticipación.
        </Text>

        {/* Clausala 16 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA SEXTA. </Text> - "EI ARRENDATARIO" no podrá retener las rentas en ningún caso ni bajo ningún título judicial o extrajudicialmente, ni por falta de compostura ni por reparaciones,
          sino que las pagará íntegramente en las fechas estipuladas.
        </Text>

        {/* Clausala 17 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA SEXTA. </Text> - GARANTIA DE PRENDA SOBRE DINERO. Paro seguridad y garantía en el cumplimiento de todo lo estipulado en el presente contrato, "EL ARRENDATARIO" hace entrega por concepto de
          prenda de dinero lo cantidad de $<Text style={styles.h1bold}><SegOrBlank text={fmtNumber(contract?.security_deposit)} width={80} /> {"("}{numeroAMXN(contract?.security_deposit)}{")"}</Text> la cual queda en calidad de GARANTIA
          por las posibles daños y deterioros que pudiera sufrir el inmueble arrendado por parte de EL ARRENDATARIO" y/o terceras personas durante el tiempo en que dure el presente contrato, así como cualquier adeudo por servicios
          contratados por "EL ARRENDATARIO. Pero nunca será considerada ni aplicada tal garantía al pago de rentas
        </Text>
        <Text style={styles.p}>
          Si al momento de recibir (la casa habitación), ( local comercial) el depósito que se tiene que devolver no cubre los daños que se hayan encontrado, se hará un listado de lo que se tiene que reparar, del material a usar y de
          mano de obra, lo cual deberá ser cubierto por el arrendatario tomándose en cuenta su depósito.
        </Text>
        <Text style={styles.p}>
          En caso de que <Text style={styles.bold}>"EL ARRENDATARIO"</Text> cumpla en cabalidad y probidad con sus obligaciones, la prenda será reembolsada a "El ARRENDATARIO" en un plazo máximo de 60 DIAS HABILES contados a partir de que sea entregada la posesión
          con los requisitos estipulados dentro de la cláusula décima octava sin que, esto haya causado Intereses a favor de "EL ARRENDATARIO", y una vez que "El ARRENDADOR" verifique que no existan daños, desperfectos o adeudos,
          dentro del Inmueble, pues de existir se tomará cantidad de dicha prenda para cubrir dichas gastes y será el remanente la cantidad a devolver a EL ARRENDATARIO únicamente.
        </Text>
        <Text style={styles.p}>
          De igual forma, los partes acuerdan que en caso de una terminación anticipada la presente PRENDA SOBRE DINERO no será tomada en consideración como compensación a la PENA CONVENCIONAL estipulada en la cláusula DECIMA CUARTA del
          presente instrumento, y misma PRENDA SOBRE DINERO que será retenida en su totalidad para cubrir los servicios pendientes o desperfectos que puedan surgir después de la desocupación del inmueble por el uso que se le dio a
          este. Por ello la cantidad señalada como prenda es autónoma de las penas que se hayan señalado en el presente instrumento y misma cantidad que quedara a disposición de "EL ARRENDADOR" en el supuesto de terminación anticipada tal
          y como se señala en la presente.
        </Text>
        <Text style={styles.p}>
          "EL ARRENDATARIO" autoriza a "EL ARRENDADOR a que sobre dicha cantidad prendaria se haga efectiva la reclamación de cualquier adeudo, sin perjuicio de que, si los daños fueren mayores. "EL ARRENDADOR" estará legitimado a demandar
          la diferencia de los daños a reparar más los perjuicios consistentes en todos aquellos días. semanas o meses de renta que "EL ARRENDADOR" no haya podido gozar por causa del tiempo que se le tuvo que dedicar a las reparaciones
          al inmueble y que eran obligación de "EL ARRENDATARIO".
        </Text>
        {/* Clausala 18 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA OCTAVA. </Text> EJECUCIÓN DE LA PRENDA, "EL ARRENDADOR" podrá disponer de la cantidad otorgada como prenda y su compensación sin que requiera notificación a "EL ARRENDATARIO", ya que dicha prenda
          opera por el mero efecto del presente instrumento y el cual únicamente podrá disponer "EL ARRENDADOR" para compensar cualquier adeudo que el "EL ARRENDATARIO" pasea a favor de "EL ARRENDADOR".
        </Text>
        {/* Clausala 19 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>DECIMA NOVENA. </Text> - PLAZO PARA EJECUCIÓN DE LA PRENDA. "EL ARRENDADOR podrá disponer de la cantidad otorgada en prenda para pagar las cantidades adeudas por "EL ARRENDATARIO" desde el día siguiente
          al vencimiento temporal del presente arrendamiento pactado dentro de la cláusula segunda si éste termina por el transcurso del tiempo.
        </Text>
        <Text style={styles.p}>
          "EL ARRENDADOR" podrá disponer del dinero otorgado en prenda desde el día siguiente de la devolución de la posesión del inmueble. su arrendamiento termina por voluntad unilateral de cualquier de las partes a por convenio expreso:
          en todos los demás casos. "EL ARRENDADOR" podrá disponer de la prenda el día siguiente del incumplimiento de las obligaciones de "EL ARRENDATARIO".
        </Text>

        {/* Clausala 20 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGESIMA. </Text> CAUSAS DE RESCISION DE ESTE CONTRATO. - Serán causas de rescisión del presente Contrato, además de las enunciadas por el Código Civil para el Estado de Querétaro, las siguientes:
        </Text>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>A)</Text>
          <Text style={styles.listContent}>
            El hecho de que "EL ARRENDATARIO" no ocupe directamente el inmueble arrendado o sin el consentimiento escrito de "EL ARRENDADOR" lo explote o use de manera distinta a la prevista en este contrato, así como el que total o
            parcialmente ceda, de manera gratuita u onerosa, sus derechos de arrendatario.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>B)</Text>
          <Text style={styles.listContent}>
            La falta de cumplimiento por "EL ARRENDATARIO" de cualquiera de las obligaciones que del presente contrato le derivan.
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>C)</Text>
          <Text style={styles.listContent}>
            La falta de pago de uno o más meses de renta
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>D)</Text>
          <Text style={styles.listContent}>
            La muerte de "EL ARRENDADOR" o la disolución de "EL ARRENDATARIO".
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>E)</Text>
          <Text style={styles.listContent}>
            En el caso de que "EL ARRENDATARIO" subarriende "EL INMUEBLE" sin consentimiento expreso y por escrito de "EL ARRENDADOR".
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>F)</Text>
          <Text style={styles.listContent}>
            En caso de que "EL ARRENDATARIO" abandone el inmueble materia del presente contrato por más de dos meses, automáticamente entrega la posesión material y jurídica del mismo a su propietario, es decir, a "EL ARRENDADOR",
            sin necesidad de declaratoria judicial alguna
          </Text>
        </View>

        {/* Clausala 21 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA PRIMERA. </Text> PENA CONVENCIONAL POR DESOCUPACIÓN. Ambas partes de comunes acuerdos señalan, que en el supuesto que "EL ARRENDATARIO" no acatase los términos de duración dispuestos dentro de
          la cláusula segunda, con un simple día de atraso en la desocupación del inmueble materia del presente arrendamiento. "EL ARRENDATARIO deberá pagar por concepto de pena convencional el monto consistente a la totalidad de la renta
          por los 12 (doce) meses pactados en el presente instrumento, derivado de la desocupación tardía del inmueble y debido a que dicho actuar está ocasionando un menoscabo directo e inmediato a los intereses de "EL ARRENDADOR".
        </Text>

        {/* Clausala 22 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA SEGUNDA. </Text> "EL ARRENDADOR" hace la entrega de "EL INMUEBLE ARRENDATARIO”, mismo que se encuentra equipado y amueblado con diferentes amenidades, las cuales se entregan en perfecta condición,
          estado y totalmente funcionales, mismas que quedan debidamente señaladas dentro del ANEXO 1 “ACTA DE ENTREGA" presente instrumento obligándose "EL ARRENDATARIO lo señalado en la CLÁUSULA DÉCIMA SEPTMA PRIMERA respecto del cuidado del Inmueble
        </Text>

        {/* Clausala 23 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA TERCERA. </Text> PAGARÉS. Para seguridad y garantía en el cumplimiento de todo lo estipulado en el presente contrato, "EL ARRENDATARIO" suscribe la cantidad de 11 PAGARÉS por concepto de garantía de pago. mismos que se encuentran
        </Text>

        {/* Clausala 24 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA CUARTA. </Text> LEY DE EXTINCIÓN DE DOMINIO, EL ARRENDATARIO" bajo protesta de decir verdad y a sabiendas de las consecuencias legales que eso conlleva se compromete a dar única y exclusivamente el uso de (DEPARTAMENTO HABITACIONAL)
          O ( LOCAL COMERCIAL) al inmueble objeto del presente contrato, pagando la renta y los servicios con los recursos licitas que obtiene de su actividad licita a la que se dedica, así como también se compromete a no realizar conductas sospechosas y/o inadecuadas ante terceros,
          ni a realizar actos ilícitos dentro del inmueble arrendado, ni incurrir en algún delito del orden común o federal.
        </Text>
        <Text style={styles.p}>
          "EL ARRENDATARIO" también se obliga a no tener o permitir en dicho Inmueble el almacén de armas de fuego, armas blancas, pólvora, explosivos, droga de cualquier naturaleza, instrumentos para procesarlo y/o cualquier otra de naturaleza análoga que sirva o haya servido para
          cometer algún ilícito, siendo responsables de estos, en caso de que se pretenda involucrar al inmueble materia de este contrato y/o al arrendador a propietario del mismo, deslindando desde este momento tanto al inmueble como a su propietario de dicha responsabilidad y, por
          lo tanto, no será aplicable la LEY FEDERAL DE EXTINCIÓN DE DOMINIO O LA LEY DE EXTINCION DE DOMINIO DE LA ENTIDAD.
        </Text>
        <Text style={styles.p}>
          Las partes convienen que "EL ARRENDATARIO", posesionario y/o ocupante del Inmueble materia del presente contrato será la única responsable si se comete cualquier delito de carácter local o federal y/o dentro del inmueble arrendado, así también "EL ARRENDATARIO cuidará que
          no existan personas secuestradas y/o vehículos o instrumentos que provengan de algún ilícito, por lo que no, ni el agente del ministerio público ni la autoridad judicial federal o estatal podrán inculpar a "EL ARRENDADOR de responsabilidad alguna conforme a la LEY FEDERAL
          DE EXTINCIÓN DE DOMINIO. ni de ninguna otra legislación estatal o federal aplicable.
        </Text>
        <Text style={styles.p}>
          Conviene las partes en que si se Llega a dar el caso de que se inicie proceso de extinción de dominio en contra del inmueble arrendado. "EL ARRENDATARIO” se obliga a pagar los gastos y honorarios de los abogados que se contraten para la debida defensa, así como a pagar
          los daños y perjuicios que se le causen a "EL ARRENDADOR"
        </Text>

        {/* Clausala 25 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA QUINTA. </Text> Para la interpretación y cumplimiento de este contrato, las partes se someten expresamente a los tribunales y leyes competentes del estado de QUERÉTARO: renunciando a cualquier otro fuero que pudiera corresponderles razón
          de sus domicilios presentes o futuros.
        </Text>

        {/* Clausala 26 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA SEXTA. </Text> Así mismo los firmantes pactan que en caso de acudir a las Instancias judiciales para exigir el cumplimiento del presente contrato, o bien cualquier controversia que del mismo se derive, el pago de GASTOS Y COSTAS correrá a
          cargo de "EL ARRENDATARIO".
        </Text>

        {/* Clausala 27 */}
        <Text style={styles.p}>
          <Text style={styles.bold}>VIGÉSIMA SEPTIMA. </Text> - Disposiciones legales aplicables: “las partes” convienen que todo lo no previsto en el presente contrato, se regirá por las disposiciones legales aplicables en la entidad.
        </Text>

        <Text style={styles.p}>
          <Text style={styles.bold}>
            LAS PARTES CONTRATANTES DECLARAN ESTAR DEBIDAMENTE ENTERADAS DE TODAS Y CADA UNA DE LAS CLÁUSULAS CONTENIDAS EN ESTE CONTRATO, Y DE OBLIGACIONES QUE CONTRAEN. LIBRES DE VICIOS DEL CONSENTIMIENTO ASI COMO DE LOS DERECHOS QUE ADQUIEREN, Y QUE CONOCEN TODOS Y CADA UNO DE LOS
            ARTICULOS QUE SE CITAN, HACIÉNDOSE SABEDORES DE LAS RENUNCIAS QUE HACEN DE DERECHOS Y FIRMANDO AL CALCE Y AL MARGEN EN TODAS SUS FOJAS ÚTILES COMO CONSTANCIA DE SU ACEPTACIÓN, EN LA CIUDAD QUERÉTARO DE CONFORMIDAD.
          </Text>
        </Text>

        <Text style={styles.p}>
          <Text style={styles.bold}>
            SE FIRMA ESTE CONTRATO QUE CONSTA DE 11 HOJAS EN LAS OFICINAS DE "EL ARRENDADOR" UBICADAS EN CAMINO REAL 17 FRACC, LUZ MARIA CORREGIDORA, QRO.
            EL DIA <Text style={styles.h1bold}><SegOrBlank text={DateLong()} width={220} /></Text>.
          </Text>
        </Text>

        <Text style={styles.p}>
          <Text style={styles.bold}>
            ESTE CONTRATO SE FIRMA EN ORIGINAL Y COPIA
          </Text>
        </Text>

        {/* Firma */}
        <View style={styles.table}>
          {/* Encabezado */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.headerCell, styles.cellCenter]}>
              <Text style={styles.headerText}>"EL ARRENDADOR"</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.cellCenter, styles.lastCell]}>
              <Text style={styles.headerText}>"EL ARRENDATARIO"</Text>
            </View>
          </View>

          {/* Área de firma (con línea y textos centrados) */}
          <View style={[styles.row, styles.rowDivider]}>
            {/* Columna ARRENDADOR */}
            <View style={[styles.cell, styles.signArea]}>
              <View style={styles.signLine} />
              <Text style={styles.signSub}>Inmobiliaria y constructora la Peña S.A. de C.V.</Text>
              <Text style={styles.signSub}>Representante legal</Text>
              <Text style={styles.signName}>GABRIELA CARRILLO HERNANDEZ</Text>
            </View>

            {/* Columna ARRENDATARIO */}
            <View style={[styles.cell, styles.signArea, styles.lastCell]}>
              <View style={styles.signLine} />
              <Text style={styles.signTenant}>{tenantName}</Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}
