// Moneda base por defecto para la aplicación
export const DEFAULT_BASE_CURRENCY = "EUR";

// Moneda de destino por defecto para el conversor
export const DEFAULT_TARGET_CURRENCY = "USD";

// Configuración de la tabla de tasas
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

// Configuración del histórico
export const HISTORY_CONFIG = {
  days: 30,
  interactivePointsLimit: 30,
} as const;
