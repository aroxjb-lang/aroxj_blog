import React from "react";
import { getPosts } from "@/app/lib/actions/posts";

import { Locales } from "@/app/lib/schemas";

import PostsPage from "@/app/components/AdminsComponents/PostsPage";

export default async function Posts({
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
  const { data, pagesCount } = await getPosts({
    limit: 20,
    page: +page,
    search: search,
    category: category,
    sort: sort,
  });

  return <PostsPage locale={locale} data={structuredClone(data)} pagesCount={pagesCount} />;
}
