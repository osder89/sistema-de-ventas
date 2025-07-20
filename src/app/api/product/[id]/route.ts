import { NextResponse } from "next/server";
import * as productService from "~/server/service/product.service";

type ParamsPromise = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: ParamsPromise) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0)
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const data = await request.json();
  try {
    const updatedProduct = await productService.updateProductService(idNum, data);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: ParamsPromise) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0)
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const response = await productService.deleteProductService(idNum);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
