'use client';

import ManualTablePage from "@/components/manualtable/page";
import { useManualContext } from "./ManualContext";
import Navbar from "@/components/navbar/page";
import Footer from "@/components/footer/page";

const columns = [
  { id: 'title', label: 'ชื่อคู่มือ' },
  { id: 'system', label: 'ระบบ' },
  { id: 'status', label: 'สถานะ' },
  { id: 'updatedAt', label: 'ปรับปรุงล่าสุด' },
];

function ManualContent() {
  const { manuals } = useManualContext();
  return <ManualTablePage columns={columns} data={manuals} />;
}

export default function ManualPage() {
  return (<>
    <Navbar></Navbar>
    <ManualContent />
    <Footer></Footer>
  </>);
}