const BASE_URL = "https://api.frankfurter.app";

export type CurrenciesMap = Record<string, string>;

export interface RatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function getCurrencies(): Promise<CurrenciesMap> {
  const res = await fetch(`${BASE_URL}/currencies`);

  if (!res.ok) {
    throw new Error("Failed to fetch currencies from Frankfurter API");
  }

  const data = (await res.json()) as CurrenciesMap;
  return data;
}

export async function getLatestRates(base: string): Promise<RatesResponse> {
  const url = `${BASE_URL}/latest?from=${encodeURIComponent(base)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch latest rates from Frankfurter API");
  }

  const data = (await res.json()) as RatesResponse;
  return data;
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  const url = `${BASE_URL}/latest?amount=${encodeURIComponent(
    amount
  )}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to convert currency with Frankfurter API");
  }

  const data = (await res.json()) as RatesResponse;

  const rateValues = Object.values(data.rates);
  if (rateValues.length === 0) {
    throw new Error("No rate returned from Frankfurter API");
  }

  return rateValues[0];
}

export interface TimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<
    string, // fecha YYYY-MM-DD
    Record<string, number> // { "USD": 1.09, ... }
  >;
}

export async function getTimeSeries(
  fromDate: string, // "2024-01-01"
  toDate: string, // "2024-01-31"
  base: string,
  to: string[]
): Promise<TimeSeriesResponse> {
  const toParam = to.join(",");
  const url = `${BASE_URL}/${fromDate}..${toDate}?from=${encodeURIComponent(
    base
  )}&to=${encodeURIComponent(toParam)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch time series from Frankfurter API");
  }

  const data = (await res.json()) as TimeSeriesResponse;
  return data;
}