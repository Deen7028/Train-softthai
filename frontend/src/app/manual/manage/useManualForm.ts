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
  const [createdBy, setCreatedBy] = useState<string>(
    initialData?.createdBy?.toString() || "",
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5214/api";

  const handleSubmit = async () => {
    try {
      const isEdit = !!initialData?.id;
      const url = isEdit
        ? `${apiUrl}/manual/${initialData.id}`
        : `${apiUrl}/manual`;

      let response;

      if (isEdit) {
        const payload: {
          title: string;
          system: string;
          status: string;
          createdBy?: number;
        } = {
          title,
          system,
          status: status ? "ACTIVE" : "INACTIVE",
        };

        if (createdBy) {
          payload.createdBy = Number(createdBy);
        }

        response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("system", system);
        formData.append("description", description);
        formData.append(
          "status",
          status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
        );

        if (createdBy) {
          formData.append("createdBy", createdBy);
        }

        if (selectedFile) {
          formData.append("file", selectedFile);
        }

        response = await fetch(url, {
          method: "POST",
          body: formData,
        });
      }

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
