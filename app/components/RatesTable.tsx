"use client";

import { useEffect, useState } from "react";
import type { CurrenciesMap, RatesResponse } from "@/lib/frankfurter";
import { RATES_CONFIG } from "../config/constants";

type Props = {
  base: string;
  currencies: CurrenciesMap;
  initialRates: RatesResponse;
};

// Selects which currencies to display: prioritizes major currencies, fills remaining slots
function computeDisplayCodes(
  base: string,
  rates: RatesResponse
): string[] {
  const availableCodes = Object.keys(rates.rates);

  let selected: string[] = RATES_CONFIG.majorCurrencies.filter((code) => availableCodes.includes(code));

  const extrasPool = availableCodes
    .filter((code) => !selected.includes(code) && code !== base)
    .sort((a, b) => a.localeCompare(b));

  const needed = RATES_CONFIG.displayCount - selected.length;
  if (needed > 0) {
    selected.push(...extrasPool.slice(0, needed));
  }

  if (selected.includes(base)) {
    selected = selected.filter((code) => code !== base);

    const pool = availableCodes
      .filter((code) => !selected.includes(code) && code !== base)
      .sort((a, b) => a.localeCompare(b));

    if (pool.length > 0) {
      selected.push(pool[0]);
    }
  }

  selected = Array.from(new Set(selected)).sort((a, b) => a.localeCompare(b));

  return selected.slice(0, RATES_CONFIG.displayCount);
}

export default function RatesTable({ base, currencies, initialRates }: Props) {
  // Component state: manages selected base currency and fetched rates
  const [currentBase, setCurrentBase] = useState(base);
  const [rates, setRates] = useState<RatesResponse>(initialRates);
  const [displayCodes, setDisplayCodes] = useState<string[]>(() =>
    computeDisplayCodes(base, initialRates)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseOptions = Object.keys(currencies).sort((a, b) => a.localeCompare(b));

  // Format date with weekday and 24-hour time in UTC
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T23:59:00Z');
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
      timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  // Fetch new rates when base currency changes
  useEffect(() => {
    if (currentBase === base) {
      setRates(initialRates);
      setDisplayCodes(computeDisplayCodes(currentBase, initialRates));
      return;
    }

    async function fetchRates() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/rates?base=${currentBase}`);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to fetch rates");
        }

        const data = (await res.json()) as RatesResponse;
        setRates(data);
        setDisplayCodes(computeDisplayCodes(currentBase, data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [currentBase, base, initialRates, currencies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Exchange Rates Overview</h2>
      </div>

      {/* Loading and error states */}
      {loading && <p className="text-sm text-gray-600">Loading rates...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Rates table */}
      {!loading && !error && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Base currency:</label>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                style={{ borderWidth: '0.5px' }}
                value={currentBase}
                onChange={(e) => setCurrentBase(e.target.value)}
              >
                {baseOptions.map((code) => (
                  <option key={code} value={code}>
                    {code} - {currencies[code]}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500 font-bold">{formatDate(rates.date)}</span>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-sm">Code</th>
                  <th className="text-left py-3 px-4 font-bold text-sm">Name</th>
                  <th className="text-right py-3 px-4 font-bold text-sm">Rate</th>
                </tr>
              </thead>
              <tbody>
                {displayCodes.map((code, index) => {
                  const rate = rates.rates[code];
                  if (rate === undefined) return null;

                  return (
                    <tr 
                      key={code} 
                      className={index !== displayCodes.length - 1 ? "border-b border-gray-200" : ""}
                    >
                      <td className="py-3 px-4 font-normal">{code}</td>
                      <td className="py-3 px-4 font-normal">{currencies[code]}</td>
                      <td className="py-3 px-4 text-right font-normal">{rate.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}