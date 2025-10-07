import { getPostByID } from "@/app/lib/actions/posts";
import { MultilangualContentInterface } from "@/app/lib/schemas";
import { redirect } from "@/i18n/navigation";
import React from "react";

export default async function Post({
  params,
}: {
  params: Promise<{ post_id: string; locale: string }>;
}) {
  const { post_id, locale } = await params;

  const data = await getPostByID(post_id);
  if (!data) return redirect({ href: "/", locale });

  return (
    <div>
      {data.title[locale as keyof MultilangualContentInterface] ||
        data.title.am}
    </div>
  );
}
