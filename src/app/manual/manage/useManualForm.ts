"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";
import { IManual } from "@/src/interfaces";
import { ManualStatus } from "@/src/enum";
import { useManualContext } from "../ManualContext";

export const useManualForm = (initialData?: IManual) => {
  const router = useRouter();
  const { manuals, addManual, updateManual } = useManualContext();
  const [id, setId] = useState<string>(initialData?.id || "");
  const [system, setSystem] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSystem(initialData.system || "");
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status === ManualStatus.ACTIVE);
    } else {
      const nextId = manuals ? manuals.length + 1 : 1;
      setId(String(nextId));
    }
  }, [initialData]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDownload = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // src/app/manual/manage/useManualForm.ts

  const handleSubmit = async () => {
    if (!title || !system) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const formData = new FormData();
      if (initialData?.id) formData.append("id", initialData.id);
      formData.append("title", title);
      formData.append("system", system);
      formData.append("description", description);
      formData.append("status", status ? "ACTIVE" : "INACTIVE");
      if (selectedFile) formData.append("file", selectedFile);

      // 1. เพิ่มตัวแปร url เพื่อเช็คว่าเป็นแบบ POST หรือ PUT
      const apiUrl = initialData?.id
        ? `/api/manual/${initialData.id}`
        : "/api/manual";

      // 2. เรียกใช้ fetch ด้วย apiUrl ที่ถูกต้อง
      const response = await fetch(apiUrl, {
        method: initialData?.id ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        // เพิ่มการอ่าน error จาก API เผื่อไว้ดูใน Console ว่า Backend แตกเรื่องอะไร
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", errorData);
        throw new Error("บันทึกลง Database ล้มเหลว");
      }

      alert("บันทึกข้อมูลสำเร็จ!");
      router.push("/manual");
      router.refresh();
    } catch (error) {
      console.error("Submit Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Database");
    }
  };
  
  return {
    state: { system, title, description, status, selectedFile },
    manuals,
    handlers: {
      setSystem: (e: SelectChangeEvent) => setSystem(e.target.value),
      setTitle: (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
      setDescription: (e: ChangeEvent<HTMLInputElement>) =>
        setDescription(e.target.value),
      setStatus: (e: ChangeEvent<HTMLInputElement>) =>
        setStatus(e.target.checked),
      handleFileChange,
      handleDeleteFile: () => setSelectedFile(null),
      handleDownload,
      handleSubmit,
    },
  };
};
