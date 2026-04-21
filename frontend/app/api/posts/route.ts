// app/api/posts/route.ts
export const dynamic = 'force-dynamic'; 

import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
  let db;
  try {
    db = await createConnection();
    const sql = "SELECT * FROM announcements";
    const [posts] = await db.query(sql);
    
    console.log("Fetching from DB, count:", posts.length);

    return NextResponse.json(posts);

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    
  }
}