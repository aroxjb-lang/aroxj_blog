import { getMostViewedPost } from "@/app/lib/actions/posts";
import { getTranslations } from "next-intl/server";
import React from "react";
import styles from "./styles.module.css";
import { Locales } from "@/app/lib/schemas";
import { Link } from "@/i18n/navigation";

export default async function MostViewed({ locale }: { locale: Locales }) {
  const t = await getTranslations();
  const { data } = await getMostViewedPost({ limit: 15, page: 1 });

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{t("most viewed")}</h3>
      <div className={styles.mostViewedList}>
        {data.map((post) => (
          <div key={post._id} className={styles.postItem}>
            <h5 className={styles.postTitle}>
              {post.title[locale] || post.title["am"]}
            </h5>
            <p className={styles.content}>
              {post.content[locale] || post.content["am"]}
            </p>
            <p className={styles.views}>
              {post.views} {t("views")}
            </p>

            <Link href={post.slug} prefetch className={styles.link}>
              {t("read more")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
