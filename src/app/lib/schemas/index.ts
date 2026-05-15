export type Locales = "am" | "en" | "ru";

export type MultilangualContentInterface = Record<Locales, string>;

export interface PostInterface {
  _id: number;
  title: MultilangualContentInterface;
  content: MultilangualContentInterface;
  date: string;
  featured_media_path?: string;
  video_url: string;
  featured_media_paths: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  publishing_date:Date;
  hashtags: string[];
  category: string;
  views: number;
}

export enum Categories {
  POST = "post",
  BLOG = "blog",
  BEAUTY = "beauty",
  BODY_CARE = "body_care",
  TRAVEL_NEWS = "travel_news",
  HEALTY_FOOD = "healty_food",
  DISEASES = "diseases",
  PSYCHOLOGY = "psychology",
  INTERVIEWS = "interviews",
  CHILD_CARE = "child_care",
  MEDICINE_OF_THE_FUTURE = "medicine_of_the_future",
  PROGRAM = "program",
  ANNOUNCEMENT = "announcement",
  CULTURE = "culture",
  SPORT = "sport",
  RECIPE = "recipe",
}

export const BLOB_URL =
  "https://nnqeytgn7ealljhf.public.blob.vercel-storage.com/";
