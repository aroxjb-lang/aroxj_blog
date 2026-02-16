import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
  {
    text: String,
  },
  { collection: "AboutUs" },
);

export default mongoose.models.AboutUs ||
  mongoose.model("AboutUs", AboutUsSchema, "aboutUs");
