const BASE_URL = "https://api.frankfurter.app";

export type CurrenciesMap = Record<string, string>;

// Response structure for exchange rate queries
export interface RatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Fetch the list of all available currencies from the API
export async function getCurrencies(): Promise<CurrenciesMap> {
  const res = await fetch(`${BASE_URL}/currencies`);

  if (!res.ok) {
    throw new Error("Failed to fetch currencies from Frankfurter API");
  }

  const data = (await res.json()) as CurrenciesMap;
  return data;
}

// Get the latest exchange rates for a specific base currency
export async function getLatestRates(base: string): Promise<RatesResponse> {
  const url = `${BASE_URL}/latest?from=${encodeURIComponent(base)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch latest rates from Frankfurter API");
  }

  const data = (await res.json()) as RatesResponse;
  return data;
}

// Convert a specific amount from one currency to another
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

  // Extract the converted value from the response
  const rateValues = Object.values(data.rates);
  if (rateValues.length === 0) {
    throw new Error("No rate returned from Frankfurter API");
  }

  return rateValues[0];
}

// Response structure for historical time series data
export interface TimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<
    string, // Date in YYYY-MM-DD format
    Record<string, number> // Currency rates (e.g., { "USD": 1.09 })
  >;
}

// Fetch historical exchange rate data for a date range
export async function getTimeSeries(
  fromDate: string,
  toDate: string,
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