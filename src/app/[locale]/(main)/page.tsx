import styles from "./page.module.css";
import { getTopPost } from "../../lib/actions/posts";
import Hero from "../../components/Hero";
import MostViewed from "../../components/MostViewed";
import { Suspense } from "react";
import LoadingCircule from "../../components/LoadingCircule";
import { Categories, Locales } from "../../lib/schemas";
import Card from "../../components/Card";
import { getTranslations } from "next-intl/server";
import BlogSlider from "../../components/BlogSlider";
import { signup } from "../../lib/actions/auth";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locales }>;
}) {
  const t = await getTranslations();
  const { locale } = await params;
  const { data } = await getTopPost({ limit: 12, page: 1 });
  const [medInfoData, beautyData, diseasesData, entertainmentData] =
    await Promise.all([
      getTopPost({ limit: 10, category: Categories.PROGRAM }),
      getTopPost({ limit: 10, category: Categories.BEAUTY }),
      getTopPost({ limit: 10, category: Categories.DISEASES }),
      getTopPost({ limit: 10, category: Categories.ANNOUNCEMENT }),
    ]);

  const heroData = data.splice(0, 5);
  return (
    <div className={styles.page}>
      <Hero data={structuredClone(heroData)} locale={locale} />
      <section className={styles.mostSection}>
        <div className={styles.topPost}>
          <h3 className={styles.sectionTitle}> {t("recent posts")}</h3>
          <div className={styles.cards}>
            {data.map((post) => (
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
      <section className={styles.blogSection}>
        <div className={styles.blogWrapper}>
          <h3 className={styles.sectionTitle}>{t("med info")}</h3>
          <BlogSlider
            data={structuredClone(medInfoData.data)}
            locale={locale}
          />
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}> {t("healthy lifestyle")}</h3>
        <div className={styles.sectionCards}>
          {beautyData.data.map((post) => (
            <div key={post.slug} className={styles.sectionItem}>
              <Card locale={locale} post={post} />
            </div>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}> {t("diseases")}</h3>
        <div className={styles.sectionCards}>
          {diseasesData.data.map((post) => (
            <div key={post.slug} className={styles.sectionItem}>
              <Card locale={locale} post={post} />
            </div>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}> {t("entertainment")}</h3>
        <div className={styles.sectionCards}>
          {entertainmentData.data.map((post) => (
            <div key={post.slug} className={styles.sectionItem}>
              <Card locale={locale} post={post} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
