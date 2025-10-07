export interface MultilangualContentInterface {
  am: string;
  en: string;
  ru: string;
}

export interface PostInterface {
  _id: number;
  type: string;
  title: MultilangualContentInterface;
  slug: string;
  content: MultilangualContentInterface;
  date: string;
  featured_media_path: string[] | string;
  suggested_blob_path: string[] | string;
  hashtags: string[];
  category: string;
  video_url: string;
}

export const BLOB_URL = "https://aroxjblog.am/wp-content/uploads/";
