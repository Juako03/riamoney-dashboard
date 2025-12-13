import { getCurrencies, getLatestRates } from "@/lib/frankfurter";
import CurrencyConverter from "./components/CurrencyConverter";
import RatesTable from "./components/RatesTable";
import { DEFAULT_BASE_CURRENCY, DEFAULT_TARGET_CURRENCY } from "./config/constants";

export default async function Page() {
  const currencies = await getCurrencies();
  const rates = await getLatestRates(DEFAULT_BASE_CURRENCY);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <CurrencyConverter
          currencies={currencies}
          defaultFrom={DEFAULT_BASE_CURRENCY}
          defaultTo={DEFAULT_TARGET_CURRENCY}
        />

        <RatesTable
          base={DEFAULT_BASE_CURRENCY}
          currencies={currencies}
          initialRates={rates}
        />
      </div>
    </main>
  );
}
