"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";
import { IManual } from "@/interfaces";
import { ManualStatus } from "@/enum";
import { useManualContext } from "../ManualContext";

export const useManualForm = (initialData?: IManual) => {
  const router = useRouter();
  const { addManual, updateManual } = useManualContext();
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
      setDescription(initialData.system || "");
      setStatus(initialData.status === ManualStatus.ACTIVE);
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

  const handleSubmit = async () => {
    if (!title || !system) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const newManual: IManual = {
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        system,
        title,
        status: status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (initialData?.id) {
        updateManual(initialData.id, newManual);
      } else {
        addManual(newManual);
      }

      alert("บันทึกข้อมูลสำเร็จ!");
      router.push("/manual");
      router.refresh();
    } catch (error) {
      console.error("Submit Error:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  return {
    state: { system, title, description, status, selectedFile },
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
