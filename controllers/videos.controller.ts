import asyncHandler from "express-async-handler";
import Video from "../models/Video.js";
import User from "../models/User.js";

// @method POST /api/videos/create
export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, url, thumbnail, tags, userId } = req.body;
  const video = await Video.create({
    title,
    description,
    url,
    thumbnail,
    tags,
    userId,
    likes: [],
  });
  if (video) {
    res.status(201).json({
      _id: video._id,
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      description: video.description,
      userId: video.userId,
      tags: video.tags,
      likes: video.likes,
    });
  } else {
    res.status(400);
    throw new Error("Some error occured");
  }
});

// @method DELETE /api/videos/:videoId
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.videoId);
  res.json(video);
});

// helper for the next function
const getVideos = async (videos: any) => {
  const data = videos.map(async (video: any) => {
    const user = await User.findById(video.userId);
    const userName = user.name;
    const userProfilePicture = user.profilePicture;
    return { ...video["_doc"], userName, userProfilePicture };
  });
  return Promise.all(data);
};
// @method GET /api/videos
export const getAllVideos = asyncHandler(async (req: any, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  const newVideos = await getVideos(videos);
  res.status(200).json(newVideos);
});

// @method GET /api/videos/user/:userId
export const getVideosByUserId = asyncHandler(async (req, res) => {
  const videos = await Video.find({
    userId: req.params.userId,
  }).sort({ createdAt: -1 });
  res.status(200).json(videos);
});

// @method GET /api/videos/:videoId
export const getVideoByVideoId = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  if (video) {
    res.status(200).json(video);
  } else {
    res.status(404).json({ message: "video not found" });
  }
});

// @method GET /api/videos/search
export const getVideosByQuery = asyncHandler(async (req: any, res) => {
  let { q } = req.query;
  const videos = await Video.find({ $text: { $search: q } }).collation({
    locale: "en",
    strength: 2,
  });
  res.json(videos);
});
