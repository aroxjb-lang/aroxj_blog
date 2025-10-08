import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";

import { BLOB_URL, Locales, PostInterface } from "@/app/lib/schemas";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Card({
  locale,
  post,
}: {
  locale: Locales;
  post: PostInterface;
}) {
  const t = useTranslations();
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image
          src={BLOB_URL + post.featured_media_paths[0]}
          width={300}
          height={200}
          alt="banner"
        />
      </div>
      <div className={styles.textContent}>
        <h3 className={styles.postTitle}>
          {post.title[locale] || post.title["am"]}
        </h3>
        <p className={styles.content}>
          {post.content[locale]?.substring(0, 200) ||
            post.content["am"].substring(0, 200)}
          ...
        </p>
        <p className={styles.views}>
          {post.views} {t("views")}
        </p>

        <Link href={post.slug} prefetch className={styles.link}>
          {t("read more")}
        </Link>
      </div>
    </div>
  );
}
