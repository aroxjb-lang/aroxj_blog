import React from "react";
import {getAllPosts, getPosts} from '@/app/lib/actions/posts';

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
  const { data, pagesCount } = await getAllPosts({
    limit: 20,
    page: +page,
    search: search,
    category: category,
    sort: sort,
  });
  console.log(data);
  return <PostsPage locale={locale} data={structuredClone(data)} pagesCount={pagesCount} />;
}
