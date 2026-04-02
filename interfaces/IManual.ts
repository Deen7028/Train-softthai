// interfaces/manual.interface.ts
import { ManualStatus } from '@/enum/ManualStatus';

export interface IManual {
  id?: string;                
  title: string;              
  system?: string;       
  videoUrl?: string;          
  documentUrl?: string;       
  status: ManualStatus;       
  createdAt?: Date | string;  
  updatedAt?: Date | string;  
}
