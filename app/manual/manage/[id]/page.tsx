import { ManualForm } from "@/components/manualform/page";
import { MOCK_MANUALS } from "@/app/manual/mock";
import Navbar from "@/components/navbar/page";
import Footer from "@/components/footer/page";

export default async function EditManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const manual = MOCK_MANUALS.find((item) => String(item.id) === String(id));

  if (!manual) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>ไม่พบข้อมูลคู่มือที่ต้องการแก้ไข (ID: {id})</h3>
      </div>
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <ManualForm initialData={manual} />
      <Footer></Footer>
    </>);
}