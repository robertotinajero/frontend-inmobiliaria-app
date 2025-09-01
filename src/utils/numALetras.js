// src/utils/numALetras.js
const UNIDADES = ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"];
const DIEZ_A_DIECINUEVE = ["diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve"];
const DECENAS = ["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
const CIENTOS_M = {100:"cien",200:"doscientos",300:"trescientos",400:"cuatrocientos",500:"quinientos",600:"seiscientos",700:"setecientos",800:"ochocientos",900:"novecientos"};
const CIENTOS_F = {100:"cien",200:"doscientas",300:"trescientas",400:"cuatrocientas",500:"quinientas",600:"seiscientas",700:"setecientas",800:"ochocientas",900:"novecientas"};

// Apócope para 'uno' delante de sustantivo: "veintiún", "… y un", "un"
function apocoparUno(frase) {
  return frase
    .replace(/ veintiuno$/i, " veintiún")
    .replace(/ y uno$/i, " y un")
    .replace(/ uno$/i, " un");
}

function unidades(n, femenino = false) {
  if (n === 1) return femenino ? "una" : "uno";
  return UNIDADES[n];
}

function decenas(n, femenino = false) {
  if (n < 10) return unidades(n, femenino);
  if (n >= 10 && n < 20) return DIEZ_A_DIECINUEVE[n - 10];
  if (n === 20) return "veinte";
  if (n > 20 && n < 30) {
    const u = n % 10;
    if (u === 0) return "veinte";
    if (u === 1) return femenino ? "veintiuna" : "veintiuno";
    if (u === 2) return "veintidós";
    if (u === 3) return "veintitrés";
    if (u === 6) return "veintiséis";
    return "veinti" + unidades(u, femenino);
  }
  const d = Math.floor(n / 10);
  const u = n % 10;
  return DECENAS[d] + (u ? " y " + unidades(u, femenino) : "");
}

function centenas(n, femenino = false) {
  if (n < 100) return decenas(n, femenino);
  const c = Math.floor(n / 100) * 100; // 100,200,...900
  const r = n % 100;
  const mapa = femenino ? CIENTOS_F : CIENTOS_M;
  if (c === 100 && r === 0) return "cien";
  const pref = (c === 100) ? "ciento" : mapa[c];
  return r ? `${pref} ${decenas(r, femenino)}` : pref;
}

function milesMillones(n, femeninoUltimo = false) {
  if (n === 0) return "cero";

  const millones = Math.floor(n / 1_000_000);
  const miles    = Math.floor((n % 1_000_000) / 1_000);
  const resto    = n % 1_000;

  const partes = [];

  if (millones) {
    if (millones === 1) partes.push("un millón");
    else partes.push(`${milesMillones(millones)} millones`);
  }

  if (miles) {
    if (miles === 1) partes.push("mil");
    else partes.push(apocoparUno(centenas(miles)) + " mil"); // veintiún mil, … y un mil
  }

  if (resto) {
    partes.push(centenas(resto, femeninoUltimo));
  }

  return partes.join(" ").trim();
}

/**
 * Convierte número entero >=0 a letras en español.
 * @param {number} n - entero no negativo (hasta 999,999,999,999 aprox)
 * @param {{femenino?: boolean, mayusculas?: boolean}} opts
 */
export function numeroALetras(n, opts = {}) {
  const { femenino = false, mayusculas = false } = opts;
  const num = Math.trunc(Math.abs(Number(n || 0)));
  let frase = milesMillones(num, femenino);
  return mayusculas ? frase.toLocaleUpperCase("es-MX") : frase;
}

/**
 * Formato de cheque en MXN: "DOSCIENTOS TREINTA PESOS 05/100 M.N."
 * @param {number} n - número (entero o con decimales)
 * @param {{mayusculas?: boolean}} opts
 */
export function numeroAMXN(n, opts = {}) {
  const { mayusculas = true } = opts;
  const num = Math.abs(Number(n || 0));
  const entero = Math.trunc(num);
  const centavos = Math.round((num - entero) * 100);
  // letras para la parte entera (masculino) con apócope antes de "pesos"
  let letras = numeroALetras(entero, { femenino: false, mayusculas: false });
  letras = apocoparUno(letras); // "un", "veintiún", "… y un"

  const pesos = entero === 1 ? "peso" : "pesos";
  const cent = String(centavos).padStart(2, "0");
  let res = `${letras} ${pesos} ${cent}/100 M.N.`;
  return mayusculas ? res.toLocaleUpperCase("es-MX") : res;
}
