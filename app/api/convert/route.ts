import { NextRequest, NextResponse } from "next/server";
import { convertCurrency } from "@/lib/frankfurter";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const amountParam = searchParams.get("amount");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Validación básica de parámetros
  if (!amountParam || !from || !to) {
    return NextResponse.json(
      { error: "Missing required query params: amount, from, to" },
      { status: 400 }
    );
  }

  const amount = Number(amountParam);

  if (Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid amount. Must be a number greater than 0." },
      { status: 400 }
    );
  }

  try {
    const converted = await convertCurrency(amount, from, to);

    return NextResponse.json(
      {
        amount,
        from,
        to,
        converted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/convert] Error:", error);

    return NextResponse.json(
      { error: "Failed to convert currency. Please try again later." },
      { status: 500 }
    );
  }
}