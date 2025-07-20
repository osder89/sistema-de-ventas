import { NextResponse } from "next/server";
import * as customerService from "~/server/service/customer.service";

type ParamsPromise = { params: Promise<{ id: string }> };


export async function PUT(req: Request, { params }: ParamsPromise) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0)
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json();
  try {
    const updated = await customerService.updateCustomerService(idNum, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: Request, { params }: ParamsPromise) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0)
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const deleted = await customerService.deleteCustomerService(idNum);
    return NextResponse.json(deleted, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 400 }
    );
  }
}
