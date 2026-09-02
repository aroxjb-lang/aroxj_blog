import { Metadata } from 'next';
import { Locales } from '../schemas';

const BASE_URL = 'https://aroxjblog.am';

type CategoryKey =
  | 'blog' | 'beauty' | 'body-care' | 'healthy-food' | 'diseases'
  | 'psychology' | 'interviews' | 'child-care' | 'medicine-of-the-future'
  | 'program' | 'announcements' | 'culture' | 'sport' | 'travel-news' | 'recipe';

const CATEGORY_META: Record<CategoryKey, Record<Locales, { title: string; description: string }>> = {
  blog: {
    am: { title: 'Բլոգ', description: 'Կարդացեք AroxjBlog-ի բլոգային հոդվածները առողջ ապրելակերպի և բժշկության մասին։' },
    en: { title: 'Blog', description: 'Read AroxjBlog articles on healthy living and medicine.' },
    ru: { title: 'Блог', description: 'Читайте статьи AroxjBlog о здоровом образе жизни и медицине.' },
  },
  beauty: {
    am: { title: 'Գեղեցկություն', description: 'Հոդվածներ գեղեցկության, մաշկի խնամքի և ոճի մասին AroxjBlog-ում։' },
    en: { title: 'Beauty', description: 'Articles on beauty, skincare and style at AroxjBlog.' },
    ru: { title: 'Красота', description: 'Статьи о красоте, уходе за кожей и стиле на AroxjBlog.' },
  },
  'body-care': {
    am: { title: 'Մարմնի խնամք', description: 'Հոդվածներ մարմնի խնամքի, ֆիզիկական ակտիվության և վերականգնման մասին։' },
    en: { title: 'Body Care', description: 'Articles on body care, physical activity and recovery at AroxjBlog.' },
    ru: { title: 'Уход за телом', description: 'Статьи об уходе за телом, физической активности и восстановлении на AroxjBlog.' },
  },
  'healthy-food': {
    am: { title: 'Առողջ սնունդ', description: 'Հոդվածներ առողջ սնվելու, դիետայի և սննդային արժեքի մասին AroxjBlog-ում։' },
    en: { title: 'Healthy Food', description: 'Articles on healthy eating, diet and nutrition at AroxjBlog.' },
    ru: { title: 'Здоровое питание', description: 'Статьи о здоровом питании, диете и питательной ценности на AroxjBlog.' },
  },
  diseases: {
    am: { title: 'Հիվանդություններ', description: 'Հոդվածներ հիվանդությունների, ախտանիշների և բուժման մասին AroxjBlog-ում։' },
    en: { title: 'Diseases', description: 'Articles on diseases, symptoms and treatments at AroxjBlog.' },
    ru: { title: 'Болезни', description: 'Статьи о болезнях, симптомах и лечении на AroxjBlog.' },
  },
  psychology: {
    am: { title: 'Հոգեբանություն', description: 'Հոդվածներ հոգեկան առողջության, հոգեբանության և ինքնաբացահայտման մասին AroxjBlog-ում։' },
    en: { title: 'Psychology', description: 'Articles on mental health, psychology and self-discovery at AroxjBlog.' },
    ru: { title: 'Психология', description: 'Статьи о психическом здоровье, психологии и саморазвитии на AroxjBlog.' },
  },
  interviews: {
    am: { title: 'Հարցազրույցներ', description: 'Հարցազրույցներ բժիշկների, մասնագետների և հայտնի անձանց հետ AroxjBlog-ում։' },
    en: { title: 'Interviews', description: 'Interviews with doctors, specialists and public figures at AroxjBlog.' },
    ru: { title: 'Интервью', description: 'Интервью с врачами, специалистами и известными людьми на AroxjBlog.' },
  },
  'child-care': {
    am: { title: 'Մանկական խնամք', description: 'Հոդվածներ երեխաների առողջության, խնամքի և զարգացման մասին AroxjBlog-ում։' },
    en: { title: 'Child Care', description: 'Articles on children\'s health, care and development at AroxjBlog.' },
    ru: { title: 'Уход за детьми', description: 'Статьи о здоровье, уходе и развитии детей на AroxjBlog.' },
  },
  'medicine-of-the-future': {
    am: { title: 'Ապագայի բժշկություն', description: 'Հոդվածներ ժամանակակից բժշկության, նոր տեխնոլոգիաների և հետազոտությունների մասին AroxjBlog-ում։' },
    en: { title: 'Medicine of the Future', description: 'Articles on modern medicine, new technologies and research at AroxjBlog.' },
    ru: { title: 'Медицина будущего', description: 'Статьи о современной медицине, новых технологиях и исследованиях на AroxjBlog.' },
  },
  program: {
    am: { title: 'Հաղորդաշար', description: 'AroxjBlog-ի հաղորդաշարերի և բժշկական ծրագրերի մասին նյութեր։' },
    en: { title: 'Program', description: 'Materials on AroxjBlog programs and medical shows.' },
    ru: { title: 'Программа', description: 'Материалы о программах и медицинских шоу AroxjBlog.' },
  },
  announcements: {
    am: { title: 'Հայտարարություններ', description: 'AroxjBlog-ի արդիական հայտարարություններ, բժշկական միջոցառումներ և նորություններ։' },
    en: { title: 'Announcements', description: 'Latest announcements, medical events and news from AroxjBlog.' },
    ru: { title: 'Объявления', description: 'Актуальные объявления, медицинские мероприятия и новости от AroxjBlog.' },
  },
  culture: {
    am: { title: 'Մշակույթ', description: 'Հոդվածներ մշակույթի, ավանդույթների և կենցաղի մասին AroxjBlog-ում։' },
    en: { title: 'Culture', description: 'Articles on culture, traditions and lifestyle at AroxjBlog.' },
    ru: { title: 'Культура', description: 'Статьи о культуре, традициях и образе жизни на AroxjBlog.' },
  },
  sport: {
    am: { title: 'Սպորտ', description: 'Հոդվածներ սպորտի, ֆիզիկական ակտիվության և առողջ ապրելակերպի մասին AroxjBlog-ում։' },
    en: { title: 'Sport', description: 'Articles on sports, physical activity and healthy lifestyle at AroxjBlog.' },
    ru: { title: 'Спорт', description: 'Статьи о спорте, физической активности и здоровом образе жизни на AroxjBlog.' },
  },
  'travel-news': {
    am: { title: 'Ճամփորդական նորություններ', description: 'Հոդվածներ ճամփորդությունների, հանգստի և արկածների մասին AroxjBlog-ում։' },
    en: { title: 'Travel News', description: 'Articles on travel, relaxation and adventures at AroxjBlog.' },
    ru: { title: 'Новости путешествий', description: 'Статьи о путешествиях, отдыхе и приключениях на AroxjBlog.' },
  },
  recipe: {
    am: { title: 'Բաղադրատոմս', description: 'Առողջ, համեղ բաղադրատոմսեր AroxjBlog-ի խոհանոցային բաժնում։' },
    en: { title: 'Recipe', description: 'Healthy and delicious recipes in the AroxjBlog kitchen section.' },
    ru: { title: 'Рецепты', description: 'Здоровые и вкусные рецепты в кулинарном разделе AroxjBlog.' },
  },
};

export function getCategoryMetadata(category: CategoryKey, locale: Locales): Metadata {
  const meta = CATEGORY_META[category][locale] ?? CATEGORY_META[category].am;
  const path = `/${category}`;
  const canonicalLocale = locale === 'am' ? BASE_URL : `${BASE_URL}/${locale}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${canonicalLocale}${path}`,
      languages: {
        hy: `${BASE_URL}${path}`,
        en: `${BASE_URL}/en${path}`,
        ru: `${BASE_URL}/ru${path}`,
      },
    },
    openGraph: {
      title: `${meta.title} | AroxjBlog`,
      description: meta.description,
      url: `${canonicalLocale}${path}`,
      type: 'website',
      siteName: 'AroxjBlog',
    },
  };
}
