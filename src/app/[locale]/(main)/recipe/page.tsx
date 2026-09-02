import PageComponent from "@/app/components/PageComponent";
import { getPosts, getTopPost } from "@/app/lib/actions/posts";
import { Categories, Locales } from "@/app/lib/schemas";
import React from "react";
import { Metadata } from "next";
import { getCategoryMetadata } from "@/app/lib/utilits/categoryMeta";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locales }> }): Promise<Metadata> {
  const { locale } = await params;
  return getCategoryMetadata('recipe', locale);
}

export default async function Recipe({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locales }>;
  searchParams: { [key: string]: string | undefined };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { data, pagesCount } = await getPosts({
    limit: 47,
    page,
    category: Categories.RECIPE,
  });
  const { locale } = await params;

  return (
    <div>
      <PageComponent data={data} locale={locale} pagesCount={pagesCount} />
    </div>
  );
}
