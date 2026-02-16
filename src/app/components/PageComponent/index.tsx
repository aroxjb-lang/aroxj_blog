import React, { Suspense } from "react";
import { Locales, PostInterface } from "../../lib/schemas";
import styles from "../../[locale]/(main)/page.module.css";
import { useTranslations } from "next-intl";

import Card from "../Card";
import MostViewed from "../MostViewed";
import LoadingCircule from "../LoadingCircule";
import Pagination from "../Pagination";

interface Props {
  data: PostInterface[];
  locale: Locales;
  pagesCount: number;
}

export default function PageComponent({ data, locale, pagesCount }: Props) {
  const t = useTranslations();
  const newData = [...data];
  const heroData = newData.splice(0, 7);

  return (
    <div className={styles.page}>
      <section className={styles.mostSection}>
        <div className={styles.topPost}>
          {/* <h3 className={styles.sectionTitle}> {t("recent posts")}</h3> */}
          <div className={styles.cards}>
            {heroData.map((post) => (
              <div key={post.slug} className={styles.postItem}>
                <Card locale={locale} post={post} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.mostViewWrapper}>
          <Suspense fallback={<LoadingCircule size={"2rem"} />}>
            <MostViewed locale={locale} />
          </Suspense>
        </div>
      </section>

      <section className={styles.section}>
        {/* <h3 className={styles.sectionTitle}> {t("healthy lifestyle")}</h3> */}
        <div className={styles.sectionCards}>
          {newData.map((post) => (
            <div key={post.slug} className={styles.sectionItem}>
              <Card locale={locale} post={post} />
            </div>
          ))}
        </div>
      </section>
      {pagesCount > 1 && (
        <div className={styles.pagination}>
          <Pagination count={pagesCount} />
        </div>
      )}
    </div>
  );
}
