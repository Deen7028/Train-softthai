import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const system = formData.get("system")?.toString();
    const status = formData.get("status")?.toString();

    const sql = `
      UPDATE system_manuals 
      SET manual_name = ?, system_name = ?, is_active = ?, updated_at = NOW() 
      WHERE sequence_number = ?
    `;

    const values = [title, system, status === "ACTIVE" ? 1 : 0, parseInt(id)];

    const [result] = await pool.query(sql, values);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: unknown) {
    console.error(" DATABASE ERROR:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const sql = "DELETE FROM system_manuals WHERE sequence_number = ?";

    const [result] = await pool.query(sql, [parseInt(id)]);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: unknown) {
    console.error(" DATABASE ERROR:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
