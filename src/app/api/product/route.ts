import { NextResponse } from "next/server";
import * as productService from "~/server/service/product.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") || "";  
  const page = parseInt(url.searchParams.get("page") || "1");  
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");  

  try {
    const data = await productService.getPaginatedProductsService(searchTerm, page, pageSize);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const newProduct = await productService.createProductService(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
