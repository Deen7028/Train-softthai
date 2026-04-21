'use client';

import { ManualTablePage } from "@/src/components";
import { useManualContext } from "./ManualContext";

const columns = [
  { id: 'title', label: 'ชื่อคู่มือ' },
  { id: 'system', label: 'ระบบ' },
  { id: 'status', label: 'สถานะ' },
  { id: 'updatedAt', label: 'ปรับปรุงล่าสุด' },
  { id: 'creatorName', label: 'ผู้สร้าง' },
];

export default function ManualPage() {
  const { manuals } = useManualContext();

  return (
    <>
      <ManualTablePage
        columns={columns}
        data={manuals}
      />
    </>
  );
}