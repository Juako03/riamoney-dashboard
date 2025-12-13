import { NextRequest, NextResponse } from "next/server";
import { getLatestRates } from "@/lib/frankfurter";

// API Route: GET /api/rates?base={currency}
// Returns current exchange rates for all currencies relative to the specified base currency
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get("base");

  // Validate required parameter
  if (!base) {
    return NextResponse.json(
      { error: "Missing required query param: base" },
      { status: 400 }
    );
  }

  try {
    const rates = await getLatestRates(base);
    return NextResponse.json(rates, { status: 200 });
  } catch (error) {
    // Handle external API errors
    console.error("[/api/rates] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rates. Please try again later." },
      { status: 500 }
    );
  }
}