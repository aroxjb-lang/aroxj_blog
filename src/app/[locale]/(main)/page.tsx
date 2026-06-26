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
  const [medInfoData, beauty,bodyCare,healtyFood, diseases,psychology,interviews,childCare,medicineOfFuture,announcement, cuture,sport,travel,recipe] =
    await Promise.all([
      getTopPost({ limit: 10, category: Categories.PROGRAM }),
      getTopPost({ limit: 10, category: Categories.BEAUTY }),
      getTopPost({ limit: 10, category: Categories.BODY_CARE }),
      getTopPost({ limit: 10, category: Categories.HEALTY_FOOD }),
      getTopPost({ limit: 10, category: Categories.DISEASES }),
      getTopPost({ limit: 10, category: Categories.PSYCHOLOGY }),
      getTopPost({ limit: 10, category: Categories.INTERVIEWS }),
      getTopPost({ limit: 10, category: Categories.CHILD_CARE }),
      getTopPost({ limit: 10, category: Categories.MEDICINE_OF_THE_FUTURE }),
      getTopPost({ limit: 10, category: Categories.ANNOUNCEMENT }),
      getTopPost({ limit: 10, category: Categories.CULTURE }),
      getTopPost({ limit: 10, category: Categories.SPORT }),
      getTopPost({ limit: 10, category: Categories.TRAVEL_NEWS }),
      getTopPost({ limit: 10, category: Categories.RECIPE }),

    ]);
  const beautyData=[...beauty.data,...bodyCare.data,...healtyFood.data].sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,10)
  const diseasesData=[...diseases.data,...psychology.data,...interviews.data,...childCare.data,...medicineOfFuture.data].sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime()).slice(0,10)
  const entertainmentData=[...announcement.data, ...cuture.data,...sport.data,...travel.data,...recipe.data].sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime()).slice(0,10)

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
         <BlogSlider
            data={structuredClone(beautyData)}
            locale={locale}
          />
        {/* <div className={styles.sectionCards}>

          {beautyData.data.map((post) => (
            <div key={post.slug} className={styles.sectionItem}>
              <Card locale={locale} post={post} />
            </div>
          ))}
        </div> */}
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}> {t("diseases")}</h3>
        <BlogSlider
            data={structuredClone(diseasesData)}
            locale={locale}
          />
       
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}> {t("entertainment")}</h3>
        <BlogSlider
            data={structuredClone(entertainmentData)}
            locale={locale}
          />
        
      </section>
    </div>
  );
}
