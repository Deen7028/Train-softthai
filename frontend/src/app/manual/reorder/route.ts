// src/app/api/manual/reorder/route.ts
import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function PUT(request: Request) {
  try {
    const { items } = await request.json();

    for (const item of items) {
      const sql = `
        UPDATE system_manuals 
        SET sequence_number = ? 
        WHERE id = ? 
      `;
      await pool.query(sql, [item.order, parseInt(item.id)]);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("DATABASE ERROR:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
