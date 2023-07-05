import jwt from "jsonwebtoken";
import { Response } from "express";
import { JWT_SECRET } from "./constants";

const generateTokenUser = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET!, {
    expiresIn: "10d",
  });
  res.cookie("jwt_user", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
};

export default generateTokenUser;
