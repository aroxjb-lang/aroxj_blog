"use client";

import React from "react";
import { Pagination as PaginationMui } from "@mui/material";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function Pagination({ count }: { count: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pathname = usePathname();

  const handleChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!page) {
      current.delete("page");
    } else {
      current.set("page", page.toString());
    }

    const currentPage = current.toString();
    router.replace(`${pathname}?${currentPage}`, { scroll: false });
  };
  return (
    <PaginationMui
      count={count}
      variant="outlined"
      color="primary"
      page={Number(page)}
      onChange={(_, page) => handleChange(page)}
    />
  );
}
