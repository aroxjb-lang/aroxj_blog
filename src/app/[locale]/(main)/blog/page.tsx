import PageComponent from "@/app/components/PageComponent";
import { getTopPost } from "@/app/lib/actions/posts";
import { Locales } from "@/app/lib/schemas";
import React from "react";

export default async function Blog({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locales }>;
  searchParams?: { [key: string]: string | undefined };
}) {
  const page = searchParams?.page || 1;
  const { data } = await getTopPost({ limit: 47, page });
  const { locale } = await params;

  return (
    <div>
      <PageComponent data={data} locale={locale} />
    </div>
  );
}
