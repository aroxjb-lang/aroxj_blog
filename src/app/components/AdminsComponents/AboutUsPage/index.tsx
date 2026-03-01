"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import {  updateAboutUs } from "@/app/lib/actions/aboutUs";
import { toast } from "react-toastify";

export default function AboutUsPage({
  data,
}: {
  data: {
    text: string;
    _id: string;
  }[];
}) {
  const t = useTranslations();
  const [values, setValues] = useState(data[0].text);
  const handleCancel = () => {
    setValues(data[0].text);
  };
  const handleSave = async () => {
    try {
      await updateAboutUs(data[0]._id, values);
      toast.success("Changed", {
        autoClose: 1000,
      });
    } catch (er) {
      toast.error("Something was wrong", {
        autoClose: 1000,
      });
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("About us")}</h3>
        <div className={styles.actions}>
          <Button
            aria-label="save"
            color="primary"
            size="large"
            variant="outlined"
            onClick={handleCancel}
          >
            {t("Cancel")}
          </Button>
          <Button
            aria-label="save"
            color="primary"
            size="large"
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            {t("Save")}
          </Button>
        </div>
      </div>
      <div className={styles.body}>
        <TextField
          fullWidth
          value={values}
          minRows={15}
          maxRows={35}
          multiline
          onChange={(e) => {
            setValues(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
