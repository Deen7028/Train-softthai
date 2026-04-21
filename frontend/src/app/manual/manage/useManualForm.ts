// src/app/manual/manage/useManualForm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IManual } from "@/src/interfaces";
import { ManualStatus } from "@/src/enum";

export const useManualForm = (initialData?: IManual) => {
  const router = useRouter();
  const [system, setSystem] = useState(initialData?.systemName || "");
  const [title, setTitle] = useState(initialData?.manualName || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState(
    initialData?.status === ManualStatus.ACTIVE,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdBy, setCreatedBy] = useState<string>(
    initialData?.createdBy?.toString() || "",
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5214/api";

  const handleSubmit = async () => {
    try {
      const isEdit = !!initialData?.id;
      const url = `${apiUrl}/manual`;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("system", system);
      formData.append("status", status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE);

      if (createdBy) {
        formData.append("createdBy", createdBy);
      }

      // ส่ง id ไปด้วย ถ้าเป็นการแก้ไข (backend จะ upsert ตาม id)
      if (isEdit && initialData?.id) {
        formData.append("id", initialData.id.toString());
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("บันทึกข้อมูลสำเร็จ");
        router.push("/manual");
        router.refresh();
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
    state: { system, title, description, status, selectedFile, createdBy },
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
      setCreatedBy: (value: string) => setCreatedBy(value),
    },
  };
};
