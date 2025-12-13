// Default base currency for the application
export const DEFAULT_BASE_CURRENCY = "EUR";

// Default target currency for the converter
export const DEFAULT_TARGET_CURRENCY = "USD";

// Exchange rates table configuration
export const RATES_CONFIG = {
  majorCurrencies: [
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "EUR",
    "GBP",
    "HKD",
    "JPY",
    "NZD",
    "USD",
  ],
  displayCount: 10,
} as const;

// Historical chart configuration
export const HISTORY_CONFIG = {
  days: 30,
  interactivePointsLimit: 30,
} as const;
