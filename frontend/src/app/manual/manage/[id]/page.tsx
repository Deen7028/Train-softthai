import { ManualForm } from "@/src/components/manualform/page";


export default async function EditManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5124/api';
  const manual = await fetch(`${apiUrl}/manual/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("ไม่พบข้อมูล");
      return res.json();
    })
    .catch(() => null);

  if (!manual) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>ไม่พบข้อมูลคู่มือที่ต้องการแก้ไข (ID: {id})</h3>
      </div>
    );
  }

  return (
    <>
      <ManualForm initialData={manual} />
    </>);
}