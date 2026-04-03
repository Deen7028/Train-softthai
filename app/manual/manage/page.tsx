import Footer from "@/components/footer/page";
import { ManualForm } from "@/components/manualform/page";
import Navbar from "@/components/navbar/page";

export default function ManageManualPage() {
  return (
    <>
      <Navbar></Navbar>
      <ManualForm />
      <Footer></Footer>
    </>
  );
}