"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";
import { IManual } from "@/interfaces";
import { ManualStatus } from "@/enum";

export const useManualForm = (initialData?: IManual) => {
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

  const handleSubmit = () => {
    const payload = {
      system,
      title,
      description,
      status: status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
      file: selectedFile,
    };
    console.log("Submit Payload:", payload);
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
