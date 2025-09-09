// regresa el último día del mes (1..31)
const lastDayOfMonth = (y, m /* 0..11 */) => new Date(y, m + 1, 0).getDate();

// suma meses sin desbordes (mantiene día válido)
function addMonthsSafe(date, months) {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const day = d.getUTCDate();
  const res = new Date(Date.UTC(y, m, 1));
  const ld = lastDayOfMonth(res.getUTCFullYear(), res.getUTCMonth());
  res.setUTCDate(Math.min(day, ld));
  return res;
}

/**
 * Genera pagos mensuales.
 * - Usa paymentDay si viene; si no, el día de dtStart.
 * - Si dt_end existe, calcula cuantos meses entran; si no, genera 12.
 */
export function buildMonthlyPayments({ dt_start, dt_end, payment_day, monthly_rent }) {
  const start = new Date(dt_start);
  const payDay = Number(payment_day) || start.getUTCDate();
  const months = dt_end
    ? Math.max(1,
        (new Date(dt_end).getUTCFullYear() - start.getUTCFullYear()) * 12 +
        (new Date(dt_end).getUTCMonth() - start.getUTCMonth()) + 1
      )
    : 12;

  const items = [];
  for (let i = 0; i < months; i++) {
    const base = addMonthsSafe(start, i);
    const y = base.getUTCFullYear();
    const m = base.getUTCMonth(); // 0..11
    const ld = lastDayOfMonth(y, m);
    const day = Math.min(payDay, ld);
    const due = new Date(Date.UTC(y, m, day));
    items.push({
      no_payment: i + 1,
      due_date: due.toISOString().slice(0, 10), // YYYY-MM-DD
      amount_due: Number(monthly_rent),
      status: "Pendiente",
    });
  }
  return items;
}
