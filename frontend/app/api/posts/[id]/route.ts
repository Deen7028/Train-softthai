// app/api/posts/[id]/route.ts
import { createConnection } from "@/lib/db.js";
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> | any }) {
  // สำหรับ Next.js 15 ต้อง await params
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let db;
  try {
    db = await createConnection();
    
    const sql = `DELETE FROM announcements WHERE id = ?`; 
    
    const [result]: any = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Announcement not found in Database' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    
  }
}