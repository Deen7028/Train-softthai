"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    if (!apiUrl) {
      setData(initialData);
      return;
    }

      setIsLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error(
            `🚨 API Error! URL: ${apiUrl} | Status: ${response.status}`,
          );
          throw new Error(`Failed to fetch API (Status: ${response.status})`);
        }
        const result = await response.json();

        const mappedData: IManual[] = (result as unknown[]).map((item) => {
          const record = item as Record<string, unknown>;
          const idValue = record.id;
          if (idValue === undefined || idValue === null) {
            console.warn("❌ ไม่มี id จาก API:", record);
          }
          const titleValue =
            record.manualName ?? record.title ?? record.manual_name;
          const systemValue =
            record.systemName ?? record.system ?? record.system_name;
          const statusValue = record.status ?? record.is_active;
          const updatedAtValue =
            record.updatedAt ?? record.updated_at;
          const orderValue = record.sequenceNumber ?? record.order ?? record.sequence_number;
          const creatorNameValue =
            record.creatorName ?? record.creator_name ?? record.creatorname ??
            record.userName ?? record.user_name;

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
          const creatorName =
            typeof creatorNameValue === "string" ? creatorNameValue : "";

          return {
            id,
            manualName: title,
            systemName: system,
            status,
            updatedAt,
            sequenceNumber: order,
            creatorName,
          } as IManual;
        });

        setData(mappedData);
      } catch (error) {
        console.error("Error fetching manual data:", error);
      } finally {
        setIsLoading(false);
      }
    }, [apiUrl, initialData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map((n) => n.id as string);
      setSelectedItems(newSelected);
      return;
    }
    setSelectedItems([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1),
      );
    }

    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูล ${selectedItems.length} รายการ?`)) {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${url}/manual/bulk`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedItems.map(Number)),
        });

        if (response.ok) {
          setSelectedItems([]);
          fetchData(); // Refresh data
        } else {
          console.error("Failed to delete items");
        }
      } catch (error) {
        console.error("Error deleting items:", error);
      }
    }
  };

  // ดึงรายการ "ระบบ" แบบไม่ซ้ำจากข้อมูลที่มีอยู่ เพื่อนำไปแสดงใน Dropdown
  const systemOptions = useMemo(() => {
    const systems = data.map((item) => item.systemName).filter(Boolean) as string[];
    return Array.from(new Set(systems));
  }, [data]);

  // กรองข้อมูลตามเงื่อนไขทั้งหมด
  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      const query = searchQuery.trim().toLowerCase();

      const name = item.manualName?.toLowerCase() || "";

      const matchTitle = !query || name.includes(query);

      const matchSystem = !systemFilter || item.systemName === systemFilter;
      const matchStatus = !statusFilter || item.status === statusFilter;

      return matchTitle && matchSystem && matchStatus;
    });

    return filtered.sort((a, b) => {
      const orderA = a.sequenceNumber ?? 999999;
      const orderB = b.sequenceNumber ?? 999999;
      return orderA - orderB;
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
        sequenceNumber: index + 1,
      }));
      return updatedItems;
    });

    if (updatedItems.length > 0) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        await fetch(`${apiUrl}/manual/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            updatedItems.map((item) => ({
              id: Number(item.id),
              order: item.sequenceNumber,
            })),
          ),
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
    selectedItems,
    handlePageChange,
    handleSelectPage,
    handleSearchChange,
    handleSystemChange,
    handleStatusChange,
    handleResetFilters,
    handleOrderChange,
    handleSelectAllClick,
    handleClick,
    handleDeleteSelected,
  };
};
