import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ title: "text", description: "text" });

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
