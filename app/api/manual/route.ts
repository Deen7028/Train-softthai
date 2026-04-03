import { NextResponse } from "next/server";

// สำหรับการรับข้อมูล สร้างใหม่ (POST)
export async function POST(request: Request) {
  try {
    // 1. รับข้อมูล FormData ที่ส่งมาจากหน้าบ้าน (Frontend)
    const formData = await request.formData();

    const title = formData.get("title");
    const system = formData.get("system");
    const description = formData.get("description");
    const status = formData.get("status");
    const file = formData.get("file") as File | null;

    console.log("ได้รับข้อมูลสำหรับสร้างใหม่:", {
      title,
      system,
      description,
      status,
    });
    if (file) {
      console.log("ได้รับไฟล์:", file.name, "ขนาด:", file.size, "bytes");
    }

    return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ" }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดทางฝั่งเซิร์ฟเวอร์" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id"); 
    const title = formData.get("title");

    console.log(`ได้รับคำสั่งให้อัปเดตข้อมูล ID: ${id}`);

    return NextResponse.json(
      { message: "อัปเดตข้อมูลสำเร็จ" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
