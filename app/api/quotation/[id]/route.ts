import { NextRequest, NextResponse } from "next/server";

const store: Map<string, any> =
  (globalThis as any).__QUOTATION_STORE__;

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const item = store.get(params.id);

  if (!item) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  store.delete(params.id);
  return NextResponse.json({ ok: true });
}