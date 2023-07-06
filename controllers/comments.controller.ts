import asyncHandler from "express-async-handler";
import Comment from "../models/Comment";
import Video from "../models/Video";
import User from "../models/User";

// @method POST /api/comments/:videoId
export const postComment = asyncHandler(async (req: any, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    res.status(400).json({ message: "Video not found" });
  }
  const { text } = req.body;
  const comment = await Comment.create({
    userId,
    videoId,
    text,
    userName: user.name,
    userProfilePicture: user.profilePicture,
  });
  if (comment) {
    res.status(201).json(comment);
  } else {
    res.status(500).json({ message: "Some error occured" });
  }
});

// @method GET /api/comments/:videoId
export const getCommentsByVideoId = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    res.status(400).json({ message: "Video not found" });
  }
  const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
  res.status(200).json(comments);
});

// @method DELETE /api/comments/:videoId
export const deleteComment = asyncHandler(async (req: any, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    res.status(400).json({ message: "Video not found" });
  }
  const { commentid } = req.headers;
  const comment = await Comment.findByIdAndDelete(commentid);
  if (comment) {
    res.status(200).json(comment);
  } else {
    res.status(500).json({ message: "Some error occured" });
  }
});
