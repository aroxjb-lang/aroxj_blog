import React from "react";
import styles from "./styles.module.css";
import { getTranslations } from "next-intl/server";
import { getAboutUs } from "@/app/lib/actions/aboutUs";
export default async function AboutUs() {
  const t = await getTranslations();
  const data = await getAboutUs();
  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <h3 className={styles.title}>{t("About us")}</h3>
      <p className={styles.description}>{data[0].text}</p>
    </div>
  );
}
