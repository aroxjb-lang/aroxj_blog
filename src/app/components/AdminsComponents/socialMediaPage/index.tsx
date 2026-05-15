"use client";
import { Button, Dialog, IconButton, TextField } from "@mui/material";
import styles from "./styles.module.css";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import UploadFileInput from "../../UploadFileInput";
import { useSearchParams } from "next/navigation";
import { uploadToVps, deleteFromVps } from "@/app/lib/actions/file";
import {
  creatSocial,
  deleteSocial,
  updateSocial,
} from "@/app/lib/actions/socialMedias";
import { toast } from "react-toastify";

import DeleteModal from "../../DeleteModal";

export default function SocialMediaPage({
  data,
}: {
  data: {
    url: string;
    icon: string;
    _id: string;
  }[];
}) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const pathname = usePathname();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [edit, setEdit] = useState<{
    url: string;
    icon: string;
    _id: string;
  } | null>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState("");

  const handleCancel = () => {
    setFile(null);
    setValue("");
    setEdit(null);
    router.replace(pathname);
  };

  const handleSave = async () => {
    if (query === "add") {
      if (!value || !file)
        return toast.error("please fill all fields", { autoClose: 1000 });

      const fileUrl = await uploadToVps(file);
      const payload = { url: value, icon: fileUrl.pathname };
      await creatSocial(payload);
      toast.success("Created", { autoClose: 1000 });
      setValue("");
      setFile(null);
      setEdit(null)
      router.replace(pathname);
    } else if (!!edit) {
      let newFile = "";
      if (!!file) {
        const uploaded = await uploadToVps(file);
        await deleteFromVps(edit.icon);
        newFile = uploaded.pathname;
      }
      const payload = {
        ...edit,
        icon: newFile,
      };
      await updateSocial(payload._id, { url: payload.url, icon: payload.icon });

      setEdit(null);
      router.replace(pathname);
    }
  };

  return (
    <div className={styles.page}>
      <DeleteModal
        isOpen={!!open}
        onClose={() => setOpen("")}
        onDelete={async () => {
          await deleteSocial(open);
          toast.success("deleted", {
            autoClose: 1000,
          });
          setOpen("");
          router.replace(pathname);
        }}
      />
      <Dialog
        open={!!query || !!edit}
        onClose={handleCancel}
        fullWidth
        keepMounted
      >
        <div className={styles.dialog}>
          <label className={styles.label}>
            Url:
            <TextField
              value={!edit ? value : edit.url}
              required
              error={!value && !!edit && !edit.url}
              onChange={(e) => {
                if (!edit) {
                  setValue(e.target.value);
                } else {
                  setEdit({ ...edit, url: e.target.value });
                }
              }}
            />
          </label>
          <UploadFileInput
            imagePreview={edit ? [edit.icon] : undefined}
            onFilesChange={(file, oldFiles) => {
              if (file.length > 0) {
                setFile(file[0]);
              }
              if (oldFiles.length > 0 && edit) {
                setEdit({ ...edit, icon: oldFiles[0] });
              }
            }}
          />
          <div className={styles.actionsBottom}>
            <Button
              aria-label="save"
              color="primary"
              size="large"
              variant="outlined"
              fullWidth
              onClick={handleCancel}
            >
              {t("Cancel")}
            </Button>
            <Button
              aria-label="save"
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              onClick={handleSave}
              startIcon={<SaveIcon />}
            >
              {t("Save")}
            </Button>
          </div>{" "}
        </div>
      </Dialog>
      <div className={styles.head}>
        <h3 className={styles.title}>{t("Socials Medias")}</h3>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => router.push("?query=add")}
        >
          Add
        </Button>
      </div>

      <div className={styles.body}>
        {data.map((item) => (
          <div className={styles.icon} key={item._id}>
            <div
              onClick={() => {
                setEdit(item);
              }}
            >
              <img src={'/wp-content/'+item.icon} />
            </div>
            <div className={styles.delete}>
              <IconButton
                aria-label="delete"
                color="error"
                size="large"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(item._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
