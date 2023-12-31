import express from "express";
import {
  createVideo,
  deleteVideo,
  dislikeVideoByVideoId,
  getAllVideos,
  getLikedVideosOfCurrentUser,
  getVideoByVideoId,
  getVideosByQuery,
  getVideosByUserId,
  getVideosOfCurrentUser,
  likeVideoByVideoId,
  undislikeVideoByVideoId,
  unlikeVideoByVideoId,
} from "../controllers/videos.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", getAllVideos);
router.get("/search", getVideosByQuery);
router.route("/me").get(protectUser, getVideosOfCurrentUser);
router.route("/liked/me").get(protectUser, getLikedVideosOfCurrentUser);
router.get("/:videoId", getVideoByVideoId);
router.get("/user/:userId", getVideosByUserId);
router.route("/create").post(protectUser, createVideo);
router.route("/:videoId/like").post(protectUser, likeVideoByVideoId);
router.route("/:videoId/unlike").post(protectUser, unlikeVideoByVideoId);
router.route("/:videoId/dislike").post(protectUser, dislikeVideoByVideoId);
router.route("/:videoId/undislike").post(protectUser, undislikeVideoByVideoId);
router.route("/:videoId").delete(protectUser, deleteVideo);

export default router;
