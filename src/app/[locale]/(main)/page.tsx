import styles from "./page.module.css";
import {getPosts, getTopPost} from '../../lib/actions/posts';
import Hero from "../../components/Hero";
import MostViewed from "../../components/MostViewed";
import { Suspense } from "react";
import LoadingCircule from "../../components/LoadingCircule";
import { Categories, Locales } from "../../lib/schemas";
import Card from "../../components/Card";
import { getTranslations } from "next-intl/server";
import BlogSlider from "../../components/BlogSlider";
import { signup } from "../../lib/actions/auth";
import { Metadata } from "next";

const BASE_URL = "https://aroxjblog.am";

const HOME_TITLES: Record<Locales, string> = {
  am: "AroxjBlog — Առողջ ապրելակերպ, բժշկություն և գեղեցկություն",
  en: "AroxjBlog — Health, Medicine & Wellness",
  ru: "AroxjBlog — Здоровье, медицина и красота",
};

const HOME_DESCRIPTIONS: Record<Locales, string> = {
  am: "Կարդացեք վերջին հոդվածները առողջ ապրելակերպի, բժշկության, գեղեցկության և ճամփորդությունների մասին AroxjBlog-ում։",
  en: "Read the latest articles on healthy lifestyle, medicine, beauty and travel on AroxjBlog.",
  ru: "Читайте последние статьи о здоровом образе жизни, медицине, красоте и путешествиях на AroxjBlog.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locales }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale in HOME_TITLES ? locale : "am";
  const canonical = l === "am" ? BASE_URL : `${BASE_URL}/${l}`;

  return {
    title: HOME_TITLES[l],
    description: HOME_DESCRIPTIONS[l],
    alternates: {
      canonical,
      languages: {
        hy: BASE_URL,
        en: `${BASE_URL}/en`,
        ru: `${BASE_URL}/ru`,
        "x-default": BASE_URL,
      },
    },
    openGraph: {
      title: HOME_TITLES[l],
      description: HOME_DESCRIPTIONS[l],
      url: canonical,
      type: "website",
      siteName: "AroxjBlog",
    },
  };
}

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
		getPosts({ limit: 10, category: Categories.PROGRAM }),
		getPosts({ limit: 10, category: Categories.BEAUTY }),
		getPosts({ limit: 10, category: Categories.BODY_CARE }),
		getPosts({ limit: 10, category: Categories.HEALTY_FOOD }),
		getPosts({ limit: 10, category: Categories.DISEASES }),
		getPosts({ limit: 10, category: Categories.PSYCHOLOGY }),
		getPosts({ limit: 10, category: Categories.INTERVIEWS }),
		getPosts({ limit: 10, category: Categories.CHILD_CARE }),
		getPosts({ limit: 10, category: Categories.MEDICINE_OF_THE_FUTURE }),
		getPosts({ limit: 10, category: Categories.ANNOUNCEMENT }),
		getPosts({ limit: 10, category: Categories.CULTURE }),
		getPosts({ limit: 10, category: Categories.SPORT }),
		getPosts({ limit: 10, category: Categories.TRAVEL_NEWS }),
		getPosts({ limit: 10, category: Categories.RECIPE }),

    ]);
  const beautyData=[...beauty.data,...bodyCare.data,...healtyFood.data].sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,10)
  const diseasesData=[...diseases.data,...psychology.data,...interviews.data,...childCare.data,...medicineOfFuture.data].sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,10)
  const entertainmentData=[...announcement.data, ...cuture.data,...sport.data,...travel.data,...recipe.data].sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,10)

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
