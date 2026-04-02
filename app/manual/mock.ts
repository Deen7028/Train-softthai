import { IManual } from "@/interfaces";
import { ManualStatus } from "@/enum";

export const MOCK_MANUALS: IManual[] = [
  {
    id: "1",
    title: "คู่มือการใช้งานเมนูการปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    system: "การปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    status: ManualStatus.ACTIVE,
    updatedAt: "13/02/2569 13:00",
  },
  {
    id: "2",
    title: "คู่มือการใช้งานเมนูการปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    system: "การปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    status: ManualStatus.ACTIVE,
    updatedAt: "19/02/2569 13:00",
  },
  {
    id: "3",
    title: "คู่มือการใช้งานเมนูการปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    system: "การปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    status: ManualStatus.INACTIVE,
    updatedAt: "30/02/2569 13:00",
  },
  {
    id: "4",
    title: "คู่มือการใช้งานเมนูการปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    system: "การปฏิบัติงานด้านความปลอดภัย/หยุดงานชั่วคราว",
    status: ManualStatus.INACTIVE,
    updatedAt: "31/02/2569 13:00",
  },
];
