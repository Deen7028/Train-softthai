"use client";

import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { IManual } from "@/interfaces";

export const useManualTable = (data: IManual[], rowsPerPage: number = 8) => {
  const [page, setPage] = useState(1);

  const count = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectPage = (event: SelectChangeEvent<number>) => {
    setPage(event.target.value);
  };

  return {
    page,
    count,
    paginatedData,
    handlePageChange,
    handleSelectPage,
  };
};
