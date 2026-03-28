"use client";

import { Categories, Locales, PostInterface } from "@/app/lib/schemas";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../../DeleteModal";
import {
  createPost,
  deletePost,
  updatePostByID,
} from "@/app/lib/actions/posts";
import { useParams } from "next/navigation";
import Button from "@mui/material/Button";
import UploadFileInput from "../../UploadFileInput";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { YouTubeEmbed } from "@next/third-parties/google";
import CategoriesSelect from "../../CategoriesSelect";
import { deleteFromBlob, uploadToBlob } from "@/app/lib/actions/file";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import TextEditor from "../../TextEditor";

export default function CreateUpdatePost({
  data,
  locale,
  isAdd,
}: {
  locale: Locales;
  isAdd: boolean;
  data: Omit<
    PostInterface,
    "_id" | "date" | "suggested_blob_paths" | "createdAt" | "updatedAt"
  >;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const { slug } = useParams();
  const router = useRouter();
  const [hashtags, setHashtags] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [am, setAm] = useState("");
  const [ru, setRu] = useState("");
  const [en, setEn] = useState("");
  const [values, setValues] = useState<
    Omit<
      PostInterface,
      "_id" | "date" | "suggested_blob_paths" | "createdAt" | "updatedAt"
    >
  >({
    ...structuredClone(data),
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleCancel = () => {
    setValues(structuredClone(data));
  };

  const handleDelete = () => {
    setOpen(true);
  };

  const handleSave = async () => {
    if (isAdd) {
      if (!values.title.am || !values.slug) return;
      let newFiles: string[] = [];
      if (files.length > 0) {
        const uploaded = await Promise.all(files.map((f) => uploadToBlob(f)));
        newFiles = [...newFiles, ...uploaded.map((u) => u.pathname)];
      }

      const payload = {
        ...values,
        date: `${new Date()}`,
        video_url: values.video_url,
        featured_media_paths: newFiles,
      };
      createPost(payload)
        .then((res) => {
          toast.success("Saved", {
            position: "top-right",
            autoClose: 1000,
          });
          router.push(`/admin/${res.slug}`);
        })
        .catch((err) => {
          toast.error("Error updating post", {
            position: "top-right",
            autoClose: 1000,
          });
        });
    } else {
      let newFiles = [...values.featured_media_paths];
      if (files.length > 0) {
        const uploaded = await Promise.all(files.map((f) => uploadToBlob(f)));
        newFiles = [...newFiles, ...uploaded.map((u) => u.pathname)];
      }
      const deletedFiles = data.featured_media_paths.filter(
        (path) => !newFiles.includes(path),
      );
      if (deletedFiles.length > 0) {
        await Promise.all(deletedFiles.map((url) => deleteFromBlob(url)));
      }

      const payload = {
        ...values,
        content: {
          am,
          en,
          ru,
        },
        video_url: values.video_url,
        featured_media_paths: newFiles,
      };
      updatePostByID(decodeURIComponent(slug as string), payload)
        .then((res) => {
          toast.success("Saved", {
            position: "top-right",
            autoClose: 1000,
          });
          router.push(`/admin/${res.slug}`);
        })
        .catch((err) => {
          toast.error("Error updating post", {
            position: "top-right",
            autoClose: 1000,
          });
        });
    }
  };
  return (
    <div className={styles.page}>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={async () => {
          if (!slug) return;
          await deletePost(decodeURIComponent(slug as string));
          toast.success("Deleted", {
            position: "top-right",
            autoClose: 1000,
          });
          router.push("/admin/posts");
        }}
      />
      <div className={styles.header}>
        <h3 className={styles.title}>
          {isAdd
            ? t("Add post")
            : !data.title[locale]
              ? data.title["am"]
              : data.title[locale]}
        </h3>
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
          {!isAdd && (
            <>
              <Button
                aria-label="delete"
                color="error"
                size="large"
                variant="contained"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
              >
                {t("Delete")}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className={styles.medias}>
        <div className={styles.images}>
          <h4 className={styles.subTitle}>{t("Images")} (max: 5)</h4>
          <UploadFileInput
            imagePreview={values.featured_media_paths}
            accept="image/*"
            multiple
            maxFiles={5}
            maxSizeMB={15}
            onFilesChange={(files, oldFiles) => {
              if (oldFiles.length !== 0) {
                setValues({ ...values, featured_media_paths: [...oldFiles] });
              }
              if (files.length !== 0) setFiles(files);
            }}
          />
        </div>
        <div className={styles.video}>
          <h4 className={styles.subTitle}>{t("Video url")} </h4>
          <TextField
            value={values.video_url ?? ""}
            onChange={handleChange}
            className={styles.videoinput}
            fullWidth
            name="video_url"
          />

          {values.video_url &&
            values.video_url !== "" &&
            values.video_url[0] !== "" && (
              <div className={styles.videoContainer}>
                <YouTubeEmbed videoid={values.video_url} />
              </div>
            )}
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.subTitle}>{t("Post details")} </h4>
        <label className={styles.inputContainer}>
          <p className={styles.label}>{t("Title")}:</p>
          <div className={styles.multilangualInputs}>
            <TextField
              fullWidth
              label="am"
              required
              error={!values.title.am}
              helperText={
                !values.title.am ? t("Title in Armenian is required") : ""
              }
              value={values.title.am}
              onChange={(e) => {
                setValues({
                  ...values,
                  title: { ...values.title, am: e.target.value },
                });
              }}
            />
            <TextField
              fullWidth
              label="en"
              value={values.title.en}
              onChange={(e) => {
                setValues({
                  ...values,
                  title: { ...values.title, en: e.target.value },
                });
              }}
            />
            <TextField
              fullWidth
              label="ru"
              value={values.title.ru}
              onChange={(e) => {
                setValues({
                  ...values,
                  title: { ...values.title, ru: e.target.value },
                });
              }}
            />
          </div>
        </label>
        <label className={styles.inputContainer}>
          <p className={styles.label}>{t("Content")}:</p>
          {/* <p dangerouslySetInnerHTML={{ __html: am }} /> */}
          <div className={styles.multilangualInputsColumn}>
            <p className={styles.label}>AM:</p>

            <TextEditor
              value={values.content.am}
              onChange={(html) => {
                setAm(html);
              }}
            />
            <p className={styles.label}>RU:</p>

            <TextEditor
              value={values.content.ru}
              onChange={(html) => {
                setRu(html);
              }}
            />
            <p className={styles.label}>EN:</p>

            <TextEditor
              value={values.content.en}
              onChange={(html) => {
                setEn(html);
              }}
            />
            {/* <TextField
              fullWidth
              label="am"
              value={}
              minRows={3}
              maxRows={15}
              multiline
              onChange={(e) => {
                setValues({
                  ...values,
                  content: { ...values.content, am: e.target.value },
                });
              }}
            /> */}
            {/* <TextField
              fullWidth
              label="en"
              value={values.content.en}
              minRows={3}
              maxRows={15}
              multiline
              onChange={(e) => {
                setValues({
                  ...values,
                  content: { ...values.content, en: e.target.value },
                });
              }}
            />
            <TextField
              fullWidth
              label="ru"
              value={values.content.ru}
              minRows={3}
              maxRows={15}
              multiline
              onChange={(e) => {
                setValues({
                  ...values,
                  content: { ...values.content, ru: e.target.value },
                });
              }}
            /> */}
          </div>
        </label>
        <div className={styles.multilangualInputs}>
          <label className={styles.inputContainer}>
            <p className={styles.label}>{t("Slug")}:</p>

            <TextField
              fullWidth
              required
              error={!values.slug}
              helperText={
                !values.slug
                  ? t("Slug is required")
                  : t("Unique identifier for the post, used in the URL")
              }
              value={values.slug}
              onChange={(e) => {
                setValues({
                  ...values,
                  slug: e.target.value,
                });
              }}
            />
          </label>
          <label className={styles.inputContainer}>
            <p className={styles.label}>{t("Views")}:</p>
            <TextField
              fullWidth
              type="number"
              value={values.views}
              onChange={(e) => {
                setValues({
                  ...values,
                  views: +e.target.value,
                });
              }}
              sx={{
                "& input[type=number]": {
                  MozAppearance: "textfield", // Firefox
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
          </label>
          <label className={styles.inputContainer}>
            <p className={styles.label}>{t("Category")}:</p>
            <CategoriesSelect
              category={values.category}
              onChange={(cat) => setValues({ ...values, category: cat })}
            />
          </label>
        </div>
        <label className={styles.inputContainer}>
          <p className={styles.label}>{t("Hashtags")}:</p>
          <div className={styles.multilangualInputs}>
            <TextField
              fullWidth
              value={hashtags}
              onChange={(e) => {
                setHashtags(e.target.value);
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                if (!!hashtags) {
                  setValues({
                    ...values,
                    hashtags: [...values.hashtags, hashtags],
                  });
                  setHashtags("");
                }
              }}
            >
              {t("ADD")}
            </Button>
          </div>
          {values.hashtags.length > 0 && (
            <div className={styles.hashtags}>
              {values.hashtags.map((h) => (
                <div className={styles.tag} key={h}>
                  {h}
                  <IconButton
                    onClick={() => {
                      setValues({
                        ...values,
                        hashtags: values.hashtags.filter((item) => item !== h),
                      });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </label>
      </div>
      <div className={styles.actionsBottom}>
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
        {!isAdd && (
          <>
            <Button
              aria-label="delete"
              color="error"
              size="large"
              variant="contained"
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
            >
              {t("Delete")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
