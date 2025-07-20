import { NextResponse } from "next/server";
import * as customerService from "~/server/service/customer.service";

type CtxCiPromise = { params: Promise<{ ci: string }> };

export async function GET(_req: Request, { params }: CtxCiPromise) {
  const { ci } = await params;
  const value = ci?.trim();
  if (!value) {
    return NextResponse.json({ error: "CI requerido" }, { status: 400 });
  }
  try {
    const customer = await customerService.getCustomerByCiService(value);
    return NextResponse.json({ customer }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    const status = /no encontrado/i.test(msg) ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
