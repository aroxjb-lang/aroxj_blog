export type Locales = "am" | "en" | "ru";

export type MultilangualContentInterface = Record<Locales, string>;

export interface PostInterface {
  _id: number;
  title: MultilangualContentInterface;
  slug: string;
  content: MultilangualContentInterface;
  date: string;
  featured_media_paths: string[];
  suggested_blob_paths: string[];
  hashtags: string[];
  category: string;
  video_url: string;
  views: number;
}

export const BLOB_URL = "https://aroxjblog.am/wp-content/uploads/";
