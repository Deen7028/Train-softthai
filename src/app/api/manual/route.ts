import { NextResponse } from "next/server";
import pool from "@/src/lib/db";
import { ManualStatus } from "@/src/enum";

// กำหนด Type ให้กับข้อมูลที่ดึงมาจากฐานข้อมูล (ไม่ต้องใช้ any)
interface SystemManualRow {
  sequence_number: number;
  manual_name: string;
  system_name: string;
  is_active: number;
  updated_at: string | Date;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const system = formData.get("system")?.toString();
    const status = formData.get("status")?.toString();

    // หาเลขลำดับ (sequence_number) ล่าสุด เพื่อไม่ให้ซ้ำกับของเดิม
    const [maxResult] = await pool.query(
      "SELECT MAX(sequence_number) as maxSeq FROM system_manuals",
    );

    // กำหนด Type แทน any[]
    const maxRows = maxResult as { maxSeq: number | null }[];
    const nextSeq = (maxRows[0]?.maxSeq || 0) + 1;

    const sql = `
      INSERT INTO system_manuals 
      (sequence_number, manual_name, system_name, is_active, updated_at, created_at) 
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [nextSeq, title, system, status === "ACTIVE" ? 1 : 0];
    const [result] = await pool.query(sql, values);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error: unknown) {
    // ใช้ unknown และดึง message ออกมาอย่างปลอดภัย
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("POST API ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const sql = "SELECT * FROM system_manuals ORDER BY sequence_number ASC";
    const [rows] = await pool.query(sql);

    // ใช้ Type SystemManualRow[] แทน any[]
    const manuals = (rows as SystemManualRow[]).map((row) => ({
      id: row.sequence_number.toString(),
      title: row.manual_name,
      system: row.system_name,
      status: row.is_active ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
      updatedAt: new Date(row.updated_at),
    }));

    return NextResponse.json(manuals, { status: 200 });
  } catch (error: unknown) {
    // ดึง message ออกมาอย่างปลอดภัย
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("DATABASE ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
