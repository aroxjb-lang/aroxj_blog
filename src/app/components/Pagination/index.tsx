"use client";

import React from "react";
import { Pagination as PaginationMui } from "@mui/material";
import { useRouter } from "@/i18n/navigation";

export default function Pagination({ count }: { count: number }) {
  const router = useRouter();

  return (
    <PaginationMui
      count={count}
      variant="outlined"
      color="primary"
      onChange={(_, page) => router.push(`?page=${page}`)}
    />
  );
}
