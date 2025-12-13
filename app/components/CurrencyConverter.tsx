"use client";

import { useEffect, useState, useMemo } from "react";
import type { CurrenciesMap, TimeSeriesResponse } from "@/lib/frankfurter";
import { formatShortDate, getOptimalDecimals } from "@/lib/utils";
import { HISTORY_CONFIG } from "../config/constants";

type Props = {
  currencies: CurrenciesMap;
  defaultFrom: string;
  defaultTo: string;
};

// Data structure for historical exchange rate points
type HistoryPoint = {
  date: string;
  rate: number;
};

// SVG chart component for 30-day historical exchange rate visualization
function HistoryChart({ points, from, to }: { points: HistoryPoint[]; from: string; to: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart dimensions and padding
  const width = 350;
  const height = 250;
  const paddingX = 55;
  const paddingY = 20;

  // Calculate min/max/median values for Y-axis scaling
  const values = points.length > 0 ? points.map((p) => p.rate) : [0];
  const minValRaw = Math.min(...values);
  const maxValRaw = Math.max(...values);
  const medValRaw = (minValRaw + maxValRaw) / 2;

  const decimals = getOptimalDecimals(maxValRaw);

  const span =
    maxValRaw === minValRaw ? (maxValRaw || 1) * 0.05 : maxValRaw - minValRaw;
  const minVal = maxValRaw === minValRaw ? minValRaw - span : minValRaw;
  const maxVal = maxValRaw === minValRaw ? maxValRaw + span : maxValRaw;

  const n = points.length;

  // Map data points to SVG coordinates
  const pointCoordinates = useMemo(() => {
    return points.map((p, i) => {
      const x =
        paddingX +
        (n === 1
          ? 0
          : (i / (n - 1)) * (width - 2 * paddingX));

      const normalized = (p.rate - minVal) / (maxVal - minVal);
      const y =
        height -
        paddingY -
        normalized * (height - 2 * paddingY);

      return { x, y };
    });
  }, [points, minVal, maxVal, n, width, height, paddingX, paddingY]);

  const pathPoints = pointCoordinates
    .map((coord) => `${coord.x},${coord.y}`)
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];
  const middle = points[Math.floor(points.length / 2)];
  
  if (points.length === 0) return null;

  const interactiveStep = Math.max(1, Math.floor(points.length / HISTORY_CONFIG.interactivePointsLimit));

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 space-y-2 relative overflow-visible" style={{ borderWidth: '0.5px' }}>
      <h3 className="text-sm font-semibold">{from}/{to} Last 30 days</h3>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto text-blue-600"
          onMouseLeave={() => setHoveredIndex(null)}
        >
        {/* Simple axes */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#000000"
          strokeWidth={0.5}
          opacity={0.3}
        />
        <line
          x1={paddingX}
          y1={paddingY}
          x2={paddingX}
          y2={height - paddingY}
          stroke="#000000"
          strokeWidth={0.5}
          opacity={0.3}
        />

        {/* Y-axis labels */}
        <text
          x={paddingX - 5}
          y={paddingY}
          textAnchor="end"
          fontSize="14"
          fill="#000000"
          opacity={0.6}
        >
          {maxValRaw.toFixed(decimals)}
        </text>
        <text
          x={paddingX - 5}
          y={height / 2}
          textAnchor="end"
          fontSize="14"
          fill="#000000"
          opacity={0.6}
        >
          {medValRaw.toFixed(decimals)}
        </text>
        <text
          x={paddingX - 5}
          y={height - paddingY}
          textAnchor="end"
          fontSize="14"
          fill="#000000"
          opacity={0.6}
        >
          {minValRaw.toFixed(decimals)}
        </text>

        {/* X-axis labels */}
        <text
          x={paddingX}
          y={height - paddingY + 15}
          textAnchor="start"
          fontSize="14"
          fill="#000000"
          opacity={0.6}
        >
          {formatShortDate(first.date)}
        </text>
        <text
          x={width / 2}
          y={height - paddingY + 15}
          textAnchor="middle"
          fontSize="14"
          fill="#000000"
          opacity={0.6}
        >
          {formatShortDate(middle.date)}
        </text>
        <text
          x={width - paddingX}
          y={height - paddingY + 15}
          textAnchor="end"
          fontSize="14"
          fill="#000000"
          opacity={0.6}
        >
          {formatShortDate(last.date)}
        </text>

        {/* Series line */}
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          points={pathPoints}
        />

        {/* Extreme points */}
        <circle
          cx={paddingX}
          cy={
            height -
            paddingY -
            ((first.rate - minVal) / (maxVal - minVal)) *
              (height - 2 * paddingY)
          }
          r={3}
          fill="currentColor"
        />
        <circle
          cx={width - paddingX}
          cy={
            height -
            paddingY -
            ((last.rate - minVal) / (maxVal - minVal)) *
              (height - 2 * paddingY)
          }
          r={3}
          fill="currentColor"
        />

        {/* Interactive hover points */}
        {pointCoordinates.map((coord, i) => {
          if (i % interactiveStep !== 0 && i !== 0 && i !== points.length - 1) return null;
          return (
            <circle
              key={i}
              cx={coord.x}
              cy={coord.y}
              r={8}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(i)}
            />
          );
        })}

        {/* Highlighted point on hover */}
        {hoveredIndex !== null && (
          <circle
            cx={pointCoordinates[hoveredIndex].x}
            cy={pointCoordinates[hoveredIndex].y}
            r={4}
            fill="#000000"
            stroke="#ffffff"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50 whitespace-nowrap"
          style={{
            left: `${(pointCoordinates[hoveredIndex].x / width) * 100}%`,
            top: `${((pointCoordinates[hoveredIndex].y / height) * 100) - 10}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold">{formatShortDate(points[hoveredIndex].date)}</div>
          <div>{points[hoveredIndex].rate.toFixed(decimals)}</div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function CurrencyConverter({
  currencies,
  defaultFrom,
  defaultTo,
}: Props) {
  // Converter state: amount, currencies, and conversion result
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Historical chart state
  const [history, setHistory] = useState<HistoryPoint[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const currencyCodes = Object.keys(currencies);

  // Auto-convert on amount/currency change with 300ms debounce
  useEffect(() => {
    let cancelled = false;

    async function autoConvert() {
      // Handle edge cases
      if (amount < 0) {
        setResult(null);
        return;
      }

      if (amount === 0) {
        setResult(0);
        setError(null);
        setLoading(false);
        return;
      }

      if (from === to) {
        setResult(amount);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/convert?amount=${amount}&from=${from}&to=${to}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Conversion error");
        }

        const data = await res.json();

        if (!cancelled) {
          setResult(data.converted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setResult(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(autoConvert, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [amount, from, to]);

  // Fetch 30-day historical data when currency pair changes
  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      try {
        setHistoryLoading(true);
        setHistoryError(null);
        setHistory(null);

        // Generate flat 1:1 history for same currency
        if (from === to) {
          const today = new Date();
          const points: HistoryPoint[] = [];
          
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            points.push({ date: dateStr, rate: 1.0 });
          }
          
          if (!cancelled) {
            setHistory(points);
            setHistoryLoading(false);
          }
          return;
        }

        const res = await fetch(`/api/history?from=${from}&to=${to}`);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to fetch history");
        }

        const data = (await res.json()) as TimeSeriesResponse;

        const points: HistoryPoint[] = Object.entries(data.rates)
          .map(([date, rateMap]) => {
            const rate = rateMap[to];
            return { date, rate };
          })
          .filter((p) => typeof p.rate === "number")
          .sort((a, b) => a.date.localeCompare(b.date));

        if (!cancelled) {
          setHistory(points);
        }
      } catch (err) {
        if (!cancelled) {
          setHistoryError(err instanceof Error ? err.message : "Unknown error");
          setHistory(null);
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Currency Converter</h2>

      <div className="bg-gray-50 rounded-3xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calculator Section - 2/3 */}
          <div className="lg:w-2/3 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Currency Column */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">From</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  style={{ borderWidth: '0.5px' }}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  {currencyCodes.map((c) => (
                    <option key={c} value={c}>
                      {c} - {currencies[c]}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  style={{ borderWidth: '0.5px' }}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={0}
                  placeholder="Amount"
                />
              </div>

              {/* To Currency Column */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">To</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  style={{ borderWidth: '0.5px' }}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  {currencyCodes.map((c) => (
                    <option key={c} value={c}>
                      {c} - {currencies[c]}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  style={{ borderWidth: '0.5px' }}
                  value={result ?? ""}
                  readOnly
                  placeholder={loading ? "Converting..." : "Result"}
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Information Footer */}
            <div className="mt-6">
              <p className="text-xs text-gray-500">
                Exchange rates are provided by{" "}
                <a
                  href="https://www.frankfurter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
                >
                  Frankfurter API
                </a>
                , a free and open-source currency data service maintained by the European Central Bank. 
                Rates are updated daily and should be used for informational purposes only.
              </p>
            </div>
          </div>

          {/* Chart Section - 1/3 */}
          <div className="lg:w-1/3">
            {historyLoading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-600">Loading chart...</p>
              </div>
            )}
            {historyError && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-red-600">{historyError}</p>
              </div>
            )}
            {history && !historyLoading && !historyError && history.length > 0 && (
              <HistoryChart points={history} from={from} to={to} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}