import { NextRequest, NextResponse } from "next/server";
import { getTimeSeries } from "@/lib/frankfurter";

// Convert Date object to ISO date string (YYYY-MM-DD)
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// API Route: GET /api/history?from={currency}&to={currency}
// Returns 30-day historical exchange rate data between two currencies
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Validate required parameters
  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required query params: from, to" },
      { status: 400 }
    );
  }

  try {
    // Calculate date range for last 30 days
    const today = new Date();
    const endDate = formatDate(today);

    // Subtract 29 days to get 30-day range (today + 29 previous days)
    const startDateObj = new Date(
      today.getTime() - 29 * 24 * 60 * 60 * 1000
    );
    const startDate = formatDate(startDateObj);

    const series = await getTimeSeries(startDate, endDate, from, [to]);

    return NextResponse.json(series, { status: 200 });
  } catch (error) {
    // Handle external API errors
    console.error("[/api/history] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical rates. Please try again later." },
      { status: 500 }
    );
  }
}