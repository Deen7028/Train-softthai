// interfaces/manual.interface.ts

import { ManualStatus } from "../enum";

export interface IManual {
  id?: string;
  manualName: string;
  systemName?: string;
  status: ManualStatus;
  sequenceNumber?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: number;
  creatorName?: string;
}
