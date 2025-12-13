import { NextRequest, NextResponse } from "next/server";
import { getLatestRates } from "@/lib/frankfurter";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get("base");

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
    console.error("[/api/rates] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rates. Please try again later." },
      { status: 500 }
    );
  }
}