import PageComponent from "@/app/components/PageComponent";
import { getArchive, getTopPost } from "@/app/lib/actions/posts";
import { Locales } from "@/app/lib/schemas";
import React from "react";

export default async function Archive({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locales }>;
  searchParams: Promise<{
    page: string;
    search: string;
    category: string;
    sort: "asc" | "desc";
  }>;
}) {
  const { locale } = await params;
  const { page, search, category, sort } = await searchParams;
  const { data, pagesCount } = await getArchive({
    limit: 47,
    page: page ? +page : 1,
  });

  
  return (
    <div>
      <PageComponent data={data} locale={locale} pagesCount={pagesCount} />
    </div>
  );
}
