import { getPostByID, getTopPost } from "@/app/lib/actions/posts";
import {  Locales } from "@/app/lib/schemas";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import styles from "../page.module.css";
import React, { Suspense } from "react";
import MostViewed from "@/app/components/MostViewed";
import LoadingCircule from "@/app/components/LoadingCircule";
import Card from "@/app/components/Card";
import { YouTubeEmbed } from "@next/third-parties/google";
import {log} from 'node:util';
import {Metadata} from 'next';
import ShareButtons from '@/app/components/shareButtons';
export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ post_id: string; locale: Locales }>;
}):Promise<Metadata> {
  const {post_id,locale} = await params;
  const post = await getPostByID(decodeURIComponent(post_id));

  return {
    title: post.title[locale]?post.title[locale]:post.title.am,

    description: post.content[locale]?post.content[locale]:post.content.am,

    openGraph: {
      title: post.title[locale]?post.title[locale]:post.title.am,
      description: post.content[locale]?post.content[locale]:post.content.am,
      images: ['https://aroxjblog.am/'+post.featured_media_paths?.[0]],
      url: `https://aroxjblog.am/${locale}/${post.slug}`,
      type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title[locale]?post.title[locale]:post.title.am,
      description: post.content[locale]?post.content[locale]:post.content.am,
      images: ['/'+post.featured_media_paths?.[0]],
    },
  };
}
export default async function PostByID({
  params,
}: {
  params: Promise<{ post_id: string; locale: Locales }>;
}) {
  const { post_id, locale } = await params;
  const id = decodeURIComponent(post_id);
  const t = await getTranslations();


  try {
    const data = await getPostByID(decodeURIComponent(post_id));

    const { data: closeData } = await getTopPost({ limit: 4, page: 1 });
    // if (!data) return redirect({ href: "/", locale });

    return (
      <div>
        <div className={styles.page}>
          <section className={styles.mostSection}>
            <div className={styles.topPost}>
              <h3 className={styles.sectionTitle}>
                {" "}
                {data.title[locale] || data.title.am}
              </h3>
              <div className={styles.post}>
                <img
                  src={'/'+
                  
                    ("featured_media_path" in data
                      ? data.featured_media_path
                      : data.featured_media_paths[0])
                  }
                  alt={data.title[locale] || data.title.am}
                  className={styles.postBanner}
                />
                <p className={styles.views}>
                  {data.views} {t("views")}
                </p>
                <p className={styles.content} dangerouslySetInnerHTML={{__html:data.content[locale] || data.content.am}}>
                  {/* {data.content[locale] || data.content.am} */}
                </p>

                {data.video_url &&
                  data.video_url !== "" &&
                  data.video_url[0] !== "" && (
                    <div className={styles.videoContainer}>
                      <YouTubeEmbed videoid={data.video_url} />
                    </div>
                  )}{" "}
                <ShareButtons title={data.title[locale]?data.title[locale]:data.title.am} url={`https://aroxjblog.am/${locale}/${encodeURI(data.slug)}`} />

              </div>

            </div>
            <div className={styles.mostViewWrapper}>
              <Suspense fallback={<LoadingCircule size={"2rem"} />}>
                <MostViewed locale={locale} />
              </Suspense>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}> {t("Related news")}</h3>
            <div className={styles.sectionCards}>
              {closeData.map((post) => (
                <div key={post.slug} className={styles.sectionItem}>
                  <Card locale={locale} post={post} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  } catch (e) {
    console.error(e);
    return redirect({ href: "/", locale });
  }
}
