import React from "react";
import styles from "./styles.module.css";
import { getTranslations } from "next-intl/server";
import { getAboutUs } from "@/app/lib/actions/aboutUs";
import { Metadata } from "next";
import { Locales } from "@/app/lib/schemas";

const BASE_URL = "https://aroxjblog.am";

const ABOUT_TITLES: Record<Locales, string> = {
  am: "Մեր մասին | AroxjBlog",
  en: "About Us | AroxjBlog",
  ru: "О нас | AroxjBlog",
};

const ABOUT_DESCRIPTIONS: Record<Locales, string> = {
  am: "Ծանոթացեք AroxjBlog-ի հետ — Հայաստանի առողջ ապրելակերպի և բժշկության մասին առաջատար կայքի խմբի հետ։",
  en: "Meet the team behind AroxjBlog — Armenia's leading platform for health, lifestyle and medicine content.",
  ru: "Познакомьтесь с командой AroxjBlog — ведущей платформы Армении о здоровье, образе жизни и медицине.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locales }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale in ABOUT_TITLES ? locale : "am";
  const canonical = l === "am" ? `${BASE_URL}/about-us` : `${BASE_URL}/${l}/about-us`;

  return {
    title: ABOUT_TITLES[l],
    description: ABOUT_DESCRIPTIONS[l],
    alternates: {
      canonical,
      languages: {
        hy: `${BASE_URL}/about-us`,
        en: `${BASE_URL}/en/about-us`,
        ru: `${BASE_URL}/ru/about-us`,
        "x-default": `${BASE_URL}/about-us`,
      },
    },
    openGraph: {
      title: ABOUT_TITLES[l],
      description: ABOUT_DESCRIPTIONS[l],
      url: canonical,
      type: "website",
      siteName: "AroxjBlog",
    },
  };
}

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
