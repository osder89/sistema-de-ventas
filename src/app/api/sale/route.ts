import { NextResponse } from "next/server";
import * as salesService from "~/server/service/sales.service";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const newSale = await salesService.createSaleService(data);
    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") ?? "";  
  const page = parseInt(url.searchParams.get("page") ?? "1");  
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "10");  

  try {
    const data = await salesService.getPaginatedSalesService(searchTerm, page, pageSize);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}