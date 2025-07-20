import { NextResponse } from "next/server";
import * as salesService from "~/server/service/sales.service";


export async function GET(request: Request) {
  const url = new URL(request.url);
  const saleId = parseInt(url.searchParams.get("saleId") ?? "0");

  try {
    if (saleId <= 0) {
      return NextResponse.json({ error: "ID de venta inválido" }, { status: 400 });
    }

    const saleProducts = await salesService.getSaleServiceById(saleId);
    return NextResponse.json(saleProducts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
