import dotenv from "dotenv";

dotenv.config();
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? "mongodb://localhost:27017/video-player"
    : process.env.MONGODB_URI;
