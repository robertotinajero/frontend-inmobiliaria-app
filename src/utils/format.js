// src/utils/format.js
export function fmtNumber(n, decimals = 0) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return num.toLocaleString("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return num.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
}
