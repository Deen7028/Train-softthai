import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ManualStatus } from "@/enum";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const system = formData.get("system")?.toString();
    const status = formData.get("status")?.toString();

    const sql = `
      INSERT INTO system_manuals 
      (sequence_number, manual_name, system_name, is_active, updated_at, created_at) 
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [1, title, system, status === "ACTIVE" ? 1 : 0];

    const [result] = await pool.query(sql, values);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error: unknown) {
    console.error(" DATABASE ERROR:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const sql = "SELECT * FROM system_manuals ORDER BY sequence_number ASC";
    const [rows] = await pool.query(sql);
    const manuals = (rows as unknown[]).map((row) => ({
      id: row.sequence_number.toString(),
      title: row.manual_name,
      system: row.system_name,
      status: row.is_active ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
      updatedAt: new Date(row.updated_at)
    }));
    return NextResponse.json(manuals, { status: 200 });
  } catch (error: unknown) {
    console.error(" DATABASE ERROR:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
