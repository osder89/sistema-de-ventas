import { NextResponse } from "next/server";
import * as customerService from "~/server/service/customer.service";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const data = await request.json();

  try {
    const updatedCustomer = await customerService.updateCustomerService(idNum, data);
    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const result = await customerService.deleteCustomerService(idNum);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
