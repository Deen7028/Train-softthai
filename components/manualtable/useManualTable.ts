"use client";

import { useState, useMemo, useEffect } from "react";
import { IManual } from "@/interfaces";
import { SelectChangeEvent } from "@mui/material";

export const useManualTable = (
  apiUrl?: string,
  initialData: IManual[] = [],
) => {
  const [data, setData] = useState<IManual[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [searchQuery, setSearchQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!apiUrl) {
      setData(initialData);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch API");

        const result = await response.json();

        const mappedData: IManual[] = result.map((item: unknown) => ({
          id: String((item as { id: string }).id),
          title: (item as { manual_name: string }).manual_name,
          system: (item as { system_name: string }).system_name,
          status:
            (item as { is_active: number }).is_active === 1
              ? "ACTIVE"
              : "INACTIVE",
          updatedAt: new Date((item as { updated_at: string }).updated_at),
          order: (item as { sequence_number: number }).sequence_number,
        }));

        setData(mappedData);
      } catch (error) {
        console.error("Error fetching manual data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, initialData]);

  // ดึงรายการ "ระบบ" แบบไม่ซ้ำจากข้อมูลที่มีอยู่ เพื่อนำไปแสดงใน Dropdown
  const systemOptions = useMemo(() => {
    const systems = data.map((item) => item.system).filter(Boolean) as string[];
    return Array.from(new Set(systems));
  }, [data]);

  // กรองข้อมูลตามเงื่อนไขทั้งหมด
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.trim().toLowerCase();

      const title = item.title?.toLowerCase() || "";

      const matchTitle = !query || title.includes(query);

      const matchSystem = !systemFilter || item.system === systemFilter;
      const matchStatus = !statusFilter || item.status === statusFilter;

      return matchTitle && matchSystem && matchStatus;
    });
  }, [data, searchQuery, systemFilter, statusFilter]);

  const count = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const totalItems = filteredData.length;

  const handleOrderChange = (id: string | undefined, newOrder: number) => {
    if (!id) return;
    setData((prevData) => {
      const existing = prevData.find((item) => item.id === id);
      if (!existing) return prevData;

      const rest = prevData.filter((item) => item.id !== id);
      const targetIndex = Math.max(0, Math.min(newOrder - 1, rest.length));

      const updated = [
        ...rest.slice(0, targetIndex),
        existing,
        ...rest.slice(targetIndex),
      ];

      // set order field จาก index ใหม่ (ไม่บังคับ แต่ช่วยให้ value แสดงถูกต้อง)
      return updated.map((item, index) => ({ ...item, order: index + 1 }));
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  const handleSelectPage = (event: SelectChangeEvent<number>) =>
    setPage(Number(event.target.value));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  const handleSystemChange = (event: SelectChangeEvent<string>) => {
    setSystemFilter(event.target.value);
    setPage(1);
  };
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSystemFilter("");
    setStatusFilter("");
    setPage(1);
  };

  return {
    page,
    count,
    paginatedData,
    totalItems,
    searchQuery,
    systemFilter,
    statusFilter,
    systemOptions,
    isLoading,
    handlePageChange,
    handleSelectPage,
    handleSearchChange,
    handleSystemChange,
    handleStatusChange,
    handleResetFilters,
    handleOrderChange,
  };
};
