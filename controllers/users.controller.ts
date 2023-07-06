import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateTokenUser from "../utils/generateToken.user.js";
import mongoose from "mongoose";

// @method POST /api/users/signup
export const signUpUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    profilePicture,
    subscribers: [],
    subscribed: [],
  });
  if (user) {
    generateTokenUser(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      subscribers: user.subscribers,
      subscriberCount: user.subscriberCount,
      subscribed: user.subscribed,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @method POST /api/users/auth
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPasswords(password))) {
    generateTokenUser(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      subscribers: user.subscribers,
      subscriberCount: user.subscriberCount,
      subscribed: user.subscribed,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// @method POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt_user", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
});

// get current logged in user
// @method GET /api/users
export const getUser = asyncHandler(async (req: any, res) => {
  const user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    profilePicture: req.profilePicture,
    subscribers: req.subscribers,
    subscriberCount: req.subscriberCount,
    subscribed: req.subscribed,
  };
  res.status(200).json(user);
});

// @method GET /api/users/user/:userId
export const getUserById = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  }
  res.status(200).json(user);
});

// @method PATCH /api/users
export const updateUser = asyncHandler(async (req: any, res) => {
  const userData = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = userData.name || user.name;
    user.email = userData.email || user.email;
    user.profilePicture = userData.profilePicture || user.profilePicture;

    if (userData.password) {
      user.password = userData.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      subscribers: updatedUser.subscribers,
      subscriberCount: updatedUser.subscriberCount,
      subscribed: updatedUser.subscribed,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @method POST /api/users/:channelId/subscribe
export const subscribe = asyncHandler(async (req: any, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }
  const exists1: any = await User.find({ "subscribed.channelId": channelId });
  const exists2: any = await User.find({ "subscribers.channelId": userId });
  if (
    (exists1 && exists1.subscribers && exists1.subscribers.length !== 0) ||
    (exists2 && exists2.subscribers && exists2.subscribed.length !== 0)
  ) {
    res.json({ message: "already subscribed" });
    return;
  }
  user.subscribed = [...user.subscribed, { channelId }];
  await user.save();

  const channel = await User.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error("Channel Not Found");
  }
  channel.subscribers = [...channel.subscribers, { channelId: userId }];
  channel.subscriberCount = channel.subscriberCount + 1;
  const updatedChannel = await channel.save();

  const newUser = await User.findById(userId);
  res.status(200).json({
    success: true,
    message: "Channel Subscribed",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      subscribers: newUser.subscribers,
      subscriberCount: newUser.subscriberCount,
      subscribed: newUser.subscribed,
    },
    channel: {
      _id: updatedChannel._id,
      name: updatedChannel.name,
      email: updatedChannel.email,
      profilePicture: updatedChannel.profilePicture,
      subscribers: updatedChannel.subscribers,
      subscriberCount: updatedChannel.subscriberCount,
      subscribed: updatedChannel.subscribed,
    },
  });
});

// @method POST /api/users/:channelId/unsubscribe
export const unsubscribe = asyncHandler(async (req: any, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }
  const exists1 = await User.find({ "subscribed.channelId": channelId });
  const exists2 = await User.find({ "subscribers.channelId": userId });
  if (exists1.length === 0 || exists2.length === 0) {
    res.json({ message: "already unsubscribed" });
    return;
  }
  user.subscribed = user.subscribed.filter(
    (item: any) => item.channelId !== channelId
  );
  await user.save();

  const channel = await User.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error("Channel Not Found");
  }
  channel.subscribers = channel.subscribers.filter(
    (item: any) => item.channelId !== userId.toString()
  );
  channel.subscriberCount = channel.subscriberCount - 1;
  const updatedChannel = await channel.save();

  const newUser = await User.findById(userId);
  res.status(200).json({
    success: true,
    message: "Channel Unsubscribed",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      subscribers: newUser.subscribers,
      subscriberCount: newUser.subscriberCount,
      subscribed: newUser.subscribed,
    },
    channel: {
      _id: updatedChannel._id,
      name: updatedChannel.name,
      email: updatedChannel.email,
      profilePicture: updatedChannel.profilePicture,
      subscribers: updatedChannel.subscribers,
      subscriberCount: updatedChannel.subscriberCount,
      subscribed: updatedChannel.subscribed,
    },
  });
});
