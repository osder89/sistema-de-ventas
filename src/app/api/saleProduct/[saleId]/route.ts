import { NextResponse } from "next/server";
import * as salesProductService from "~/server/service/salesProduct.service";

interface RouteParams {
  saleId: string;
}

export async function GET(req: Request, { params }: { params: RouteParams }) {
  const saleId = Number(params.saleId);
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);
  const pageSize = Number(url.searchParams.get("pageSize") || 10);
  const search = url.searchParams.get("search") || "";

  if (!Number.isInteger(saleId) || saleId <= 0) {
    return NextResponse.json({ error: "ID de venta inválido" }, { status: 400 });
  }
  if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(pageSize) || pageSize <= 0) {
    return NextResponse.json({ error: "Parámetros de paginación inválidos" }, { status: 400 });
  }

  try {
    const data = await salesProductService.getSaleProductsPaginatedService(
      saleId,
      page,
      pageSize,
      search
    );
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
