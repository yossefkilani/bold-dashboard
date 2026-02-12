import { NextRequest, NextResponse } from "next/server";

const store: Map<string, any> =
  (globalThis as any).__QUOTATION_STORE__;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const item = store.get(id);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  store.delete(id);

  return NextResponse.json({ ok: true });
}