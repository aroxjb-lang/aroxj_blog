import CreateUpdatePost from "@/app/components/AdminsComponents/CreateUpdatePost";
import { getPostByID } from "@/app/lib/actions/posts";
import { Locales } from "@/app/lib/schemas";
import { redirect } from "@/i18n/navigation";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ locale: Locales; slug: string }>;
}) {
  const { slug, locale } = await params;
  try {
    const data =
      slug === "addPost"
        ? {
            title: { am: "", en: "", ru: "" },
            content: { am: "", en: "", ru: "" },
            slug: "",
            category: "post",
            hashtags: [],
            video_url: "",
            views: 0,
            featured_media_paths: [],
              publishing_date:new Date()
          }
        : await getPostByID(decodeURIComponent(slug));

    if (!data) return redirect({ href: "/admin", locale });
    return (
      
        
        <CreateUpdatePost
          locale={locale}
          isAdd={slug === "addPost"}
          data={{
            title: data.title,
            content: data.content,
            slug: data.slug,
            category: data.category,
            hashtags: data.hashtags,
            video_url: data.video_url,
            views: data.views,
            featured_media_paths: data.featured_media_paths,
              publishing_date: data.publishing_date,
          }}
        />
      
    );
  } catch (e) {
    return redirect({ href: "/admin", locale });
  }
}
