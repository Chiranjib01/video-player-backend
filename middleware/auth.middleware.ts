import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { JWT_SECRET } from "../utils/constants.js";

export const protectUser = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let token;
    token = req.cookies.jwt_user;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET!);
        req.user = await User.findById(decoded.userId).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);
