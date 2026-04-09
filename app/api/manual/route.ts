import { NextResponse } from "next/server";
import pool from "@/lib/db";

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
    return NextResponse.json(rows, { status: 200 });
  } catch (error: unknown) {
    console.error(" DATABASE ERROR:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
