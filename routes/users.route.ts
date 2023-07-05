import express from "express";
import {
  authUser,
  getUser,
  logoutUser,
  signUpUser,
  subscribe,
  unsubscribe,
  updateUser,
} from "../controllers/users.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protectUser, getUser);
router.route("/profile").patch(protectUser, updateUser);
router.route("/:channelId/subscribe").post(protectUser, subscribe);
router.route("/:channelId/unsubscribe").post(protectUser, unsubscribe);

export default router;
