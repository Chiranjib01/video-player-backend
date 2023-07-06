import express from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoByVideoId,
  getVideosByQuery,
  getVideosByUserId,
} from "../controllers/videos.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", getAllVideos);
router.get("/search", getVideosByQuery);
router.get("/:videoId", getVideoByVideoId);
router.get("/user/:userId", getVideosByUserId);
router.route("/create").post(protectUser, createVideo);
router.route("/:videoId").delete(protectUser, deleteVideo);

export default router;
