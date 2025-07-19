import { NextResponse } from "next/server";
import * as productService from "~/server/service/product.service";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await request.json();

  try {
    const updatedProduct = await productService.updateProductService(Number(id), data);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const response = await productService.deleteProductService(Number(id));
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
