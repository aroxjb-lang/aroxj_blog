import { MetadataRoute } from 'next';
import { getAllPosts } from '@/app/lib/actions/posts';

const BASE_URL = 'https://aroxjblog.am';
const LOCALES = ['am', 'en', 'ru'] as const;

function localizedUrl(path: string, locale: string): string {
  const base = locale === 'am' ? BASE_URL : `${BASE_URL}/${locale}`;
  return path === '/' ? base : `${base}${path}`;
}

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/about-us', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/archive', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { path: '/beauty', priority: 0.8, changeFrequency: 'daily' },
  { path: '/body-care', priority: 0.8, changeFrequency: 'daily' },
  { path: '/healthy-food', priority: 0.8, changeFrequency: 'daily' },
  { path: '/diseases', priority: 0.8, changeFrequency: 'daily' },
  { path: '/psychology', priority: 0.8, changeFrequency: 'daily' },
  { path: '/interviews', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/child-care', priority: 0.8, changeFrequency: 'daily' },
  { path: '/medicine-of-the-future', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/program', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/announcements', priority: 0.7, changeFrequency: 'daily' },
  { path: '/culture', priority: 0.8, changeFrequency: 'daily' },
  { path: '/sport', priority: 0.8, changeFrequency: 'daily' },
  { path: '/travel-news', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/recipe', priority: 0.8, changeFrequency: 'weekly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(path, locale),
      changeFrequency,
      priority,
    }))
  );

  const { data: posts } = await getAllPosts({ limit: 10000 });

  const postUrls: MetadataRoute.Sitemap = posts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(`/${encodeURIComponent(post.slug)}`, locale),
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticUrls, ...postUrls];
}
