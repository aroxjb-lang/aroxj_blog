import { getMostViewedPost } from "@/app/lib/actions/posts";
import { getTranslations } from "next-intl/server";
import React from "react";
import styles from "./styles.module.css";
import { BLOB_URL, Locales } from "@/app/lib/schemas";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default async function MostViewed({ locale }: { locale: Locales }) {
  const t = await getTranslations();
  const { data } = await getMostViewedPost({ limit: 15, page: 1 });

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{t("most viewed")}</h3>
      <div className={styles.mostViewedList}>
        {data.map((post) => (
          <Link
            href={post.slug}
            prefetch
            key={post._id}
          >
            <div className={styles.itemWrapper}>
              <Image
                src={BLOB_URL + post.featured_media_paths[0]}
                width={300}
                height={200}
                alt="banner"
                className={styles.banner}
              />
              <div className={styles.postItem}>
                <h5 className={styles.postTitle}>
                  {post.title[locale] || post.title["am"]}
                </h5>
                <p className={styles.content}>
                  {post.content[locale] || post.content["am"]}
                </p>
                <p className={styles.views}>
                  {post.views} {t("views")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
