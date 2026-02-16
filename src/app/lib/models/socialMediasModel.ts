import mongoose from "mongoose";

const SocialMediaSchema = new mongoose.Schema(
  {
    icon: String,
    url: String,
  },
  { collection: "SocialMedia" },
);

export default mongoose.models.SocialMedia ||
  mongoose.model("SocialMedia", SocialMediaSchema, "socialMedia");
