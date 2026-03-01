import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { en: String, am: String, ru: String },
    slug: { required: true, type: String, unique: true },
    content: { en: String, am: String, ru: String },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    featured_media_path: String,
    featured_media_paths: [String],
    suggested_blob_paths: [String],
    hashtags: [String],
    category: [String],
    video_url: [String],
    views: Number,
  },
  { collection: "contents" },
);
PostSchema.index({
  "title.en": "text",
  "title.am": "text",
  "title.ru": "text",
  hashtags: "text",
});
export default mongoose.models.Contents ||
  mongoose.model("Contents", PostSchema, "contents");
