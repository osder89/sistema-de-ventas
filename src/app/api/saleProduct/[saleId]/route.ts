import { NextResponse } from "next/server";
import * as salesProductService from "~/server/service/salesProduct.service";

type ParamsPromise = { params: Promise<{ saleId: string }> };

export async function GET(req: Request, { params }: ParamsPromise) {
  const { saleId } = await params;
  const saleIdNum = Number(saleId);

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 10);
  const search = url.searchParams.get("search") ?? "";

  if (!Number.isInteger(saleIdNum) || saleIdNum <= 0)
    return NextResponse.json({ error: "ID de venta inválido" }, { status: 400 });

  if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(pageSize) || pageSize <= 0)
    return NextResponse.json({ error: "Parámetros de paginación inválidos" }, { status: 400 });

  try {
    const data = await salesProductService.getSaleProductsPaginatedService(
      saleIdNum,
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
