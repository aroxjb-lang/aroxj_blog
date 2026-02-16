"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { on } from "events";
import { useTranslations } from "next-intl";
import React from "react";
import styles from "./styles.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePost } from "@/app/lib/actions/posts";

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations();
  return (
    <Dialog
    keepMounted
      open={isOpen}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
    >
      <div id="customized-dialog-title" className={styles.dialog}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: "4rem" }} />
        <h3 className={styles.dialogTitle}>
          {t("Are you sure you want to delete this post?")}
        </h3>
        <p className={styles.dialogDescription}>
          {t("This action cannot be undone")}
        </p>
        <div className={styles.dialogActions}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={onClose}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
          >
            {t("Delete")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
