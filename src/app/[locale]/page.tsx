import styles from "./page.module.css";
import { getTopPost } from "../lib/actions/posts";
import Hero from "../components/Hero";
import MostViewed from "../components/MostViewed";
import { Suspense } from "react";
import LoadingCircule from "../components/LoadingCircule";
import { Locales } from "../lib/schemas";
import Card from "../components/Card";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locales }>;
}) {
  const { locale } = await params;
  const { data } = await getTopPost({ limit: 11, page: 1 });
  const heroData = data.splice(0, 5);

  return (
    <div className={styles.page}>
      <Hero data={heroData} locale={locale} />
      <section className={styles.mostSection}>
        <div className={styles.topPost}>
          {data.map((post) => (
            <div key={post._id} className={styles.postItem}>
              <Card locale={locale} post={post} />
            </div>
          ))}
        </div>
        <div className={styles.mostViewWrapper}>
          <Suspense fallback={<LoadingCircule size={"2rem"} />}>
            <MostViewed locale={locale} />
          </Suspense>
        </div>
      </section>
      <section></section>
    </div>
  );
}
