// src/app/manual/manage/useManualForm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IManual } from "@/src/interfaces";
import { ManualStatus } from "@/src/enum";

export const useManualForm = (initialData?: IManual) => {
  const router = useRouter();
  const [system, setSystem] = useState(initialData?.system || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState(
    initialData?.status === ManualStatus.ACTIVE,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5214/api";

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("system", system);
      formData.append("description", description);
      formData.append(
        "status",
        status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
      );
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const isEdit = !!initialData?.id;
      const url = isEdit
        ? `${apiUrl}/manual/${initialData.id}`
        : `${apiUrl}/manual`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        alert("บันทึกข้อมูลสำเร็จ");
        router.push("/manual");
        router.refresh(); // บังคับให้หน้าตารางโหลดข้อมูลใหม่
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
  };

  return {
    state: { system, title, description, status, selectedFile },
    handlers: {
      setSystem: (value: string) => setSystem(value),
      setTitle: (e: React.ChangeEvent<HTMLInputElement>) =>
        setTitle(e.target.value),
      setDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setDescription(e.target.value),
      setStatus: (e: React.ChangeEvent<HTMLInputElement>) =>
        setStatus(e.target.checked),
      handleFileChange,
      handleDeleteFile,
      handleSubmit,
    },
  };
};
