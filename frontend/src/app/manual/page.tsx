'use client';

import { ManualTablePage } from "@/src/components";

const emptyData: unknown[] = [];
const columns = [
  { id: 'title', label: 'ชื่อคู่มือ' },
  { id: 'system', label: 'ระบบ' },
  { id: 'status', label: 'สถานะ' },
  { id: 'updatedAt', label: 'ปรับปรุงล่าสุด' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5124/api';

export default function ManualPage() {
  return (
    <>
      <ManualTablePage
        columns={columns}
        data={emptyData}
        apiUrl={`${apiUrl}/manual`}
      />
    </>
  );
}