'use client';

import { ManualTablePage } from "@/src/components";
import Navbar from "@/src/components/navbar/page";


const columns = [
  { id: 'title', label: 'ชื่อคู่มือ' },
  { id: 'system', label: 'ระบบ' },
  { id: 'status', label: 'สถานะ' },
  { id: 'updatedAt', label: 'ปรับปรุงล่าสุด' },
];



export default function ManualPage() {
  return (
    <>
      <Navbar />
      <ManualTablePage
        columns={columns}
        data={[]}
        apiUrl="/api/manual"
      />
    </>
  );
}