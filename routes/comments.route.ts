import express from "express";
import {
  deleteComment,
  getCommentsByVideoId,
  postComment,
} from "../controllers/comments.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:videoId", getCommentsByVideoId);
router.route("/:videoId").post(protectUser, postComment);
router.route("/:videoId").delete(protectUser, deleteComment);

export default router;
