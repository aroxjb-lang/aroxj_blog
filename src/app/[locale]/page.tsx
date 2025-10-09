import styles from "./page.module.css";
import { getTopPost } from "../lib/actions/posts";
import Hero from "../components/Hero";
import MostViewed from "../components/MostViewed";
import { Suspense } from "react";
import LoadingCircule from "../components/LoadingCircule";
import { Locales } from "../lib/schemas";
import Card from "../components/Card";
import { getTranslations } from "next-intl/server";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locales }>;
}) {
  const t = await getTranslations();
  const { locale } = await params;
  const { data } = await getTopPost({ limit: 11, page: 1 });
  const heroData = data.splice(0, 5);

  return (
    <div className={styles.page}>
      <Hero data={heroData} locale={locale} />
      <section className={styles.mostSection}>
        <div className={styles.topPost}>
          <h3 className={styles.sectionTitle}> {t("recent posts")}</h3>
          <div className={styles.cards}>
            {data.map((post) => (
              <div key={post._id} className={styles.postItem}>
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
      <section className={styles.blogSection}>
        <div className={styles.blogWrapper}>
          <h3 className={styles.sectionTitle}>{t("blog")}</h3>
        </div>
      </section>
    </div>
  );
}
