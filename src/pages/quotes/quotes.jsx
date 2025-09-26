import React, { useState } from 'react';
import * as XLSX from "xlsx";
import { fmtNumber, fmtMoney } from "../../utils/format";
import { TextField, MenuItem } from "@mui/material";


export default function Quotes() {
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState('');
    const [months, setMonths] = useState('');
    const [table, setTable] = useState([]);

    const calculate = () => {
        const monthlyRate = rate / 100 / 12;
        const payment =
            (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

        let balance = amount;
        const result = [];

        for (let i = 1; i <= months; i++) {
            const interest = balance * monthlyRate;
            const principal = payment - interest;
            balance -= principal;

            result.push({
                mes: i,
                saldoInicial: (balance + principal).toFixed(2),
                pago: payment.toFixed(2),
                interes: interest.toFixed(2),
                capital: principal.toFixed(2),
                saldoFinal: balance.toFixed(2),
            });
        }

        setTable(result);
    };

    // Exportar a Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Amortización");
        XLSX.writeFile(wb, "amortizacion.xlsx");
    };


    return (
        <div className="bg-white rounded-xl shadow p-6">
            <form>
                <div class="space-y-12">
                    <div class="border-b border-gray-900/10 pb-12">
                        <h2 class="text-base/7 font-semibold text-gray-900">Cotización</h2>
                        {/* <p class="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

                        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-2">
                                <label for="quote-price" class="block text-sm/6 font-medium text-gray-900">Prestamo</label>
                                <div class="mt-2">
                                    <input
                                        id="quote-price"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        name="quote-price"
                                        autocomplete="given-name"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="quote-rate" class="block text-sm/6 font-medium text-gray-900">Interes</label>
                                <div class="mt-2">
                                    <input
                                        id="quote-rate"
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        placeholder="Tasa % anual"
                                        name="quote-rate"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="months" class="block text-sm/6 font-medium text-gray-900">Periodo</label>
                                <div class="mt-2">
                                    <input
                                        id="months"
                                        type="number"
                                        value={months}
                                        onChange={(e) => setMonths(Number(e.target.value))}
                                        placeholder="Meses"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                </div>
                            </div>


                        </div>
                    </div>


                </div>

                <div class="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
                    <button type="button" onClick={calculate} class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                </div>
            </form>

            {/* Tabla */}
            {table.length > 0 && (
                <>
                    <table className="border-collapse border w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">Mes</th>
                                <th className="border px-2 py-1">Saldo Inicial</th>
                                <th className="border px-2 py-1">Pago</th>
                                <th className="border px-2 py-1">Interés</th>
                                <th className="border px-2 py-1">Capital</th>
                                <th className="border px-2 py-1">Saldo Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.map((row) => (
                                <tr key={row.mes}>
                                    <td className="border px-2 py-1">{row.mes}</td>
                                    <td className="border px-2 py-1">{fmtMoney(row.saldoInicial)}</td>
                                    <td className="border px-2 py-1">{fmtMoney(row.pago)}</td>
                                    <td className="border px-2 py-1">{fmtMoney(row.interes)}</td>
                                    <td className="border px-2 py-1">{fmtMoney(row.capital)}</td>
                                    <td className="border px-2 py-1">{fmtMoney(row.saldoFinal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={exportToExcel}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Exportar a Excel
                    </button>
                </>
            )}

        </div>
    );

}