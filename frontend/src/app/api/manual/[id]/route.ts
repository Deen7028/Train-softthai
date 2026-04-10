import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const system = formData.get("system")?.toString();
    const status = formData.get("status")?.toString();

    const sql = `
      UPDATE system_manuals 
      SET manual_name = ?, system_name = ?, is_active = ?, updated_at = NOW() 
      WHERE sequence_number = ?
    `;

    const values = [
      title,
      system,
      status === "ACTIVE" ? 1 : 0,
      parseInt(id, 10),
    ];
    const [result] = await pool.query(sql, values);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("PUT API ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const sql = "DELETE FROM system_manuals WHERE sequence_number = ?";
    const [result] = await pool.query(sql, [parseInt(id, 10)]);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("DELETE API ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
