"use client";

import React, { ChangeEvent, useState } from "react";
import styles from "./styles.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Locales, PostInterface } from "@/app/lib/schemas";
import Card from "@/app/components/Card";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import { Dialog, InputAdornment, TextField } from "@mui/material";
import { deletePost } from "@/app/lib/actions/posts";
import Pagination from "../../Pagination";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import cls from "classnames";
import Categorys from "../../CategoriesSelect";
import DeleteModal from "../../DeleteModal";
export default function PostsPage({
  locale,
  data,
  pagesCount,
}: {
  locale: Locales;
  data: PostInterface[];
  pagesCount: number;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "desc";
  const categoryValue = searchParams.get("category") || "";
  const router = useRouter();
  const pathname = usePathname();
  const handleSearch = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    const search = current.toString();
    router.replace(`${pathname}?${search}`, { scroll: false });
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h3 className={styles.title}>{t("Posts")}</h3>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/addPost")}
        >
          Add
        </Button>
      </div>
      <span className={styles.divider} />
      <div className={styles.filterSection}>
        <TextField
          onChange={(e) => handleSearch("search", e.target.value)}
          placeholder="..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <div className={styles.sortCategory}>
          <div className={styles.sortLabel}>
            Sort by{" "}
            <div
              className={cls(styles.sort, {
                [styles.active]: sort === "asc",
              })}
              onClick={() => {
                handleSearch("sort", sort === "desc" ? "asc" : "desc");
              }}
            >
              <ArrowDropDownIcon sx={{ fontSize: "2rem" }} />
            </div>
          </div>

          <Categorys
            onChange={(cat) => handleSearch("category", cat)}
            category={categoryValue}
          />
        </div>
      </div>
      <div className={styles.body}>
        {data.map((post) => (
          <div className={styles.card} key={post.slug}>
            <DeleteModal
              isOpen={open === post.slug}
              onClose={() => setOpen(null)}
              onDelete={async () => {
                await deletePost(post.slug);
                window.location.reload();
              }}
            />
            <div className={styles.deleteIcon}>
              <IconButton
                aria-label="delete"
                color="error"
                size="large"
                onClick={() => setOpen(post.slug)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <Card locale={locale} post={post} />
          </div>
        ))}
      </div>
      {pagesCount > 1 && (
        <div className={styles.pagination}>
          <Pagination count={pagesCount} />
        </div>
      )}
    </div>
  );
}
