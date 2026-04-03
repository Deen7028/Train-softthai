// interfaces/manual.interface.ts
import { ManualStatus } from "@/enum/ManualStatus";

export interface IManual {
  id?: string;
  title: string;
  system?: string;
  description?: string;
  status: ManualStatus;
  order?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
