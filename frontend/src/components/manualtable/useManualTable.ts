"use client";

import { useState, useMemo, useEffect } from "react";
import { IManual } from "@/src/interfaces";
import { SelectChangeEvent } from "@mui/material";

export const useManualTable = (
  apiUrl?: string,
  initialData: IManual[] = [],
) => {
  const [data, setData] = useState<IManual[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

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

        const mappedData: IManual[] = (result as unknown[]).map((item) => {
          const record = item as Record<string, unknown>;
          const idValue = record.id ?? record.sequence_number;
          const titleValue =
            record.title ?? record.manual_name ?? record.manualName;
          const systemValue =
            record.system ?? record.system_name ?? record.systemName;
          const statusValue = record.status ?? record.is_active;
          const updatedAtValue =
            record.updatedAt ?? record.updated_at ?? record.updated_at_at;
          const orderValue = record.order ?? record.sequence_number;

          const id =
            typeof idValue === "number"
              ? idValue.toString()
              : typeof idValue === "string"
                ? idValue
                : "";
          const title = typeof titleValue === "string" ? titleValue : "";
          const system = typeof systemValue === "string" ? systemValue : "";
          const status =
            typeof statusValue === "number"
              ? statusValue === 1
                ? "ใช้งาน"
                : "ไม่ใช้งาน"
              : typeof statusValue === "string"
                ? statusValue
                : "ไม่ใช้งาน";
          const updatedAt =
            typeof updatedAtValue === "string" ||
            typeof updatedAtValue === "number"
              ? new Date(updatedAtValue)
              : undefined;
          const order = orderValue != null ? Number(orderValue) : undefined;

          return {
            id,
            title,
            system,
            status,
            updatedAt,
            order,
          } as IManual;
        });

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

  const handleOrderChange = async (
    id: string | undefined,
    newOrder: number,
  ) => {
    if (!id) return;

    let updatedItems: IManual[] = [];

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

      updatedItems = updated.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      return updatedItems;
    });

    // เพิ่มส่วนของการเรียก API เพื่อไปแก้ไข order ในฐานข้อมูลจริง
    if (updatedItems.length > 0) {
      try {
        await fetch("http://localhost:5214/api/manual/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: updatedItems.map((item) => ({
              id: item.id,
              order: item.order,
            })),
          }),
        });
      } catch (error) {
        console.error("Failed to update order in database:", error);
      }
    }
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
