import { ManualTable } from "@/components/manualtable/page";
import { MOCK_MANUALS } from "./mock";

export default function ManualPage() {
  return <ManualTable data={MOCK_MANUALS} />;
}