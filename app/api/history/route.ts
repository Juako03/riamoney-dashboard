import { NextRequest, NextResponse } from "next/server";
import { getTimeSeries } from "@/lib/frankfurter";

function formatDate(date: Date): string {
  // YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required query params: from, to" },
      { status: 400 }
    );
  }

  try {
    const today = new Date();
    const endDate = formatDate(today);

    const startDateObj = new Date(
      today.getTime() - 29 * 24 * 60 * 60 * 1000 // últimos ~30 días
    );
    const startDate = formatDate(startDateObj);

    const series = await getTimeSeries(startDate, endDate, from, [to]);

    return NextResponse.json(series, { status: 200 });
  } catch (error) {
    console.error("[/api/history] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical rates. Please try again later." },
      { status: 500 }
    );
  }
}